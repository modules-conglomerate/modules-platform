import os
import logging
import uuid
import hashlib
import requests
import asyncio
from threading import Thread
from http.server import BaseHTTPRequestHandler, HTTPServer
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, filters, ContextTypes, ConversationHandler,
    PreCheckoutQueryHandler,
)

# ── Состояния диалога ────────────────────────────────────────────────────────
WAITING_AMOUNT = 1
WAITING_ADDRESS = 2

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN          = os.getenv("BOT_TOKEN")
SUPABASE_URL       = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL       = "https://modules-platform.vercel.app"
STARS_PRICE        = 1  # 12 000 звёздочек
METAL_CARD_IMAGE   = "https://modules-platform.vercel.app/invest-card-back.png"  # ← замени на реальный URL

def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

def get_objects():
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/objects?select=id,name,slug,status&is_public=eq.true&order=name",
            headers=sb_headers(), timeout=10,
        )
        return r.json()
    except Exception as e:
        logger.error(f"get_objects: {e}")
        return []

def find_card_by_telegram(telegram_id: int):
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}&select=*",
            headers=sb_headers(), timeout=10,
        )
        data = r.json()
        return data[0] if data else None
    except Exception as e:
        logger.error(f"find_card_by_telegram: {e}")
        return None

def create_mi_card(telegram_id: int, telegram_username: str) -> str:
    # Генерируем уникальный номер (8 цифр)
    hash_val = hashlib.md5(f"{telegram_id}{uuid.uuid4()}".encode()).hexdigest()
    number = str(int(hash_val[:8], 16))[:8].zfill(8)
    mi_number = f"МИ-{number}"

    try:
        requests.post(
            f"{SUPABASE_URL}/rest/v1/investor_cards",
            headers=sb_headers(),
            json={
                "card_number": mi_number,
                "telegram_id": telegram_id,
                "telegram_username": telegram_username,
                "level": "resident",
                "is_active": True,
                "total_invested": 0,
            },
            timeout=10,
        )
    except Exception as e:
        logger.error(f"create_mi_card: {e}")

    return mi_number

def save_investment(card_id: str, object_id: str, amount_ton: float, tx_hash: str):
    try:
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/investments",
            headers=sb_headers(),
            json={
                "card_id": card_id,
                "object_id": object_id,
                "amount_ton": amount_ton,
                "tx_hash": tx_hash,
                "status": "confirmed",
            },
            timeout=10,
        )
        return r.status_code in (200, 201)
    except Exception as e:
        logger.error(f"save_investment: {e}")
        return False

def update_card_qualified(telegram_id: int):
    try:
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
            headers=sb_headers(),
            json={"is_qualified": True},
            timeout=10,
        )
    except Exception as e:
        logger.error(f"update_card_qualified: {e}")

# ── /start ────────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tg_id = update.effective_user.id
    tg_username = update.effective_user.username or str(tg_id)

    card = find_card_by_telegram(tg_id)

    if card:
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nС возвращением!\n\nВаша карта: *{card['card_number']}*"
    else:
        mi_number = create_mi_card(tg_id, tg_username)
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nВаш номер: *{mi_number}*"

    keyboard = [
        [InlineKeyboardButton("💳 Заказать металлическую карту (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await update.message.reply_text(
        welcome, parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

# ── Заказ металлической карты ──────────────────────────────────────────────
async def order_card_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    tg_id = update.effective_user.id
    card = find_card_by_telegram(tg_id)

    if not card:
        await query.edit_message_text("❌ Карта не найдена. Нажмите /start.")
        return

    await query.edit_message_text(
        f"💳 *Заказ металлической карты*\n\n"
        f"Номер: *{card['card_number']}*\n"
        f"Стоимость: *12 000 ⭐*\n\n"
        f"После оплаты вы получите дизайн карты и статус «Квалифицированный инвестор».",
        parse_mode="Markdown",
    )

    # Отправляем счёт
    await context.bot.send_invoice(
        chat_id=query.message.chat_id,
        title="Металлическая карта инвестора",
        description="Дизайн карты + статус квалифицированного инвестора",
        payload=f"order_card_{tg_id}",
        provider_token="",  # Telegram Stars
        currency="XTR",
        prices=[LabeledPrice("Металлическая карта", STARS_PRICE)],
    )

# ── Предчек ──────────────────────────────────────────────────────────────────
async def pre_checkout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query
    await query.answer(ok=True)

# ── Успешная оплата ──────────────────────────────────────────────────────────
async def success_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tg_id = update.effective_user.id
    card = find_card_by_telegram(tg_id)

    if not card:
        await update.message.reply_text("❌ Карта не найдена. Нажмите /start.")
        return

    # Обновляем статус в базе
    update_card_qualified(tg_id)

    # Отправляем дизайн карты
    await context.bot.send_photo(
        chat_id=update.effective_chat.id,
        photo=METAL_CARD_IMAGE,
        caption=f"💳 *Ваш дизайн карты готов!*\n\nНомер: *{card['card_number']}*\nСтатус: **Квалифицированный инвестор**",
        parse_mode="Markdown",
    )

    # Запрашиваем адрес доставки
    await update.message.reply_text(
        "✉️ Введите адрес доставки (улица, дом, квартира, город, индекс):",
    )
    return WAITING_ADDRESS

# ── Обработка адреса доставки ──────────────────────────────────────────────
async def process_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    address = update.message.text.strip()
    tg_id = update.effective_user.id
    card = find_card_by_telegram(tg_id)

    if not card:
        await update.message.reply_text("❌ Карта не найдена. Нажмите /start.")
        return

    # Сохраняем адрес в базу (например, в поле `delivery_address`)
    try:
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{tg_id}",
            headers=sb_headers(),
            json={"delivery_address": address},
            timeout=10,
        )
        await update.message.reply_text(f"✅ Адрес сохранён: {address}")
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка сохранения адреса: {e}")

    context.user_data.clear()
    return ConversationHandler.END

# ── Инвестировать ─────────────────────────────────────────────────────────────
async def invest_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    tg_id = update.effective_user.id
    card = find_card_by_telegram(tg_id)

    if not card:
        await query.edit_message_text("❌ Карта не найдена. Нажмите /start.")
        return

    context.user_data["card_id"] = card["id"]
    context.user_data["mi_number"] = card["card_number"]

    objects = get_objects()
    if not objects:
        await query.edit_message_text("Объекты не найдены. Попробуйте позже.")
        return

    buttons = []
    for o in objects[:10]:
        icon = "🟡" if o["status"] == "construction" else "🟢"
        buttons.append([InlineKeyboardButton(f"{icon} {o['name']}", callback_data=f"obj_{o['id']}")])

    await query.edit_message_text(
        f"🏗 Выберите объект для инвестирования:\n\nКарта: *{card['card_number']}*",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons),
    )
    return WAITING_AMOUNT

# ── Выбрать объект ────────────────────────────────────────────────────────────
async def process_object(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    obj_id = query.data.replace("obj_", "")

    objects = get_objects()
    obj = next((o for o in objects if o["id"] == obj_id), None)
    obj_name = obj["name"] if obj else "Объект"

    context.user_data["object_id"] = obj_id
    context.user_data["object_name"] = obj_name

    await query.edit_message_text(
        f"🏗 *{obj_name}*\n\nВведите сумму инвестиции в TON:\n\n_Минимум: 1 TON_",
        parse_mode="Markdown",
    )
    return WAITING_AMOUNT

# ── Ввести сумму ──────────────────────────────────────────────────────────────
async def process_amount(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        amount = float(update.message.text.strip().replace(",", "."))
        if amount < 1:
            raise ValueError
    except ValueError:
        await update.message.reply_text("❌ Введите корректную сумму (минимум 1 TON)")
        return WAITING_AMOUNT

    context.user_data["amount"] = amount
    data = context.user_data

    keyboard = [
        [InlineKeyboardButton(f"💎 Подтвердить {amount} TON", callback_data=f"pay_{amount}")],
        [InlineKeyboardButton("❌ Отмена", callback_data="cancel")],
    ]
    await update.message.reply_text(
        f"📋 *Подтверждение*\n\n"
        f"Объект: {data.get('object_name')}\n"
        f"Сумма: *{amount} TON*\n"
        f"Карта: {data.get('mi_number')}",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )
    return WAITING_AMOUNT

# ── Подтвердить оплату ────────────────────────────────────────────────────────
async def pay_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = context.user_data

    tx_hash = f"TX-{uuid.uuid4().hex[:8].upper()}"
    success = save_investment(
        card_id=data.get("card_id"),
        object_id=data.get("object_id"),
        amount_ton=data.get("amount"),
        tx_hash=tx_hash,
    )

    if success:
        await query.edit_message_text(
            f"✅ *Инвестиция зафиксирована!*\n\n"
            f"Объект: {data.get('object_name')}\n"
            f"Сумма: *{data.get('amount')} TON*\n"
            f"Карта: {data.get('mi_number')}\n"
            f"TX: `{tx_hash}`\n\n"
            f"[Открыть личный кабинет]({PLATFORM_URL}/dashboard)",
            parse_mode="Markdown",
        )
    else:
        await query.edit_message_text("❌ Ошибка сохранения. Попробуйте позже.")

    context.user_data.clear()
    return

# ── Портфель ──────────────────────────────────────────────────────────────────
async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        f"📊 Ваш инвестиционный портфель:\n{PLATFORM_URL}/dashboard"
    )

# ── Отмена ────────────────────────────────────────────────────────────────────
async def cancel_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text("Операция отменена.")
    context.user_data.clear()

# ── Health check ──────────────────────────────────────────────────────────────
class HealthCheck(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, fmt, *args): return

def run_web_server():
    port = int(os.getenv("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthCheck)
    logger.info(f"Health server :{port}")
    server.serve_forever()

# ── Запуск ────────────────────────────────────────────────────────────────────
async def run_bot():
    app = Application.builder().token(BOT_TOKEN).build()

    # ConversationHandler для заказа карты (адрес доставки)
    card_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.SUCCESSFUL_PAYMENT, success_payment)],
        states={
            WAITING_ADDRESS: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, process_address),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
    )

    # ConversationHandler для инвестиций
    invest_conv = ConversationHandler(
        entry_points=[CallbackQueryHandler(invest_callback, pattern="^invest$")],
        states={
            WAITING_AMOUNT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, process_amount),
                CallbackQueryHandler(pay_callback, pattern="^pay_"),
                CallbackQueryHandler(cancel_callback, pattern="^cancel$"),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(order_card_callback, pattern="^order_card$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(PreCheckoutQueryHandler(pre_checkout))
    app.add_handler(card_conv)
    app.add_handler(invest_conv)

    logger.info("Bot started")
    await app.initialize()
    await app.updater.start_polling(drop_pending_updates=True)
    await app.start()

    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    Thread(target=run_web_server, daemon=True).start()
    asyncio.run(run_bot())

import os
import logging
import uuid
import requests
import asyncio
from threading import Thread
from http.server import BaseHTTPRequestHandler, HTTPServer
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,  # ← ВАЖНО
    PreCheckoutQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)

# ── Состояние диалога ─────────────────────────────────────────────────────────
ASK_ADDRESS = 1

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN        = os.getenv("BOT_TOKEN")
SUPABASE_URL     = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL     = "https://modules-platform.vercel.app"
STARS_PRICE      = 12000
METAL_CARD_IMAGE = "assets/invest-card-front.png"

def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

# ── Проверить: есть ли у пользователя карта ──────────────────────────────────
def find_card_by_telegram(telegram_id: int):
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}&select=*",
            headers=sb_headers(),
            timeout=8,
        )
        data = r.json()
        return data[0] if data else None
    except Exception as e:
        logger.warning(f"find_card error: {e}")
        return None

# ── Создать карту (после оплаты) ─────────────────────────────────────────────
def create_mi_card(telegram_id: int, telegram_username: str) -> str:
    # Генерируем 8-значный номер
    unique_code = f"МИ-{uuid.uuid4().hex[:8].upper()}"
    try:
        requests.post(
            f"{SUPABASE_URL}/rest/v1/investor_cards",
            headers=sb_headers(),
            json={
                "card_number": unique_code,
                "telegram_id": telegram_id,
                "telegram_username": telegram_username,
                "level": "resident",
                "is_active": True,
                "is_qualified": True,
                "total_invested": 0,
            },
            timeout=10,
        )
    except Exception as e:
        logger.error(f"create_mi_card error: {e}")
    return unique_code

# ── Отправить инвойс ──────────────────────────────────────────────────────────
async def send_invoice(chat_id: int, telegram_id: int, context):
    await context.bot.send_invoice(
        chat_id=chat_id,
        title="Металлическая карта Модули",
        description="Дизайн карты + статус квалифицированного инвестора",
        payload=f"order_card_{telegram_id}",
        provider_token="",
        currency="XTR",
        prices=[LabeledPrice("Металлическая карта", STARS_PRICE)],
    )

# ── /start ────────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id
    tg_username = update.effective_user.username or str(telegram_id)

    card = find_card_by_telegram(telegram_id)

    if card:
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nС возвращением!\n\nВаша карта: *{card['card_number']}*"
    else:
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nДобро пожаловать!\n\nДля получения карты оплатите *12 000 ⭐*."

    keyboard = [
        [InlineKeyboardButton("💳 Заказать металлическую карту (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await update.message.reply_text(
        welcome, parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

# ── Заказ карты ───────────────────────────────────────────────────────────────
async def order_card_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    telegram_id = update.effective_user.id

    card = find_card_by_telegram(telegram_id)
    if card:
        await query.edit_message_text(
            f"💳 Карта уже есть: *{card['card_number']}*",
            parse_mode="Markdown",
        )
        return

    await query.edit_message_text(
        "💳 *Заказ металлической карты*\n\nСтоимость: *12 000 ⭐*",
        parse_mode="Markdown",
    )

    await send_invoice(query.message.chat_id, telegram_id, context)

# ── Pre-checkout ──────────────────────────────────────────────────────────────
async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query
    await query.answer(ok=True)

# ── Успешная оплата ───────────────────────────────────────────────────────────
async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    payment = update.message.successful_payment
    payload = payment.invoice_payload  # order_card_telegram_id

    parts = payload.split("_", 1)
    if len(parts) < 2:
        await update.message.reply_text("⚠️ Ошибка: неверный payload")
        return

    telegram_id = parts[1]
    tg_username = update.effective_user.username or str(telegram_id)

    card = find_card_by_telegram(telegram_id)
    if card:
        await update.message.reply_text(
            f"✅ Карта уже есть: *{card['card_number']}*",
            parse_mode="Markdown",
        )
        return

    mi_number = create_mi_card(telegram_id, tg_username)

    # Отправляем фото карты
    with open(METAL_CARD_IMAGE, 'rb') as f:
        await context.bot.send_photo(
            chat_id=update.effective_chat.id,
            photo=f,
            caption=f"💳 *Ваша карта готова!*\n\nНомер: *{mi_number}*\nСтатус: **Квалифицированный инвестор**",
            parse_mode="Markdown",
        )

    await update.message.reply_text(
        "✉️ Введите адрес доставки (улица, дом, квартира, город, индекс):",
    )
    return ASK_ADDRESS

# ── Получить адрес → записать в базу ─────────────────────────────────────────
async def get_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    address = update.message.text
    telegram_id = update.effective_user.id
    tg_username = update.effective_user.username or str(telegram_id)

    card = find_card_by_telegram(telegram_id)
    if not card:
        await update.message.reply_text("⚠️ Карта не найдена. Напишите в поддержку.")
        return ConversationHandler.END

    try:
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
            headers=sb_headers(),
            json={"delivery_address": address},
            timeout=10,
        )
        await update.message.reply_text(f"✅ Адрес сохранён: {address}")
    except Exception as e:
        logger.error(f"get_address error: {e}")
        await update.message.reply_text("⚠️ Ошибка сохранения адреса. Напишите в поддержку.")
    return ConversationHandler.END

# ── Портфель ──────────────────────────────────────────────────────────────────
async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        f"📊 Ваш портфель:\n{PLATFORM_URL}/dashboard"
    )

# ── Health check сервер ──────────────────────────────────────────────────────
class HealthCheck(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, fmt, *args): return

def run_web_server():
    port = int(os.getenv("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthCheck)
    logger.info(f"Health server on :{port}")
    server.serve_forever()

# ── Запуск ────────────────────────────────────────────────────────────────────
async def run_bot_async():
    app = Application.builder().token(BOT_TOKEN).build()

    conv = ConversationHandler(
        entry_points=[
            MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback),
        ],
        states={
            ASK_ADDRESS: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_address),
            ],
        },
        fallbacks=[
            CommandHandler("start", start),
        ],
        allow_reentry=True,
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(order_card_callback, pattern="^order_card$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    app.add_handler(conv)

    logger.info("Bot starting...")
    await app.initialize()
    await app.updater.start_polling(drop_pending_updates=True)
    await app.start()

    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    Thread(target=run_web_server, daemon=True).start()
    asyncio.run(run_bot_async())

import os
import logging
import uuid
import requests
import asyncio
from threading import Thread
from http.server import BaseHTTPRequestHandler, HTTPServer
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)

# ── Состояния диалога ────────────────────────────────────────────────────────
WAITING_MI_NUMBER = 1
WAITING_OBJECT = 2
WAITING_AMOUNT = 3

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL = "https://modules-platform.vercel.app"

# ── Supabase headers ──────────────────────────────────────────────────────────
def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

# ── Получить список объектов ────────────────────────────────────────────────
def get_objects():
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/objects?select=id,name,slug,status&is_public=eq.true&order=name",
            headers=sb_headers(),
            timeout=10,
        )
        return r.json()
    except Exception as e:
        logger.error(f"get_objects error: {e}")
        return []

# ── Найти карту по номеру ────────────────────────────────────────────────────
def find_card(mi_number: str):
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/investor_cards?card_number=eq.{mi_number}&select=*",
            headers=sb_headers(),
            timeout=10,
        )
        data = r.json()
        return data[0] if data else None
    except Exception as e:
        logger.error(f"find_card error: {e}")
        return None

# ── Записать инвестицию в базу ──────────────────────────────────────────────
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
        logger.error(f"save_investment error: {e}")
        return False

# ── /start ────────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("⬡ Инвестировать в объект", callback_data="invest")],
        [InlineKeyboardButton("📊 Мой портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await update.message.reply_text(
        "⬡ *МОДУЛИ ИНВЕСТ*\n\n"
        "Добро пожаловать в инвестиционную программу конгломерата Модули.\n\n"
        "Инвестирование осуществляется в TON-коинах.",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

# ── Callback: Инвестировать ──────────────────────────────────────────────────
async def invest_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "🔑 Введите номер инвестиционной карты:\n\nФормат: *МИ-XXXXXXXX* (8 цифр)",
        parse_mode="Markdown",
    )
    return WAITING_MI_NUMBER

# ── Получить номер карты ─────────────────────────────────────────────────────
async def process_mi_number(update: Update, context: ContextTypes.DEFAULT_TYPE):
    mi_input = update.message.text.strip().upper()
    if not mi_input.startswith("МИ-") or len(mi_input) != 11:
        await update.message.reply_text(
            "❌ Неверный формат. Используйте МИ-XXXXXXXX (8 цифр после МИ-)"
        )
        return WAITING_MI_NUMBER

    card = find_card(mi_input)
    if not card:
        await update.message.reply_text(
            "❌ Карта не найдена. Проверьте номер или приобретите карту на платформе."
        )
        return WAITING_MI_NUMBER

    context.user_data["mi_number"] = mi_input
    context.user_data["card_id"] = card["id"]

    objects = get_objects()
    if not objects:
        await update.message.reply_text("Объекты не найдены. Попробуйте позже.")
        return WAITING_MI_NUMBER

    buttons = []
    for o in objects[:10]:
        icon = "🟡" if o["status"] == "construction" else "🟢"
        buttons.append(
            [InlineKeyboardButton(f"{icon} {o['name']}", callback_data=f"obj_{o['id']}")]
        )
    await update.message.reply_text(
        f"✅ Карта *{mi_input}* найдена.\n\nВыберите объект для инвестирования:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons),
    )
    return WAITING_OBJECT

# ── Выбрать объект ───────────────────────────────────────────────────────────
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

# ── Ввести сумму ─────────────────────────────────────────────────────────────
async def process_amount(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        amount = float(update.message.text.strip().replace(",", "."))
        if amount < 1:
            raise ValueError
    except ValueError:
        await update.message.reply_text(
            "❌ Введите корректную сумму (минимум 1 TON). Например: 10 или 10.5"
        )
        return WAITING_AMOUNT

    context.user_data["amount"] = amount
    data = context.user_data

    keyboard = [
        [
            InlineKeyboardButton(
                f"💎 Подтвердить {amount} TON", callback_data=f"pay_{amount}"
            )
        ],
        [InlineKeyboardButton("❌ Отмена", callback_data="cancel")],
    ]
    await update.message.reply_text(
        f"📋 *Подтверждение инвестиции*\n\n"
        f"Объект: {data.get('object_name')}\n"
        f"Сумма: *{amount} TON*\n"
        f"Карта: {data.get('mi_number')}",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )
    return WAITING_AMOUNT

# ── Подтвердить оплату (фиктивная) ──────────────────────────────────────────
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
            f"TX: `{tx_hash[:16]}...`\n\n"
            f"[Открыть личный кабинет]({PLATFORM_URL}/dashboard)",
            parse_mode="Markdown",
        )
    else:
        await query.edit_message_text(
            "❌ Ошибка при сохранении инвестиции. Попробуйте позже."
        )
    context.user_data.clear()
    return ConversationHandler.END

# ── Callback: Портфель ──────────────────────────────────────────────────────
async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        f"📊 Ваш инвестиционный портфель:\n{PLATFORM_URL}/dashboard"
    )

# ── Callback: Отмена ─────────────────────────────────────────────────────────
async def cancel_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text("Операция отменена.")
    context.user_data.clear()
    return ConversationHandler.END

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

    # ConversationHandler
    conv = ConversationHandler(
        entry_points=[CallbackQueryHandler(invest_callback, pattern="^invest$")],
        states={
            WAITING_MI_NUMBER: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, process_mi_number)
            ],
            WAITING_OBJECT: [
                CallbackQueryHandler(process_object, pattern="^obj_")
            ],
            WAITING_AMOUNT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, process_amount),
                CallbackQueryHandler(pay_callback, pattern="^pay_"),
                CallbackQueryHandler(cancel_callback, pattern="^cancel$"),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(invest_callback, pattern="^invest$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(CallbackQueryHandler(cancel_callback, pattern="^cancel$"))
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

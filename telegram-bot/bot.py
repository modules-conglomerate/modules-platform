import os
import logging
import uuid
import requests
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, filters, ContextTypes, ConversationHandler,
    PreCheckoutQueryHandler,
)

# ── Конфигурация ──────────────────────────────────────────────────────────────
ASK_ADDRESS = 1

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

BOT_TOKEN        = os.getenv("BOT_TOKEN")
SUPABASE_URL     = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL     = "https://конгломерат-модули.рф"
STARS_PRICE      = 1
PORT             = int(os.getenv("PORT", 10000))

# ── Health Check HTTP Server ──────────────────────────────────────────────────
class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, fmt, *args):
        pass

def run_http_server():
    server = HTTPServer(("0.0.0.0", PORT), HealthHandler)
    logger.info(f"HTTP server started on port {PORT}")
    server.serve_forever()

# ── Функции работы с базой ──────────────────────────────────────────────────
def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

def find_card_by_telegram(telegram_id: int):
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}&select=*",
            headers=sb_headers(), timeout=8,
        )
        data = r.json()
        return data[0] if data else None
    except Exception as e:
        logger.warning(f"find_card error: {e}")
        return None

def create_mi_card(telegram_id: int, telegram_username: str) -> str:
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
                "is_qualified": False, 
                "total_invested": 0,
            }, timeout=8,
        )
    except Exception as e:
        logger.error(f"create_mi_card error: {e}")
    return unique_code

# ── Хендлеры бота ─────────────────────────────────────────────────────────────
async def send_invoice(chat_id: int, telegram_id: int, context):
    await context.bot.send_invoice(
        chat_id=chat_id,
        title="Металлическая карта Конгломерата",
        description="Персональная карта с номером МИ-хххххххх + статус квалифицированного инвестора",
        payload=f"order_card_{telegram_id}",
        provider_token="",
        currency="XTR",
        prices=[LabeledPrice("Металлическая карта", STARS_PRICE)],
    )

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id
    tg_username = update.effective_user.username or str(telegram_id)
    card = find_card_by_telegram(telegram_id)
    
    if card:
        status = "✅ Квалифицированный инвестор" if card.get('is_qualified') else "❌ Не квалифицирован"
        welcome = f"⬡ *КОНГЛОМЕРАТ МОДУЛИ*\n\nС возвращением!\n\nВаша карта: *{card['card_number']}*\n\nСтатус: {status}"
    else:
        mi_number = create_mi_card(telegram_id, tg_username)
        welcome = f"⬡ *КОНГЛОМЕРАТ МОДУЛИ*\n\nВаш номер: *{mi_number}*\n\nСтатус: ❌ Не квалифицирован"

    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text=welcome,
        parse_mode="Markdown"
    )

    keyboard = [
        [InlineKeyboardButton("💳 Получить статус квалифицированного инвестора (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="Выберите действие:",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

async def order_card_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    telegram_id = update.effective_user.id
    card = find_card_by_telegram(telegram_id)
    
    if card and card.get('is_qualified'):
        await query.edit_message_text(
            f"✅ Вы уже обладаете статусом квалифицированного инвестора.",
            parse_mode="Markdown"
        )
        return
    
    await send_invoice(query.message.chat_id, telegram_id, context)

async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.pre_checkout_query.answer(ok=True)

async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "✅ Оплата подтверждена!\n\n✉️ Отправьте ФИО и адрес доставки вашей персональной карты:\n"
        "Страна, регион, город, улица, дом, квартира, индекс, ФИО"
    )
    return ASK_ADDRESS

async def get_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    address = update.message.text.strip()
    telegram_id = update.effective_user.id
    
    # Обновляем адрес и статус в Supabase
    response = requests.patch(
        f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
        headers=sb_headers(),
        json={
            "delivery_address": address,
            "is_qualified": True,
            "order_status": "pending"
        },
        timeout=8,
    )
    
    if response.status_code in (200, 204):
        await update.message.reply_text(
            f"✅ Адрес сохранён!\n\nСтатус: **Квалифицированный инвестор**",
            parse_mode="Markdown"
        )
    else:
        await update.message.reply_text("⚠️ Ошибка при сохранении. Обратитесь в поддержку.")
    
    return ConversationHandler.END

async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.callback_query.answer()
    await update.callback_query.edit_message_text(
        f"📊 Ваш портфель:\n{PLATFORM_URL}/dashboard"
    )

# ── Запуск ──────────────────────────────────────────────────────────────────────
def main():
    # Запускаем HTTP сервер в отдельном потоке
    http_thread = threading.Thread(target=run_http_server, daemon=True)
    http_thread.start()

    app = Application.builder().token(BOT_TOKEN).build()

    conv = ConversationHandler(
        entry_points=[MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback)],
        states={
            ASK_ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_address)],
        },
        fallbacks=[],  # Без fallbacks, чтобы избежать дублирования
        allow_reentry=True,
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(order_card_callback, pattern="^order_card$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    app.add_handler(conv)

    logger.info("Бот запущен.")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()

import os
import logging
import uuid
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

ASK_ADDRESS = 1

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

BOT_TOKEN            = os.getenv("BOT_TOKEN")
SUPABASE_URL         = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL         = "https://modules-platform.vercel.app"
STARS_PRICE          = 1
METAL_CARD_IMAGE     = "assets/invest-card-front.png"
PORT                 = int(os.getenv("PORT", 10000))

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
            headers=sb_headers(),
            timeout=8,
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
            },
            timeout=10,
        )
    except Exception as e:
        logger.error(f"create_mi_card error: {e}")
    return unique_code

async def send_invoice(chat_id: int, telegram_id: int, context):
    await context.bot.send_invoice(
        chat_id=chat_id,
        title="Металлическая карта Модули",
        description="Фирменная карты с персональным МИ номером + статус квалифицированного инвестора",
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
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nС возвращением!\n\nВаша карта: *{card['card_number']}*\n\nСтатус: {status}"
    else:
        mi_number = create_mi_card(telegram_id, tg_username)
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nВаш номер: *{mi_number}*\n\nСтатус: ❌ Не квалифицирован"

    if os.path.exists(METAL_CARD_IMAGE):
        with open(METAL_CARD_IMAGE, 'rb') as f:
            await context.bot.send_photo(chat_id=update.effective_chat.id, photo=f, caption=welcome, parse_mode="Markdown")
    else:
        await context.bot.send_message(chat_id=update.effective_chat.id, text=welcome, parse_mode="Markdown")

    keyboard = [
        [InlineKeyboardButton("💳 Получить статус квалифицированного инвестора (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await context.bot.send_message(chat_id=update.effective_chat.id, text="Выберите действие:", reply_markup=InlineKeyboardMarkup(keyboard))

async def order_card_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    telegram_id = update.effective_user.id
    card = find_card_by_telegram(telegram_id)
    if card and card.get('is_qualified'):
        await query.edit_message_text(f"✅ Вы уже получили карту: *{card['card_number']}*", parse_mode="Markdown")
        return
    await query.edit_message_text(f"💳 *Заказ металлической карты*\n\nСтоимость: *12 000 ⭐*", parse_mode="Markdown")
    await send_invoice(query.message.chat_id, telegram_id, context)

async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.pre_checkout_query.answer(ok=True)

async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ Оплата подтверждена!\n\n✉️ Отправьте адрес доставки и ФИО:")
    return ASK_ADDRESS

async def get_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    address = update.message.text.strip()
    telegram_id = update.effective_user.id
    requests.patch(f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}", headers=sb_headers(), json={"delivery_address": address, "is_qualified": True})
    await update.message.reply_text("✅ Адрес сохранён! Карта будет отправлена.", parse_mode="Markdown")
    return ConversationHandler.END

async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.callback_query.answer()
    await update.callback_query.edit_message_text(f"📊 Ваш портфель:\n{PLATFORM_URL}/dashboard")

class HealthCheck(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, fmt, *args): pass

def run_web_server():
    server = HTTPServer(("0.0.0.0", PORT), HealthCheck)
    server.serve_forever()

async def run_bot():
    app = Application.builder().token(BOT_TOKEN).build()
    
    conv = ConversationHandler(
        entry_points=[MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback)],
        states={ASK_ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_address)]},
        fallbacks=[],
        allow_reentry=True,
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(order_card_callback, pattern="^order_card$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    app.add_handler(conv)

    await app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    Thread(target=run_web_server, daemon=True).start()
    asyncio.run(run_bot())

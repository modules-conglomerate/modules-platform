import os
import logging
import uuid
import requests
import sys
import fcntl # Только для Linux/Render
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

BOT_TOKEN = os.getenv("BOT_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PLATFORM_URL = "https://конгломерат-модули.рф"
STARS_PRICE = 1
METAL_CARD_IMAGE = "assets/invest-card-front.png"

# ── Функции работы с базой ──────────────────────────────────────────────────
def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def find_card_by_telegram(telegram_id: int):
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}&select=*",
            headers=sb_headers(), timeout=5,
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
                "card_number": unique_code, "telegram_id": telegram_id,
                "telegram_username": telegram_username, "level": "resident",
                "is_active": True, "is_qualified": False, "total_invested": 0,
            }, timeout=5,
        )
    except Exception as e:
        logger.error(f"create_mi_card error: {e}")
    return unique_code

# ── Хендлеры ──────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id
    card = find_card_by_telegram(telegram_id)
    
    if card:
        status = "✅ Квалифицированный инвестор" if card.get('is_qualified') else "❌ Не квалифицирован"
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nВаша карта: *{card['card_number']}*\n\nСтатус: {status}"
    else:
        mi_number = create_mi_card(telegram_id, update.effective_user.username or str(telegram_id))
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nВаш номер: *{mi_number}*\n\nСтатус: ❌ Не квалифицирован"

    await context.bot.send_message(update.effective_chat.id, text=welcome, parse_mode="Markdown")
    keyboard = [
        [InlineKeyboardButton("💳 Получить статус (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
    ]
    await context.bot.send_message(update.effective_chat.id, text="Выберите действие:", reply_markup=InlineKeyboardMarkup(keyboard))

async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ Оплата подтверждена! Напишите ФИО и адрес:")
    return ASK_ADDRESS

async def get_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    address = update.message.text.strip()
    telegram_id = update.effective_user.id
    response = requests.patch(
        f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
        headers=sb_headers(),
        json={"delivery_address": address, "status": "ordered"},
        timeout=5
    )
    if response.status_code in (200, 204):
        await update.message.reply_text("✅ Заказ принят!")
        return ConversationHandler.END
    return ASK_ADDRESS

def main():
    # Защита от дублей: создаем файл-блокировщик
    pid_file = '/tmp/bot.pid'
    fp = open(pid_file, 'w')
    try:
        fcntl.lockf(fp, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        logger.error("Бот уже запущен в другом процессе. Выход.")
        sys.exit(0)

    app = Application.builder().token(BOT_TOKEN).build()
    
    conv = ConversationHandler(
        entry_points=[MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback)],
        states={ASK_ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_address)]},
        fallbacks=[CommandHandler("start", start)],
        allow_reentry=True,
    )
    
    app.add_handler(conv)
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(lambda u, c: u.callback_query.answer(), pattern=".*"))
    
    logger.info("Бот запущен в единственном экземпляре.")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()

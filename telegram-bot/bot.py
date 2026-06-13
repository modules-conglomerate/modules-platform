import os
import logging
import uuid
import requests
import asyncio
import sys
from threading import Thread
from http.server import BaseHTTPRequestHandler, HTTPServer
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, filters, ContextTypes, ConversationHandler,
    PreCheckoutQueryHandler,
)

ASK_ADDRESS = 1

# Настройка логирования
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Переменные окружения
BOT_TOKEN = os.getenv("BOT_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PORT = int(os.getenv("PORT", 10000))
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL", "")

# Константы
PLATFORM_URL = "https://modules-platform.vercel.app"
STARS_PRICE = 1  # 1 звезда для теста
METAL_CARD_IMAGE = "assets/invest-card-front.png"

# ================== Supabase функции ==================
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

# ================== Функции бота ==================
async def send_invoice(chat_id: int, telegram_id: int, context):
    """Отправка счёта для оплаты звёздами (XTR)"""
    await context.bot.send_invoice(
        chat_id=chat_id,
        title="Металлическая карта Модули",
        description="Дизайн карты + статус квалифицированного инвестора",
        payload=f"order_card_{telegram_id}",
        provider_token="",  # Для звёзд - пустая строка
        currency="XTR",
        prices=[LabeledPrice("Металлическая карта", STARS_PRICE)],
    )

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    telegram_id = update.effective_user.id
    tg_username = update.effective_user.username or str(telegram_id)

    card = find_card_by_telegram(telegram_id)
    if card:
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nС возвращением!\n\nВаша карта: *{card['card_number']}*"
    else:
        mi_number = create_mi_card(telegram_id, tg_username)
        welcome = f"⬡ *МОДУЛИ ИНВЕСТ*\n\nВаш номер: *{mi_number}*"

    # Отправка фото карты (если файл есть)
    try:
        with open(METAL_CARD_IMAGE, 'rb') as f:
            await context.bot.send_photo(
                chat_id=update.effective_chat.id,
                photo=f,
                caption=welcome,
                parse_mode="Markdown",
            )
    except FileNotFoundError:
        logger.warning(f"Файл {METAL_CARD_IMAGE} не найден")
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=welcome,
            parse_mode="Markdown",
        )

    keyboard = [
        [InlineKeyboardButton("💳 Приобрести металлическую карту (12 000 ⭐)", callback_data="order_card")],
        [InlineKeyboardButton("📊 Портфель", callback_data="portfolio")],
        [InlineKeyboardButton("🌐 Открыть платформу", url=PLATFORM_URL)],
    ]
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="Выберите действие:",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

async def order_card_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик нажатия кнопки заказа карты"""
    query = update.callback_query
    await query.answer()
    telegram_id = update.effective_user.id

    card = find_card_by_telegram(telegram_id)
    if card and card.get('is_qualified'):
        await query.edit_message_text(
            f"✅ Вы уже получили карту: *{card['card_number']}*",
            parse_mode="Markdown",
        )
        return

    await query.edit_message_text(
        f"💳 *Заказ металлической карты*\n\nСтоимость: *12 000 ⭐*",
        parse_mode="Markdown",
    )

    await send_invoice(query.message.chat_id, telegram_id, context)

async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Предпроверка оплаты"""
    query = update.pre_checkout_query
    await query.answer(ok=True)

async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик успешной оплаты"""
    telegram_id = update.effective_user.id

    card = find_card_by_telegram(telegram_id)
    if not card:
        await update.message.reply_text("❌ Карта не найдена. Нажмите /start.")
        return

    # Сохраняем статус квалифицированного инвестора
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
        headers=sb_headers(),
        json={"is_qualified": True},
        timeout=10,
    )

    await update.message.reply_text(
        "✅ Оплата подтверждена!\n\n✉️ Введите адрес доставки:",
    )
    return ASK_ADDRESS

async def get_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Сохранение адреса доставки"""
    address = update.message.text.strip()
    telegram_id = update.effective_user.id

    card = find_card_by_telegram(telegram_id)
    if not card:
        await update.message.reply_text("❌ Карта не найдена. Нажмите /start.")
        return ConversationHandler.END

    # Сохраняем адрес в базу
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/investor_cards?telegram_id=eq.{telegram_id}",
        headers=sb_headers(),
        json={"delivery_address": address},
        timeout=10,
    )

    await update.message.reply_text(
        f"✅ Адрес сохранён! Карта будет отправлена на почту.\n\nСтатус: **Квалифицированный инвестор**",
        parse_mode="Markdown",
    )
    return ConversationHandler.END

async def portfolio_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Портфель инвестора"""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        f"📊 Ваш портфель:\n{PLATFORM_URL}/dashboard"
    )

# ================== Health Check HTTP сервер ==================
class HealthCheck(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    
    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, fmt, *args):
        pass  # Отключаем логирование health-check запросов

def run_web_server():
    """Запуск HTTP сервера для health checks"""
    server = HTTPServer(("0.0.0.0", PORT), HealthCheck)
    logger.info(f"Health server запущен на порту {PORT}")
    server.serve_forever()

# ================== Keep-alive функция ==================
async def keep_alive():
    """Пинг сервера каждые 10 минут для предотвращения засыпания"""
    if not RENDER_EXTERNAL_URL:
        logger.warning("RENDER_EXTERNAL_URL не задан, keep-alive не работает")
        return
    
    while True:
        try:
            url = f"https://{RENDER_EXTERNAL_URL}"
            response = requests.get(url, timeout=5)
            logger.info(f"Keep-alive ping: {response.status_code}")
        except Exception as e:
            logger.warning(f"Keep-alive error: {e}")
        
        await asyncio.sleep(600)  # 10 минут

# ================== Запуск бота ==================
async def run_bot_async():
    """Запуск Telegram бота"""
    app = Application.builder().token(BOT_TOKEN).build()

    # ConversationHandler для адреса доставки
    conv = ConversationHandler(
        entry_points=[MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback)],
        states={
            ASK_ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_address)],
        },
        fallbacks=[CommandHandler("start", start)],
        allow_reentry=True,
    )

    # Добавляем обработчики
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(order_card_callback, pattern="^order_card$"))
    app.add_handler(CallbackQueryHandler(portfolio_callback, pattern="^portfolio$"))
    app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    app.add_handler(conv)

    logger.info("Bot запускается...")
    await app.initialize()
    
    # Запускаем polling с очисткой старых запросов
    await app.updater.start_polling(drop_pending_updates=True)
    await app.start()

    # Запускаем keep-alive в фоне
    asyncio.create_task(keep_alive())

    # Держим бота активным
    try:
        while True:
            await asyncio.sleep(3600)
    except KeyboardInterrupt:
        logger.info("Остановка бота...")
        await app.stop()
        await app.updater.stop()

# ================== Точка входа ==================
if __name__ == "__main__":
    # Защита от двойного запуска (предотвращает Conflict)
    pid_file = "/tmp/bot.pid"
    if os.path.exists(pid_file):
        logger.error("Бот уже запущен! Перезапустите сервис на Render.")
        logger.error("Если проблема не решается - удалите файл /tmp/bot.pid")
        sys.exit(1)
    
    with open(pid_file, "w") as f:
        f.write(str(os.getpid()))
    
    # Запускаем health check сервер в отдельном потоке
    Thread(target=run_web_server, daemon=True).start()
    
    # Запускаем бота
    asyncio.run(run_bot_async())

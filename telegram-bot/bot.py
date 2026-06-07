import os
import logging
import httpx
import asyncio
import hashlib
import time
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiohttp import web

# Конфиг
BOT_TOKEN = '8939892865:AAEHxIQKM--p8qsBWgrn2u7pLa6K-0_jQJE'
SUPABASE_URL = 'https://plgesxqkponmwmghvpin.supabase.co'
SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2VzeHFrcG9ubXdtZ2h2cGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0ODU1NCwiZXhwIjoyMDk1OTI0NTU0fQ.yAcLUW5_hhNrvrxzbJrBxnAbdXyZ5JTVWe38V9MvFGM'
PLATFORM_URL = 'https://modules-platform.vercel.app'

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

# --- ВЕБ-СЕРВЕР ДЛЯ RENDER ---
async def handle(request):
    return web.Response(text="Bot is running")

async def start_web_server():
    app = web.Application()
    app.router.add_get('/', handle)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 8080))
    site = web.TCPSite(runner, '0.0.0.0', port)
    await site.start()
    logging.info(f"Web server started on port {port}")

# --- ЛОГИКА БОТА ---
class InvestStates(StatesGroup):
    waiting_mi_number = State()
    waiting_object = State()
    waiting_amount = State()

def sb_headers():
    return {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
    }

async def get_objects():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f'{SUPABASE_URL}/rest/v1/objects?select=id,name,slug,status&is_public=eq.true&order=name',
            headers=sb_headers()
        )
        return r.json()

async def find_card(mi_number: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f'{SUPABASE_URL}/rest/v1/investor_cards?card_number=eq.{mi_number}&select=*',
            headers=sb_headers()
        )
        data = r.json()
        return data[0] if data else None

@dp.message(Command('start'))
async def cmd_start(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text='⬡ Инвестировать в объект', callback_data='invest')],
        [InlineKeyboardButton(text='📊 Мой портфель', callback_data='portfolio')],
        [InlineKeyboardButton(text='🌐 Открыть платформу', url=PLATFORM_URL)],
    ])
    await message.answer(
        '⬡ *МОДУЛИ ИНВЕСТ*\n\n'
        'Добро пожаловать в инвестиционную программу конгломерата Модули.\n\n'
        'Инвестирование осуществляется в TON-коинах.\n'
        'Для начала работы нажмите кнопку ниже.',
        parse_mode='Markdown',
        reply_markup=kb
    )

@dp.callback_query(F.data == 'invest')
async def cb_invest(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.answer(
        '🔑 Введите номер вашей карты:\n\n'
        'Формат: *MD-XXXXXXXX*\n\n'
        '_Номер указан на физической карте_',
        parse_mode='Markdown'
    )
    await state.set_state(InvestStates.waiting_mi_number)
    await callback.answer()

@dp.message(InvestStates.waiting_mi_number)
async def process_mi_number(message: types.Message, state: FSMContext):
    mi_input = message.text.strip().upper()
    
    # ПРОВЕРКА MD-XXXXXXXX (Формат 11 символов)
    if not mi_input.startswith('MD-') or len(mi_input) != 11:
        await message.answer('❌ Неверный формат. Используйте *MD-XXXXXXXX*', parse_mode='Markdown')
        return

    card = await find_card(mi_input)
    if not card:
        await message.answer('❌ Карта не найдена.')
        return

    await state.update_data(mi_number=mi_input, card_id=card['id'])
    
    objects = await get_objects()
    buttons = [[InlineKeyboardButton(text=f"🟢 {o['name']}", callback_data=f"obj_{o['id']}")] for o in objects[:10]]
    
    await message.answer('✅ Карта найдена. Выберите объект:', reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))
    await state.set_state(InvestStates.waiting_object)

# [Остальные функции process_object, process_amount, process_payment оставляем без изменений...]
# (Убедитесь, что они у вас есть в файле, я просто сократил для удобства чтения)

async def main():
    await start_web_server() # Запускаем "обманку" для Render
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())

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

BOT_TOKEN = os.environ['BOT_TOKEN']
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_KEY']
PLATFORM_URL = 'https://modules-platform.vercel.app'

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

async def handle(request):
    return web.Response(text="Modules Invest Bot is running")

async def start_web_server():
    app = web.Application()
    app.router.add_get('/', handle)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 10000))
    site = web.TCPSite(runner, '0.0.0.0', port)
    await site.start()
    logging.info(f"Web server started on port {port}")

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
        '⬡ *МОДУЛИ ИНВЕСТ*\n\nДобро пожаловать в инвестиционную программу конгломерата Модули.\n\nИнвестирование осуществляется в TON-коинах.',
        parse_mode='Markdown',
        reply_markup=kb
    )

@dp.callback_query(F.data == 'invest')
async def cb_invest(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.answer(
        '🔑 Введите номер инвестиционной карты:\n\nФормат: *МИ-XXXXXXXX* (8 цифр)',
        parse_mode='Markdown'
    )
    await state.set_state(InvestStates.waiting_mi_number)
    await callback.answer()

@dp.message(InvestStates.waiting_mi_number)
async def process_mi_number(message: types.Message, state: FSMContext):
    mi_input = message.text.strip().upper()
    if not mi_input.startswith('МИ-') or len(mi_input) != 11:
        await message.answer('❌ Неверный формат. Используйте МИ-XXXXXXXX (8 цифр после МИ-)')
        return
    card = await find_card(mi_input)
    if not card:
        await message.answer('❌ Карта не найдена. Проверьте номер или приобретите карту на платформе.')
        return
    await state.update_data(mi_number=mi_input, card_id=card['id'])
    objects = await get_objects()
    if not objects:
        await message.answer('Объекты не найдены. Попробуйте позже.')
        return
    buttons = []
    for o in objects[:10]:
        icon = '🟡' if o['status'] == 'construction' else '🟢'
        buttons.append([InlineKeyboardButton(text=f"{icon} {o['name']}", callback_data=f"obj_{o['id']}")])
    kb = InlineKeyboardMarkup(inline_keyboard=buttons)
    await message.answer(f'✅ Карта *{mi_input}* найдена.\n\nВыберите объект для инвестирования:', parse_mode='Markdown', reply_markup=kb)
    await state.set_state(InvestStates.waiting_object)

@dp.callback_query(InvestStates.waiting_object, F.data.startswith('obj_'))
async def process_object(callback: types.CallbackQuery, state: FSMContext):
    obj_id = callback.data.replace('obj_', '')
    objects = await get_objects()
    obj = next((o for o in objects if o['id'] == obj_id), None)
    obj_name = obj['name'] if obj else 'Объект'
    await state.update_data(object_id=obj_id, object_name=obj_name)
    await callback.message.answer(f'🏗 *{obj_name}*\n\nВведите сумму инвестиции в TON:\n\n_Минимум: 1 TON_', parse_mode='Markdown')
    await state.set_state(InvestStates.waiting_amount)
    await callback.answer()

@dp.message(InvestStates.waiting_amount)
async def process_amount(message: types.Message, state: FSMContext):
    try:
        amount = float(message.text.strip().replace(',', '.'))
        if amount < 1:
            raise ValueError
    except ValueError:
        await message.answer('❌ Введите корректную сумму (минимум 1 TON). Например: 10 или 10.5')
        return
    await state.update_data(amount=amount)
    data = await state.get_data()
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=f'💎 Подтвердить {amount} TON', callback_data=f'pay_{amount}')],
        [InlineKeyboardButton(text='❌ Отмена', callback_data='cancel')],
    ])
    await message.answer(
        f'📋 *Подтверждение инвестиции*\n\n'
        f'Объект: {data.get("object_name")}\n'
        f'Сумма: *{amount} TON*\n'
        f'Карта: {data.get("mi_number")}',
        parse_mode='Markdown',
        reply_markup=kb
    )

@dp.callback_query(F.data.startswith('pay_'))
async def process_payment(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    tx_hash = hashlib.sha256(
        f"{data.get('card_id')}{data.get('object_id')}{data.get('amount')}{time.time()}".encode()
    ).hexdigest()
    async with httpx.AsyncClient() as client:
        await client.post(
            f'{SUPABASE_URL}/rest/v1/investments',
            headers=sb_headers(),
            json={
                'card_id': data.get('card_id'),
                'object_id': data.get('object_id'),
                'amount_ton': data.get('amount'),
                'tx_hash': tx_hash,
                'status': 'confirmed',
            }
        )
    await callback.message.answer(
        f'✅ *Инвестиция зафиксирована!*\n\n'
        f'Объект: {data.get("object_name")}\n'
        f'Сумма: *{data.get("amount")} TON*\n'
        f'Карта: {data.get("mi_number")}\n'
        f'TX: `{tx_hash[:16]}...`\n\n'
        f'[Открыть личный кабинет]({PLATFORM_URL}/dashboard)',
        parse_mode='Markdown'
    )
    await state.clear()
    await callback.answer()

@dp.callback_query(F.data == 'portfolio')
async def cb_portfolio(callback: types.CallbackQuery):
    await callback.message.answer(f'📊 Ваш инвестиционный портфель:\n{PLATFORM_URL}/dashboard')
    await callback.answer()

@dp.callback_query(F.data == 'cancel')
async def cb_cancel(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.answer('Операция отменена.')
    await callback.answer()

# ===== ДОБАВЛЕНО: обработчик обычных сообщений =====
@dp.message()
async def echo_all(message: types.Message):
    await message.answer("Я понимаю только команды /start и кнопки. Используй их.")
# =================================================

async def main():
    await start_web_server()
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())

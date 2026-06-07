import os
import logging
import httpx
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import asyncio

# Конфиг
BOT_TOKEN = '8939892865:AAEHxIQKM--p8qsBWgrn2u7pLa6K-0_jQJE'
SUPABASE_URL = 'https://plgesxqkponmwmghvpin.supabase.co'
SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2VzeHFrcG9ubXdtZ2h2cGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0ODU1NCwiZXhwIjoyMDk1OTI0NTU0fQ.yAcLUW5_hhNrvrxzbJrBxnAbdXyZ5JTVWe38V9MvFGM'
PLATFORM_URL = 'https://modules-platform.vercel.app'

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

# Состояния FSM
class InvestStates(StatesGroup):
    waiting_mi_number = State()
    waiting_object = State()
    waiting_amount = State()

# Заголовки для Supabase
def sb_headers():
    return {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
    }

# Получить объекты из Supabase
async def get_objects():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f'{SUPABASE_URL}/rest/v1/objects?select=id,name,slug,status&is_public=eq.true&order=name',
            headers=sb_headers()
        )
        return r.json()

# Записать инвестицию в Supabase
async def save_investment(card_id: str, object_id: str, amount_ton: float, tx_hash: str):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f'{SUPABASE_URL}/rest/v1/investments',
            headers=sb_headers(),
            json={
                'card_id': card_id,
                'object_id': object_id,
                'amount_ton': amount_ton,
                'tx_hash': tx_hash,
                'status': 'confirmed',
            }
        )
        return r.json()

# Найти карту по номеру МИ
async def find_card(mi_number: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f'{SUPABASE_URL}/rest/v1/investor_cards?card_number=eq.{mi_number}&select=*',
            headers=sb_headers()
        )
        data = r.json()
        return data[0] if data else None

# /start
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
        'Каждый вклад фиксируется в цифровом дневнике объекта.',
        parse_mode='Markdown',
        reply_markup=kb
    )

# Кнопка "Инвестировать"
@dp.callback_query(F.data == 'invest')
async def cb_invest(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.answer(
        '🔑 Введите ваш номер инвестиционной карты:\n\n'
        'Формат: *МИ-XXXXXXXX*\n\n'
        '_Номер указан на вашей физической карте и в личном кабинете платформы_',
        parse_mode='Markdown'
    )
    await state.set_state(InvestStates.waiting_mi_number)
    await callback.answer()

# Ввод номера МИ
@dp.message(InvestStates.waiting_mi_number)
async def process_mi_number(message: types.Message, state: FSMContext):
    mi_input = message.text.strip().upper()

    # Валидация формата МИ-XXXXXXXX
    if not mi_input.startswith('МИ-') or len(mi_input) != 11:
        await message.answer(
            '❌ Неверный формат номера.\n\n'
            'Введите номер в формате *МИ-XXXXXXXX* (8 цифр после МИ-)',
            parse_mode='Markdown'
        )
        return

    # Ищем карту в базе
    card = await find_card(mi_input)

    if not card:
        await message.answer(
            '❌ Карта не найдена.\n\n'
            'Проверьте номер или приобретите инвестиционную карту на платформе.',
        )
        return

    await state.update_data(mi_number=mi_input, card_id=card['id'])

    # Показываем список объектов
    objects = await get_objects()

    if not objects:
        await message.answer('Объекты не найдены. Попробуйте позже.')
        return

    buttons = []
    for obj in objects[:10]:
        status_icon = '🟡' if obj['status'] == 'construction' else '🟢'
        buttons.append([
            InlineKeyboardButton(
                text=f"{status_icon} {obj['name']}",
                callback_data=f"obj_{obj['id']}"
            )
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=buttons)
    await message.answer(
        f'✅ Карта *{mi_input}* найдена.\n\n'
        f'Выберите объект для инвестирования:',
        parse_mode='Markdown',
        reply_markup=kb
    )
    await state.set_state(InvestStates.waiting_object)

# Выбор объекта
@dp.callback_query(InvestStates.waiting_object, F.data.startswith('obj_'))
async def process_object(callback: types.CallbackQuery, state: FSMContext):
    object_id = callback.data.replace('obj_', '')

    objects = await get_objects()
    obj = next((o for o in objects if o['id'] == object_id), None)

    if not obj:
        await callback.answer('Объект не найден')
        return

    await state.update_data(object_id=object_id, object_name=obj['name'])

    await callback.message.answer(
        f'🏗 *{obj["name"]}*\n\n'
        f'Введите сумму инвестиции в TON:\n\n'
        f'_Минимальная сумма: 1 TON_',
        parse_mode='Markdown'
    )
    await state.set_state(InvestStates.waiting_amount)
    await callback.answer()

# Ввод суммы
@dp.message(InvestStates.waiting_amount)
async def process_amount(message: types.Message, state: FSMContext):
    try:
        amount = float(message.text.strip().replace(',', '.'))
        if amount < 1:
            raise ValueError('Too small')
    except ValueError:
        await message.answer('❌ Введите корректную сумму (например: 10 или 10.5)')
        return

    data = await state.get_data()

    # Создаём инвойс через Stars (пока заглушка — TON Connect подключается отдельно)
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text=f'💎 Оплатить {amount} TON',
            callback_data=f'pay_{amount}'
        )],
        [InlineKeyboardButton(text='❌ Отмена', callback_data='cancel')],
    ])

    await message.answer(
        f'📋 *Подтверждение инвестиции*\n\n'
        f'Объект: {data["object_name"]}\n'
        f'Сумма: *{amount} TON*\n'
        f'Карта: {data["mi_number"]}\n\n'
        f'После оплаты транзакция будет зафиксирована\n'
        f'в цифровом дневнике объекта.',
        parse_mode='Markdown',
        reply_markup=kb
    )
    await state.update_data(amount=amount)

# Подтверждение оплаты
@dp.callback_query(F.data.startswith('pay_'))
async def process_payment(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()

    # Генерируем mock tx_hash (заменится на реальный после TON Connect)
    import hashlib, time
    tx_hash = hashlib.sha256(
        f"{data['card_id']}{data['object_id']}{data['amount']}{time.time()}".encode()
    ).hexdigest()

    # Записываем в Supabase
    await save_investment(
        card_id=data['card_id'],
        object_id=data['object_id'],
        amount_ton=data['amount'],
        tx_hash=tx_hash
    )

    await callback.message.answer(
        f'✅ *Инвестиция зафиксирована!*\n\n'
        f'Объект: {data["object_name"]}\n'
        f'Сумма: *{data["amount"]} TON*\n'
        f'Карта: {data["mi_number"]}\n'
        f'TX: `{tx_hash[:16]}...`\n\n'
        f'Транзакция отображается в вашем\n'
        f'[личном кабинете]({PLATFORM_URL}/dashboard)',
        parse_mode='Markdown'
    )
    await state.clear()
    await callback.answer()

# Портфель
@dp.callback_query(F.data == 'portfolio')
async def cb_portfolio(callback: types.CallbackQuery):
    await callback.message.answer(
        f'📊 Ваш портфель доступен в личном кабинете:\n\n'
        f'[Открыть кабинет]({PLATFORM_URL}/dashboard)',
        parse_mode='Markdown'
    )
    await callback.answer()

# Отмена
@dp.callback_query(F.data == 'cancel')
async def cb_cancel(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.answer('Операция отменена.')
    await callback.answer()

# Пинг для keep-alive (Render.com засыпает на free плане)
async def keep_alive():
    while True:
        await asyncio.sleep(600)  # каждые 10 минут

async def main():
    # Удалите asyncio.create_task(keep_alive()) — оно сейчас не нужно
    # так как polling будет работать, пока процесс запущен
    await dp.start_polling(bot)

if __name__ == '__main__':
    # Если бот будет падать на Render, добавьте обработку ошибок
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Ошибка при запуске: {e}")

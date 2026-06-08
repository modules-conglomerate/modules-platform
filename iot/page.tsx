
import Link from 'next/link'

const SENSORS = [
  { name: 'DHT22',   measures: 'Температура + Влажность', price: '~300 руб', icon: '🌡', difficulty: 'Легко' },
  { name: 'BMP280',  measures: 'Давление + Температура',  price: '~200 руб', icon: '🔵', difficulty: 'Легко' },
  { name: 'MQ-135',  measures: 'Качество воздуха (CO₂)',  price: '~250 руб', icon: '🌿', difficulty: 'Средне' },
  { name: 'DS18B20', measures: 'Температура грунта',      price: '~200 руб', icon: '🪨', difficulty: 'Легко' },
  { name: 'Rain/FC-37', measures: 'Осадки',               price: '~150 руб', icon: '🌧', difficulty: 'Легко' },
  { name: 'Анемометр', measures: 'Скорость ветра',        price: '~800 руб', icon: '💨', difficulty: 'Средне' },
]

const STEPS = [
  { n: 1, title: 'Купить компоненты', desc: 'ESP32 (~600 руб) + датчики по списку. Все доступны на Wildberries, Ozon или AliExpress.' },
  { n: 2, title: 'Установить Arduino IDE', desc: 'arduino.cc/downloads — бесплатно. Добавить плату ESP32 через менеджер плат.' },
  { n: 3, title: 'Настроить прошивку', desc: 'Скачать файл прошивки, указать WiFi, MQTT и UUID объекта из базы данных.' },
  { n: 4, title: 'Загрузить на ESP32', desc: 'Подключить ESP32 через USB, выбрать порт в Arduino IDE, нажать Upload.' },
  { n: 5, title: 'Разместить на объекте', desc: 'Установить датчик в защищённом корпусе. Подключить питание 5V (USB или солнечная панель).' },
  { n: 6, title: 'Проверить данные', desc: 'Через 1-2 минуты данные появятся в Экологическом паспорте объекта.' },
]

export default function IoTPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Подключение датчиков</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПОДКЛЮЧЕНИЕ IoT-ДАТЧИКОВ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Инструкция по подключению датчиков экомониторинга к Цифровому дневнику Модули
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Архитектура */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>СХЕМА РАБОТЫ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { icon: '📡', label: 'Датчик ESP32' },
              { icon: '→', label: '' },
              { icon: '☁️', label: 'EMQX Cloud' },
              { icon: '→', label: '' },
              { icon: '⚡', label: 'Edge Function' },
              { icon: '→', label: '' },
              { icon: '🗄', label: 'Supabase' },
              { icon: '→', label: '' },
              { icon: '🌿', label: 'Экопаспорт' },
            ].map(function(item, i) {
              return item.label ? (
                <div key={i} style={{
                  background: '#0A0A0F', border: '1px solid #2A2A3E',
                  borderRadius: '8px', padding: '12px 16px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>{item.label}</div>
                </div>
              ) : (
                <div key={i} style={{ fontSize: '20px', color: '#374151' }}>→</div>
              )
            })}
          </div>
        </div>

        {/* Шаги */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>ПОШАГОВАЯ УСТАНОВКА</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map(function(step) {
              return (
                <div key={step.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 800, color: '#C9A84C',
                  }}>
                    {step.n}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '3px' }}>{step.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Датчики */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>ПОДДЕРЖИВАЕМЫЕ ДАТЧИКИ</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {SENSORS.map(function(s) {
              return (
                <div key={s.name} style={{
                  background: '#0A0A0F', borderRadius: '8px', padding: '14px',
                  border: '1px solid #1E1E2E',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#C9A84C', marginBottom: '4px' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: '#E8E8F0', marginBottom: '6px' }}>{s.measures}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', color: '#00D4AA' }}>{s.price}</span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>{s.difficulty}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Скачать прошивку */}
        <div style={{ background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)', border: '1px solid #2A2A3E', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', marginBottom: '4px' }}>Готовая прошивка ESP32</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Файл .ino с инструкцией — скачай и настрой под свой объект</div>
          </div>
          
            href="https://github.com/modules-conglomerate/modules-platform/blob/main/iot/firmware/moduli_sensor/moduli_sensor.ino"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '11px 22px', background: '#C9A84C', color: '#0A0A0F',
              borderRadius: '6px', fontWeight: 700, fontSize: '12px',
              textDecoration: 'none', letterSpacing: '0.08em', flexShrink: 0,
            }}
          >
            ↓ СКАЧАТЬ ПРОШИВКУ
          </a>
        </div>

        {/* Нужна помощь */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>💬</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '6px' }}>
              Нужна помощь с подключением?
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, marginBottom: '12px' }}>
              Напишите в Telegram-бот — команда назрОС поможет с настройкой датчиков
              на вашем объекте. Мы также предоставляем готовые наборы датчиков
              для объектов конгломерата.
            </div>
            <a href="https://t.me/modules_invest_bot" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', background: '#229ED9', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
              Написать в Telegram
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

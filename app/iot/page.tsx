import Link from 'next/link'

const STEPS = [
  { n: 1, title: 'Купить ESP32 + датчики', desc: 'ESP32 (~600 руб) + DHT22 (~300 руб) + BMP280 (~200 руб). Доступны на Wildberries, Ozon, AliExpress.' },
  { n: 2, title: 'Установить Arduino IDE', desc: 'arduino.cc/downloads — бесплатно. Добавить плату ESP32 через менеджер плат.' },
  { n: 3, title: 'Зарегистрироваться на EMQX Cloud', desc: 'emqx.com/cloud → Serverless (бесплатно, только email). Скопировать Host, Username, Password.' },
  { n: 4, title: 'Настроить прошивку', desc: 'Скачать файл прошивки из репозитория. Указать WiFi, MQTT и UUID объекта из Supabase.' },
  { n: 5, title: 'Загрузить на ESP32', desc: 'Подключить через USB, выбрать порт в Arduino IDE, нажать Upload.' },
  { n: 6, title: 'Проверить данные', desc: 'Через 1-2 минуты данные появятся в Экологическом паспорте объекта.' },
]

const SENSORS = [
  { name: 'DHT22',      measures: 'Температура + Влажность', price: '~300 руб', icon: '🌡', difficulty: 'Легко' },
  { name: 'BMP280',     measures: 'Давление + Температура',  price: '~200 руб', icon: '🔵', difficulty: 'Легко' },
  { name: 'MQ-135',     measures: 'Качество воздуха CO₂',   price: '~250 руб', icon: '🌿', difficulty: 'Средне' },
  { name: 'DS18B20',    measures: 'Температура грунта',      price: '~200 руб', icon: '🪨', difficulty: 'Легко' },
  { name: 'FC-37',      measures: 'Осадки',                  price: '~150 руб', icon: '🌧', difficulty: 'Легко' },
  { name: 'Анемометр',  measures: 'Скорость ветра',          price: '~800 руб', icon: '💨', difficulty: 'Средне' },
]

export default function IoTPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Датчики IoT</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>ПОДКЛЮЧЕНИЕ IoT-ДАТЧИКОВ</h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Инструкция по подключению датчиков экомониторинга к Цифровому дневнику Модули</p>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '14px' }}>СХЕМА РАБОТЫ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[['📡','Датчик ESP32'],['→',''],['☁️','EMQX Cloud'],['→',''],['⚡','Edge Function'],['→',''],['🗄','Supabase'],['→',''],['🌿','Экопаспорт']].map(function([icon, label], i) {
              return label ? (
                <div key={i} style={{ background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '3px' }}>{icon}</div>
                  <div style={{ fontSize: '9px', color: '#6B7280' }}>{label}</div>
                </div>
              ) : <div key={i} style={{ fontSize: '18px', color: '#374151' }}>→</div>
            })}
          </div>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '14px' }}>ПОШАГОВАЯ УСТАНОВКА</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map(function(step) {
              return (
                <div key={step.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#C9A84C' }}>
                    {step.n}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px' }}>{step.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '14px' }}>ПОДДЕРЖИВАЕМЫЕ ДАТЧИКИ</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {SENSORS.map(function(s) {
              return (
                <div key={s.name} style={{ background: '#0A0A0F', borderRadius: '8px', padding: '14px', border: '1px solid #1E1E2E' }}>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#C9A84C', marginBottom: '3px' }}>{s.name}</div>
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

        <div style={{ background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)', border: '1px solid #2A2A3E', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', marginBottom: '4px' }}>Готовая прошивка ESP32</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Файл .ino с инструкцией — скачай и настрой под свой объект</div>
          </div>
          <a href="https://github.com/modules-conglomerate/modules-platform/blob/main/iot/firmware/modules_sensor/modules_sensor.ino" target="_blank" rel="noopener noreferrer" style={{ padding: '11px 22px', background: '#C9A84C', color: '#0A0A0F', borderRadius: '6px', fontWeight: 700, fontSize: '12px', textDecoration: 'none', letterSpacing: '0.08em', flexShrink: 0 }}>
            ↓ СКАЧАТЬ ПРОШИВКУ
          </a>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px', display: 'flex', gap: '14px' }}>
          <span style={{ fontSize: '22px', flexShrink: 0 }}>💬</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '4px' }}>Нужна помощь с подключением?</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', lineHeight: 1.5 }}>
              Напишите в Telegram-бот — команда назрОС поможет с настройкой датчиков на вашем объекте.
            </div>
            <a href="https://t.me/nazr_os_chat" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#229ED9', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
              Написать в Telegram
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

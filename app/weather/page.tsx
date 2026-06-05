import { createClient } from '@/lib/supabase/server'

const REGIONS = [
  { name: 'Архангельская область', temp: -12, humidity: 78, wind: 6, pressure: 759, condition: 'Облачно', objects: ['Терразавод Гибрид', 'Аэрокосмический порт', 'Технопарк назрОС'] },
  { name: 'Арктический регион',    temp: -31, humidity: 65, wind: 14, pressure: 742, condition: 'Метель',   objects: ['ВАМ Магистраль', 'Обсерватория'] },
  { name: 'Калининградская обл.',  temp:   2, humidity: 85, wind: 8,  pressure: 761, condition: 'Дождь',   objects: ['Гигафабрика Модули'] },
  { name: 'Мурманская область',    temp: -18, humidity: 70, wind: 11, pressure: 748, condition: 'Снег',    objects: ['Рэнджер-порт'] },
  { name: 'Ленинградская область', temp:  -4, humidity: 82, wind: 5,  pressure: 758, condition: 'Пасмурно', objects: ['Дрифт-трек КНК'] },
  { name: 'Москва',               temp:  -7, humidity: 75, wind: 3,  pressure: 762, condition: 'Ясно',    objects: ['Арена 500ru'] },
  { name: 'Каспийское море',       temp:   8, humidity: 68, wind: 9,  pressure: 764, condition: 'Ветрено', objects: ['Остров Намаз'] },
]

const CONDITION_ICON: Record<string, string> = {
  'Облачно':  '☁️',
  'Метель':   '🌨️',
  'Дождь':    '🌧️',
  'Снег':     '❄️',
  'Пасмурно': '🌥️',
  'Ясно':     '☀️',
  'Ветрено':  '💨',
}

const TEMP_COLOR = function(t: number): string {
  if (t < -20) return '#5B8CFF'
  if (t < -5)  return '#00D4AA'
  if (t < 5)   return '#C9A84C'
  return '#EF4444'
}

export default async function WeatherPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПОГОДА НА ТЕРРИТОРИЯХ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Метеоданные по всем регионам присутствия конгломерата · {REGIONS.length} регионов
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Главная карточка — Архангельск */}
        <div style={{
          background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)',
          border: '1px solid #2A2A3E', borderRadius: '12px',
          padding: '24px', marginBottom: '20px',
          display: 'grid', gridTemplateColumns: '1fr auto',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ГЛАВНЫЙ РЕГИОН · АРХАНГЕЛЬСКАЯ ОБЛАСТЬ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '64px', fontWeight: 800, color: TEMP_COLOR(-12), lineHeight: 1 }}>
                −12°C
              </span>
              <div>
                <div style={{ fontSize: '16px', color: '#B0B0C0', marginBottom: '4px' }}>☁️ Облачно</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Ощущается как −17°C</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '24px' }}>
              {[
                { label: 'Влажность', value: '78%' },
                { label: 'Ветер',     value: '6 м/с' },
                { label: 'Давление',  value: '759 мм' },
                { label: 'Видимость', value: '8 км' },
              ].map(function(item) {
                return (
                  <div key={item.label}>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '80px', opacity: 0.6 }}>☁️</div>
          </div>
        </div>

        {/* Все регионы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {REGIONS.map(function(r) {
            const color = TEMP_COLOR(r.temp)
            return (
              <div key={r.name} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px' }}>{r.name}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>
                      {r.objects.join(' · ')}
                    </div>
                  </div>
                  <span style={{ fontSize: '24px' }}>{CONDITION_ICON[r.condition] ?? '🌡️'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: color }}>
                    {r.temp > 0 ? '+' : ''}{r.temp}°
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>{r.condition}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Влажность', value: r.humidity + '%' },
                    { label: 'Ветер',     value: r.wind + ' м/с' },
                    { label: 'Давление',  value: r.pressure + ' мм' },
                  ].map(function(item) {
                    return (
                      <div key={item.label} style={{
                        background: '#0A0A0F', borderRadius: '4px',
                        padding: '6px 8px', border: '1px solid #1E1E2E',
                      }}>
                        <div style={{ fontSize: '9px', color: '#374151', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.value}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Предупреждения */}
                {(r.wind > 10 || r.temp < -25) && (
                  <div style={{
                    marginTop: '10px', padding: '6px 10px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '4px', fontSize: '10px', color: '#FCA5A5',
                  }}>
                    ⚠️ {r.wind > 10 ? 'Сильный ветер' : ''}{r.wind > 10 && r.temp < -25 ? ' · ' : ''}{r.temp < -25 ? 'Экстремальный холод' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
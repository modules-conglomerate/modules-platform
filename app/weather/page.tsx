import { createClient } from '@/lib/supabase/server'
import { getWeather } from '@/lib/weather'
import Link from 'next/link'

export const revalidate = 1800

export default async function WeatherPage() {
  const supabase = createClient()

  const { data: objects } = await supabase
    .from('objects')
    .select('id, name, slug, region, lat, lng, status')
    .eq('is_public', true)
    .not('lat', 'is', null)

  const weatherResults = await Promise.all(
    (objects ?? []).map(async function(obj) {
      const weather = await getWeather(obj.lat!, obj.lng!)
      return { obj, weather }
    })
  )

  const TEMP_COLOR = function(t: number) {
    if (t < -30) return '#5B8CFF'
    if (t < -10) return '#00D4AA'
    if (t < 0)   return '#E8C96B'
    if (t < 10)  return '#C9A84C'
    return '#EF4444'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Погода</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПОГОДА НА ТЕРРИТОРИЯХ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Актуальные данные Open-Meteo · Обновляется каждые 30 минут · {objects?.length ?? 0} объектов
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Главный объект — первый с координатами */}
        {weatherResults[0]?.weather && (
          <div style={{
            background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)',
            border: '1px solid #2A2A3E', borderRadius: '12px',
            padding: '24px', marginBottom: '20px',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '8px' }}>
                {weatherResults[0].obj.name.toUpperCase()} · {weatherResults[0].obj.region}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '64px', fontWeight: 800, color: TEMP_COLOR(weatherResults[0].weather.temperature), lineHeight: 1 }}>
                  {weatherResults[0].weather.temperature > 0 ? '+' : ''}{weatherResults[0].weather.temperature}°C
                </span>
                <div>
                  <div style={{ fontSize: '16px', color: '#B0B0C0', marginBottom: '4px' }}>
                    {weatherResults[0].weather.condition_icon} {weatherResults[0].weather.condition}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    Ощущается как {weatherResults[0].weather.feels_like > 0 ? '+' : ''}{weatherResults[0].weather.feels_like}°C
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '24px' }}>
                {[
                  { label: 'Влажность', value: weatherResults[0].weather.humidity + '%' },
                  { label: 'Ветер',     value: weatherResults[0].weather.wind_speed + ' м/с' },
                  { label: 'Давление',  value: weatherResults[0].weather.pressure + ' мм' },
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
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '80px' }}>
              {weatherResults[0].weather.condition_icon}
            </div>
          </div>
        )}

        {/* Все объекты */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {weatherResults.map(function({ obj, weather }) {
            if (!weather) return (
              <div key={obj.id} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', padding: '16px', opacity: 0.5,
              }}>
                <div style={{ fontSize: '12px', color: '#E8E8F0', marginBottom: '4px' }}>{obj.name}</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '12px' }}>{obj.region}</div>
                <div style={{ fontSize: '11px', color: '#374151' }}>Данные недоступны</div>
              </div>
            )

            const color = TEMP_COLOR(weather.temperature)
            const hasWarning = weather.wind_speed > 12 || weather.temperature < -30

            return (
              <div key={obj.id} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <Link href={'/objects/' + obj.slug} style={{ fontSize: '12px', fontWeight: 600, color: '#E8E8F0', textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                      {obj.name}
                    </Link>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>{obj.region}</div>
                  </div>
                  <span style={{ fontSize: '28px' }}>{weather.condition_icon}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: color }}>
                    {weather.temperature > 0 ? '+' : ''}{weather.temperature}°
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{weather.condition}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: hasWarning ? '10px' : '0' }}>
                  {[
                    { label: 'Влажность', value: weather.humidity + '%' },
                    { label: 'Ветер',     value: weather.wind_speed + ' м/с' },
                    { label: 'Давление',  value: weather.pressure + ' мм' },
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

                {hasWarning && (
                  <div style={{
                    padding: '6px 10px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '4px', fontSize: '10px', color: '#FCA5A5',
                  }}>
                    ⚠️ {weather.wind_speed > 12 ? 'Сильный ветер' : ''}{weather.wind_speed > 12 && weather.temperature < -30 ? ' · ' : ''}{weather.temperature < -30 ? 'Экстремальный холод' : ''}
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

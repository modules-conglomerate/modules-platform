import { createClient } from '@/lib/supabase/server'
import { getWeather } from '@/lib/weather'
import Link from 'next/link'

export async function WeatherWidget() {
  const supabase = createClient()

  const { data: mainObj } = await supabase
    .from('objects')
    .select('id, name, region, lat, lng')
    .eq('slug', 'terrazavod-gibrid')
    .single()

  const weather = mainObj?.lat && mainObj?.lng
    ? await getWeather(mainObj.lat, mainObj.lng)
    : null

  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '12px' }}>
      <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>
        ПОГОДА НА ТЕРРИТОРИИ
      </div>

      {weather ? (
        <>
          <div style={{ fontSize: '11px', color: '#C9A84C', marginBottom: '8px' }}>
            {mainObj?.region ?? 'Архангельская область'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>{weather.condition_icon}</span>
            <span style={{ fontSize: '28px', fontWeight: 700 }}>
              {weather.temperature > 0 ? '+' : ''}{weather.temperature}°C
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '8px' }}>
            {weather.condition} · Ощущается {weather.feels_like > 0 ? '+' : ''}{weather.feels_like}°C
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
            {[
              { label: 'Влажность', value: weather.humidity + '%' },
              { label: 'Ветер',     value: weather.wind_speed + ' м/с' },
              { label: 'Давление',  value: weather.pressure + ' мм' },
            ].map(function(item) {
              return (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#6B7280' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500 }}>{item.value}</div>
                </div>
              )
            })}
          </div>
          {(weather.wind_speed > 12 || weather.temperature < -30) && (
            <div style={{ padding: '5px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', fontSize: '9px', color: '#FCA5A5', marginBottom: '8px' }}>
              ⚠️ {weather.wind_speed > 12 ? 'Сильный ветер' : ''}{weather.temperature < -30 ? ' Экстремальный холод' : ''}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>
          Данные загружаются...
        </div>
      )}

      <Link href="/weather" style={{ fontSize: '10px', color: '#374151', textDecoration: 'none' }}>
        Погода по всем объектам →
      </Link>
    </div>
  )
}

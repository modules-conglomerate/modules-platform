import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props { params: { slug: string } }

const SENSOR_LABEL: Record<string, string> = {
  temperature: 'Температура',
  humidity:    'Влажность',
  pressure:    'Давление',
  air_quality: 'Качество воздуха',
  wind_speed:  'Скорость ветра',
  soil_ph:     'pH грунта',
  water_ph:    'pH воды',
}

const SENSOR_UNIT: Record<string, string> = {
  temperature: '°C',
  humidity:    '%',
  pressure:    'мм рт.ст.',
  air_quality: 'AQI',
  wind_speed:  'м/с',
  soil_ph:     'pH',
  water_ph:    'pH',
}

const SENSOR_COLOR: Record<string, string> = {
  temperature: '#5B8CFF',
  humidity:    '#00D4AA',
  pressure:    '#A78BFA',
  air_quality: '#4ADE80',
  wind_speed:  '#E8C96B',
  soil_ph:     '#C9A84C',
  water_ph:    '#38BDF8',
}

const SENSOR_ICON: Record<string, string> = {
  temperature: '🌡',
  humidity:    '💧',
  pressure:    '🔵',
  air_quality: '🌿',
  wind_speed:  '💨',
  soil_ph:     '🪨',
  water_ph:    '🌊',
}

export default async function EcoPage({ params }: Props) {
  const supabase = createClient()

  const { data: obj } = await supabase
    .from('objects')
    .select('id, name, slug, region, status')
    .eq('slug', params.slug)
    .single()

  if (!obj) notFound()

  const { data: ecoData } = await supabase
    .from('eco_data')
    .select('*')
    .eq('object_id', obj.id)
    .order('recorded_at', { ascending: false })
    .limit(100)

  const latest: Record<string, any> = {}
  const history: Record<string, any[]> = {}

  ecoData?.forEach(function(d) {
    if (!latest[d.sensor_type]) latest[d.sensor_type] = d
    if (!history[d.sensor_type]) history[d.sensor_type] = []
    if (history[d.sensor_type].length < 10) history[d.sensor_type].push(d)
  })

  const hasSensors = Object.keys(latest).length > 0

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>Главная</Link>
        <span style={{ color: '#374151' }}>/</span>
        <Link href="/objects" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>Объекты</Link>
        <span style={{ color: '#374151' }}>/</span>
        <Link href={'/objects/' + obj.slug} style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>{obj.name}</Link>
        <span style={{ color: '#374151' }}>/</span>
        <span style={{ color: '#4ADE80', fontSize: '12px' }}>Экопаспорт</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
            🌿 Экологический паспорт
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            {obj.name} · {obj.region}
          </p>
        </div>

        {hasSensors ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Текущие показания */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {Object.entries(latest).map(function([type, data]) {
                const color = SENSOR_COLOR[type] ?? '#6B7280'
                return (
                  <div key={type} style={{
                    background: '#12121A', border: '1px solid #1E1E2E',
                    borderTop: '2px solid ' + color,
                    borderRadius: '8px', padding: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{SENSOR_ICON[type] ?? '📊'}</span>
                      <span style={{ fontSize: '9px', color: '#374151' }}>
                        {new Date(data.recorded_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>
                      {SENSOR_LABEL[type] ?? type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, color: color }}>{data.value}</span>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>{SENSOR_UNIT[type] ?? data.unit}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* История показаний */}
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '16px' }}>
                ИСТОРИЯ ИЗМЕРЕНИЙ
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E1E2E' }}>
                      {['Время', 'Датчик', 'Значение', 'Единица'].map(function(h) {
                        return (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em' }}>
                            {h.toUpperCase()}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {ecoData?.slice(0, 30).map(function(d, i) {
                      const color = SENSOR_COLOR[d.sensor_type] ?? '#6B7280'
                      return (
                        <tr key={d.id} style={{ borderBottom: '1px solid #1A1A2A', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '8px 12px', color: '#374151', fontFamily: 'monospace', fontSize: '11px' }}>
                            {new Date(d.recorded_at).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '8px 12px', color: color }}>
                            {SENSOR_LABEL[d.sensor_type] ?? d.sensor_type}
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: color }}>
                            {d.value}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>
                            {SENSOR_UNIT[d.sensor_type] ?? d.unit}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div style={{
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '8px', padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>🌿</div>
          <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                Датчики экомониторинга не подключены
              </div>
              <div style={{ fontSize: '12px', color: '#374151', marginBottom: '16px' }}>
                Установите IoT-датчики на объекте чтобы данные появились здесь автоматически
              </div>
              <Link href="/iot" style={{
                padding: '10px 20px', background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
                color: '#C9A84C', fontSize: '12px', fontWeight: 700,
                textDecoration: 'none', display: 'inline-block',
              }}>
                📡 Инструкция по подключению датчиков →
              </Link>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              Данные появятся после установки IoT-датчиков на объекте
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

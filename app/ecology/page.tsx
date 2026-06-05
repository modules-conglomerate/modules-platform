import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

export const revalidate = 60

export default async function EcologyPage() {
  const supabase = createClient()

  const { data: objects } = await supabase
    .from('objects')
    .select('id, name, slug, region, status')
    .eq('is_public', true)

  const { data: ecoData } = await supabase
    .from('eco_data')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(200)

  const byObject: Record<string, typeof ecoData> = {}
  ecoData?.forEach(function(d) {
    if (!d.object_id) return
    if (!byObject[d.object_id]) byObject[d.object_id] = []
    byObject[d.object_id]!.push(d)
  })

  const latestBySensor: Record<string, Record<string, any>> = {}
  ecoData?.forEach(function(d) {
    if (!d.object_id) return
    if (!latestBySensor[d.object_id]) latestBySensor[d.object_id] = {}
    if (!latestBySensor[d.object_id][d.sensor_type]) {
      latestBySensor[d.object_id][d.sensor_type] = d
    }
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ЭКОЛОГИЧЕСКИЙ МОНИТОРИНГ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Данные датчиков со всех объектов экосистемы · {ecoData?.length ?? 0} измерений
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {ecoData && ecoData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {objects?.map(function(obj) {
              const sensors = latestBySensor[obj.id]
              if (!sensors || Object.keys(sensors).length === 0) return null

              return (
                <div key={obj.id} style={{
                  background: '#12121A', border: '1px solid #1E1E2E',
                  borderRadius: '8px', overflow: 'hidden',
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px' }}>{obj.name}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>{obj.region}</div>
                    </div>
                    <Link href={'/objects/' + obj.slug + '/eco'} style={{ fontSize: '10px', color: '#C9A84C', textDecoration: 'none' }}>
                      Подробнее →
                    </Link>
                  </div>
                  <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {Object.entries(sensors).map(function([sensorType, data]) {
                      const color = SENSOR_COLOR[sensorType] ?? '#6B7280'
                      return (
                        <div key={sensorType} style={{
                          background: '#0A0A0F', borderRadius: '6px',
                          padding: '10px', border: '1px solid #1E1E2E',
                        }}>
                          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px' }}>
                            {SENSOR_LABEL[sensorType] ?? sensorType}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: color }}>
                              {data.value}
                            </span>
                            <span style={{ fontSize: '11px', color: '#6B7280' }}>
                              {SENSOR_UNIT[sensorType] ?? data.unit}
                            </span>
                          </div>
                          <div style={{ fontSize: '9px', color: '#374151', marginTop: '4px' }}>
                            {new Date(data.recorded_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '8px', padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', opacity: 0.2, marginBottom: '12px' }}>🌿</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Данные датчиков не подключены</div>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              Добавьте данные экомониторинга через Supabase SQL Editor
            </div>
            <div style={{ marginTop: '16px' }}>
              <Link href="/objects" style={{
                padding: '8px 16px', background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
                color: '#C9A84C', fontSize: '12px', textDecoration: 'none',
              }}>
                Перейти к объектам →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
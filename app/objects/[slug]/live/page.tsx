
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props { params: { slug: string } }

const TYPE_LABEL: Record<string, string> = {
  construction: 'Строительство',
  production:   'Производство',
  overview:     'Обзорная',
  science:      'Научная',
}

export default async function LivePage({ params }: Props) {
  const supabase = createClient()

  const { data: obj } = await supabase
    .from('objects')
    .select('id, name, slug, region, status')
    .eq('slug', params.slug)
    .single()

  if (!obj) notFound()

  const { data: streams } = await supabase
    .from('live_streams')
    .select('*')
    .eq('object_id', obj.id)
    .eq('is_active', true)

  const { data: ecoLatest } = await supabase
    .from('eco_data')
    .select('sensor_type, value, unit, recorded_at')
    .eq('object_id', obj.id)
    .order('recorded_at', { ascending: false })
    .limit(10)

  const latestSensors: Record<string, any> = {}
  ecoLatest?.forEach(function(d) {
    if (!latestSensors[d.sensor_type]) latestSensors[d.sensor_type] = d
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '10px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
        <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
        <Link href="/objects" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Объекты</Link>
        <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
        <Link href={'/objects/' + obj.slug} style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>{obj.name}</Link>
        <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
        <span style={{ color: '#EF4444', fontSize: '11px' }}>Трансляции</span>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Трансляции 24/7</h1>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{obj.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {streams && streams.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {streams.map(function(stream) {
                  return (
                    <div key={stream.id} style={{
                      background: '#12121A', border: '1px solid #1E1E2E',
                      borderRadius: '8px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '180px', background: '#0A0A0F',
                        position: 'relative', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ textAlign: 'center', opacity: 0.2 }}>
                          <div style={{ fontSize: '36px', marginBottom: '6px' }}>📡</div>
                          <div style={{ fontSize: '10px', color: '#6B7280' }}>LIVE</div>
                        </div>
                        <div style={{
                          position: 'absolute', top: '8px', left: '8px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: 'rgba(239,68,68,0.9)', borderRadius: '4px', padding: '3px 8px',
                        }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>LIVE</span>
                        </div>
                        <div style={{
                          position: 'absolute', bottom: '8px', right: '8px',
                          fontSize: '9px', color: '#6B7280',
                          background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '3px',
                        }}>
                          {TYPE_LABEL[stream.type] ?? stream.type}
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{stream.name}</div>
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
                <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.2 }}>📡</div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  Камеры не подключены
                </div>
                <div style={{ fontSize: '12px', color: '#374151' }}>
                  Трансляции появятся после установки камер на объекте
                </div>
              </div>
            )}
          </div>

          {/* Погода и датчики */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px' }}>
                ДАННЫЕ В РЕАЛЬНОМ ВРЕМЕНИ
              </div>

              {Object.keys(latestSensors).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(latestSensors).map(function([type, data]) {
                    const COLORS: Record<string, string> = {
                      temperature: '#5B8CFF', humidity: '#00D4AA',
                      pressure: '#A78BFA', wind_speed: '#E8C96B',
                      air_quality: '#4ADE80',
                    }
                    const LABELS: Record<string, string> = {
                      temperature: 'Температура', humidity: 'Влажность',
                      pressure: 'Давление', wind_speed: 'Ветер',
                      air_quality: 'Воздух',
                    }
                    const color = COLORS[type] ?? '#6B7280'
                    return (
                      <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1A1A2A' }}>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{LABELS[type] ?? type}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: color }}>
                          {data.value} {data.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Температура', value: '—', color: '#5B8CFF' },
                    { label: 'Влажность',   value: '—', color: '#00D4AA' },
                    { label: 'Давление',    value: '—', color: '#A78BFA' },
                    { label: 'Ветер',       value: '—', color: '#E8C96B' },
                  ].map(function(item) {
                    return (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1A1A2A' }}>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{item.label}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <Link href={'/objects/' + obj.slug} style={{
              display: 'block', padding: '11px', textAlign: 'center',
              background: 'transparent', border: '1px solid #1E1E2E',
              borderRadius: '6px', color: '#6B7280', fontSize: '12px',
              textDecoration: 'none',
            }}>
              ← Вернуться к объекту
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

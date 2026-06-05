import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60

export default async function StreamsPage() {
  const supabase = createClient()

  const { data: streams } = await supabase
    .from('live_streams')
    .select('*, objects(name, slug, region)')
    .eq('is_active', true)

  const { data: objects } = await supabase
    .from('objects')
    .select('id, name, slug, region, status')
    .eq('is_public', true)

  const TYPE_LABEL: Record<string, string> = {
    construction: 'Строительство',
    production:   'Производство',
    overview:     'Обзорная',
    science:      'Научная',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#EF4444', boxShadow: '0 0 8px #EF4444',
            animation: 'none',
          }} />
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: 0 }}>
            ТРАНСЛЯЦИИ 24/7
          </h1>
        </div>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Прямые трансляции с объектов конгломерата · {streams?.length ?? 0} активных камер
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {streams && streams.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {streams.map(function(stream) {
              return (
                <div key={stream.id} style={{
                  background: '#12121A', border: '1px solid #1E1E2E',
                  borderRadius: '8px', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '200px', background: '#0A0A0F',
                    position: 'relative', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ textAlign: 'center', opacity: 0.3 }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>📡</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>LIVE</div>
                    </div>
                    <div style={{
                      position: 'absolute', top: '10px', left: '10px',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: 'rgba(239,68,68,0.9)', borderRadius: '4px',
                      padding: '3px 8px',
                    }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>LIVE</span>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      fontSize: '9px', color: '#6B7280',
                      background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '3px',
                    }}>
                      {TYPE_LABEL[stream.type] ?? stream.type}
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{stream.name}</div>
                    {stream.objects && (
                      <Link href={'/objects/' + stream.objects.slug} style={{
                        fontSize: '11px', color: '#C9A84C', textDecoration: 'none',
                      }}>
                        {stream.objects.name} →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            <div style={{
              background: '#12121A', border: '1px solid #1E1E2E',
              borderRadius: '8px', padding: '40px', textAlign: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.2 }}>📡</div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                Активных трансляций нет
              </div>
              <div style={{ fontSize: '12px', color: '#374151' }}>
                Камеры появятся после установки на объектах
              </div>
            </div>

            {/* Список объектов без камер */}
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px' }}>
                ОБЪЕКТЫ БЕЗ КАМЕР
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {objects?.map(function(obj) {
                  return (
                    <div key={obj.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', background: '#0A0A0F',
                      border: '1px solid #1E1E2E', borderRadius: '6px',
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#E8E8F0' }}>{obj.name}</div>
                        <div style={{ fontSize: '10px', color: '#6B7280' }}>{obj.region}</div>
                      </div>
                      <button style={{
                        padding: '5px 12px', background: 'transparent',
                        border: '1px solid #2A2A3E', borderRadius: '4px',
                        color: '#6B7280', fontSize: '10px', cursor: 'pointer',
                      }}>
                        + Добавить камеру
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
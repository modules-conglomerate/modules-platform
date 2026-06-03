import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_COLOR: Record<string, string> = {
  construction: '#C9A84C',
  active:       '#00D4AA',
  planning:     '#5B8CFF',
  archived:     '#6B7280',
}

const STATUS_LABEL: Record<string, string> = {
  construction: 'Строится',
  active:       'Действует',
  planning:     'Проектируется',
  archived:     'Архив',
}

const TYPE_LABEL: Record<string, string> = {
  production:     'Производство',
  transport:      'Транспорт',
  science:        'Наука',
  residential:    'Жилая зона',
  entertainment:  'Развлечения',
  sport:          'Спорт',
  culture:        'Культура',
  infrastructure: 'Инфраструктура',
}

export default async function ObjectsPage() {
  const supabase = createClient()
  const { data: objects } = await supabase
    .from('objects')
    .select('*')
    .eq('is_public', true)
    .order('status', { ascending: true })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px', color: '#E8E8F0' }}>
          КАТАЛОГ ОБЪЕКТОВ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          {objects?.length ?? 0} объектов экосистемы Модули
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {objects?.map(function(obj) {
            const color = STATUS_COLOR[obj.status] ?? '#6B7280'
            return (
              <Link
                key={obj.id}
                href={`/objects/${obj.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#12121A', border: '1px solid #1E1E2E',
                  borderRadius: '8px', overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Цветная полоска сверху */}
                  <div style={{ height: '3px', background: color }} />

                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                        color: color, padding: '3px 8px',
                        background: color + '18', borderRadius: '3px',
                      }}>
                        {(STATUS_LABEL[obj.status] ?? obj.status).toUpperCase()}
                      </span>
                      <span style={{ fontSize: '10px', color: '#374151' }}>
                        {TYPE_LABEL[obj.type] ?? obj.type}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {obj.name}
                    </h2>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 14px' }}>
                      {obj.region}
                    </p>

                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>Готовность</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: color }}>{obj.progress_pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', background: '#1E1E2E', borderRadius: '2px', marginBottom: '12px' }}>
                      <div style={{ height: '3px', borderRadius: '2px', background: color, width: obj.progress_pct + '%' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#374151' }}>
                        {obj.deadline ? 'Сдача: ' + new Date(obj.deadline).toLocaleDateString('ru', { month: 'short', year: 'numeric' }) : 'Действует'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#C9A84C' }}>Открыть →</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

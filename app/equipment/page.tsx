import { createClient } from '@/lib/supabase/server'

const CAT_LABEL: Record<string, string> = {
  construction: 'Строительная',
  road:         'Дорожная',
  quarry:       'Карьерная',
  energy:       'Энергетическая',
  airfield:     'Аэродромная',
  service:      'Сервисная',
  experimental: 'Экспериментальная',
}

const STATUS_LABEL: Record<string, string> = {
  working:     'Работает',
  on_site:     'На объекте',
  maintenance: 'На обслуживании',
  reserve:     'В резерве',
}

const STATUS_COLOR: Record<string, string> = {
  working:     '#00D4AA',
  on_site:     '#5B8CFF',
  maintenance: '#C9A84C',
  reserve:     '#6B7280',
}

export const revalidate = 60

export default async function EquipmentPage() {
  const supabase = createClient()

  const { data: equipment, count } = await supabase
    .from('equipment')
    .select('*', { count: 'exact' })
    .order('model', { ascending: true })
    .limit(100)

  const byStatus: Record<string, number> = {}
  const byCat: Record<string, number> = {}
  equipment?.forEach(function(e) {
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
    byCat[e.category] = (byCat[e.category] ?? 0) + 1
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПАРК ТЕХНИКИ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          {count?.toLocaleString('ru') ?? 0} единиц техники конгломерата
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Статусы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {Object.entries(STATUS_LABEL).map(function([key, label]) {
            const color = STATUS_COLOR[key] ?? '#6B7280'
            return (
              <div key={key} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderTop: '2px solid ' + color, borderRadius: '8px', padding: '14px',
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: color, marginBottom: '4px' }}>
                  {(byStatus[key] ?? 0).toLocaleString('ru')}
                </div>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>{label}</div>
              </div>
            )
          })}
        </div>

        {/* По категориям */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {Object.entries(byCat).map(function([cat, num]) {
            return (
              <div key={cat} style={{
                padding: '5px 12px', borderRadius: '20px',
                border: '1px solid #2A2A3E', background: '#12121A',
                fontSize: '10px', color: '#B0B0C0',
              }}>
                {CAT_LABEL[cat] ?? cat}: <span style={{ color: '#C9A84C', fontWeight: 700 }}>{num}</span>
              </div>
            )
          })}
        </div>

        {/* Таблица */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E' }}>
            <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>
              СПИСОК ТЕХНИКИ (показано 100)
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
            padding: '10px 16px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14',
          }}>
            {['Модель', 'Категория', 'Статус', 'Серийный №'].map(function(h) {
              return (
                <div key={h} style={{ fontSize: '9px', color: '#374151', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {h.toUpperCase()}
                </div>
              )
            })}
          </div>

          {equipment?.map(function(eq, i) {
            const color = STATUS_COLOR[eq.status] ?? '#6B7280'
            return (
              <div
                key={eq.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  padding: '10px 16px',
                  borderBottom: i < equipment.length - 1 ? '1px solid #1A1A2A' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <div style={{ fontSize: '12px', color: '#E8E8F0', display: 'flex', alignItems: 'center' }}>
                  {eq.model}
                </div>
                <div style={{ fontSize: '11px', color: '#B0B0C0', display: 'flex', alignItems: 'center' }}>
                  {CAT_LABEL[eq.category] ?? eq.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, color: color,
                    padding: '2px 8px', background: color + '18', borderRadius: '3px',
                  }}>
                    {STATUS_LABEL[eq.status] ?? eq.status}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#374151', display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>
                  {eq.serial_number ?? '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

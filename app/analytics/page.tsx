import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function AnalyticsPage() {
  const supabase = createClient()

  const [
    { data: objects },
    { count: empCount },
    { count: eqCount },
    { count: eventCount },
  ] = await Promise.all([
    supabase.from('objects').select('*').eq('is_public', true),
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('equipment').select('*', { count: 'exact', head: true }),
    supabase.from('object_events').select('*', { count: 'exact', head: true }),
  ])

  const total   = objects?.length ?? 0
  const active  = objects?.filter(function(o) { return o.status === 'active' }).length ?? 0
  const constr  = objects?.filter(function(o) { return o.status === 'construction' }).length ?? 0
  const avgProg = objects && objects.length > 0
    ? Math.round(objects.reduce(function(s, o) { return s + (o.progress_pct ?? 0) }, 0) / objects.length)
    : 0

  const byType: Record<string, number> = {}
  objects?.forEach(function(o) { byType[o.type] = (byType[o.type] ?? 0) + 1 })

  const TYPE_LABEL: Record<string, string> = {
    production: 'Производство', transport: 'Транспорт',
    science: 'Наука', residential: 'Жилая зона',
    entertainment: 'Развлечения', sport: 'Спорт',
    culture: 'Культура', infrastructure: 'Инфраструктура',
  }

  const KPI = [
    { label: 'Всего объектов',    value: total,                      color: '#E8E8F0', sub: 'в экосистеме' },
    { label: 'Действуют',         value: active,                     color: '#00D4AA', sub: 'объектов' },
    { label: 'Строится',          value: constr,                     color: '#C9A84C', sub: 'объектов' },
    { label: 'Средняя готовность',value: avgProg + '%',              color: '#5B8CFF', sub: 'по всем объектам' },
    { label: 'Сотрудников',       value: (empCount ?? 0).toLocaleString('ru'), color: '#A78BFA', sub: 'в конгломерате' },
    { label: 'Единиц техники',    value: (eqCount ?? 0).toLocaleString('ru'),  color: '#E8C96B', sub: 'в парке' },
    { label: 'Событий',           value: (eventCount ?? 0).toLocaleString('ru'), color: '#4ADE80', sub: 'зафиксировано' },
    { label: 'Регионов',          value: '7',                        color: '#38BDF8', sub: 'присутствия' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          АНАЛИТИКА
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Сводные показатели конгломерата в реальном времени
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* KPI блоки */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {KPI.map(function(kpi) {
            return (
              <div key={kpi.label} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderTop: '2px solid ' + kpi.color,
                borderRadius: '8px', padding: '16px',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: kpi.color, marginBottom: '4px', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: '#E8E8F0', fontWeight: 600, marginBottom: '2px' }}>{kpi.label}</div>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>{kpi.sub}</div>
              </div>
            )
          })}
        </div>

        {/* Прогресс объектов */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '16px' }}>
            ПРОГРЕСС СТРОИТЕЛЬСТВА
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {objects?.filter(function(o) { return o.status === 'construction' })
              .sort(function(a, b) { return (b.progress_pct ?? 0) - (a.progress_pct ?? 0) })
              .map(function(obj) {
                return (
                  <div key={obj.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#E8E8F0' }}>{obj.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#C9A84C' }}>{obj.progress_pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1E1E2E', borderRadius: '3px' }}>
                      <div style={{
                        height: '6px', borderRadius: '3px',
                        background: 'linear-gradient(90deg, #C9A84C, #E8C96B)',
                        width: obj.progress_pct + '%',
                        boxShadow: '0 0 8px rgba(201,168,76,0.4)',
                      }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* По типам */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '16px' }}>
              ОБЪЕКТЫ ПО ТИПАМ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(byType).map(function([type, count]) {
                const pct = Math.round((count / total) * 100)
                const colors = ['#C9A84C','#00D4AA','#5B8CFF','#A78BFA','#4ADE80','#E8C96B','#38BDF8','#F87171']
                const color = colors[Object.keys(byType).indexOf(type) % colors.length]
                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#B0B0C0' }}>{TYPE_LABEL[type] ?? type}</span>
                      <span style={{ fontSize: '11px', color: color, fontWeight: 600 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: '#1E1E2E', borderRadius: '2px' }}>
                      <div style={{ height: '4px', borderRadius: '2px', background: color, width: pct + '%' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '16px' }}>
              СВОДКА ПО СТАТУСАМ
            </div>
            {[
              { label: 'Действующие объекты',  value: active,          color: '#00D4AA', icon: '✓' },
              { label: 'В строительстве',      value: constr,          color: '#C9A84C', icon: '⚙' },
              { label: 'Проектируются',         value: objects?.filter(function(o) { return o.status === 'planning' }).length ?? 0, color: '#5B8CFF', icon: '◎' },
              { label: 'В архиве',             value: objects?.filter(function(o) { return o.status === 'archived' }).length ?? 0, color: '#6B7280', icon: '▣' },
            ].map(function(row) {
              return (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0', borderBottom: '1px solid #1E1E2E',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    background: row.color + '22', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', color: row.color, flexShrink: 0,
                  }}>
                    {row.icon}
                  </div>
                  <span style={{ flex: 1, fontSize: '12px', color: '#B0B0C0' }}>{row.label}</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
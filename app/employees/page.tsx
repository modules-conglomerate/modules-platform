import { createClient } from '@/lib/supabase/server'

const STATUS_LABEL: Record<string, string> = {
  on_site:    'На объекте',
  in_transit: 'В пути',
  working:    'Работает',
  in_office:  'В офисе',
  unavailable:'Недоступен',
}

const STATUS_COLOR: Record<string, string> = {
  on_site:    '#00D4AA',
  in_transit: '#5B8CFF',
  working:    '#C9A84C',
  in_office:  '#A78BFA',
  unavailable:'#6B7280',
}

export const revalidate = 60

export default async function EmployeesPage() {
  const supabase = createClient()

  const { data: employees, count } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .order('full_name', { ascending: true })
    .limit(100)

  const byStatus: Record<string, number> = {}
  employees?.forEach(function(e) {
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          СОТРУДНИКИ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          {count?.toLocaleString('ru') ?? 0} сотрудников конгломерата
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Статусы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {Object.entries(STATUS_LABEL).map(function([key, label]) {
            const color = STATUS_COLOR[key] ?? '#6B7280'
            const num = byStatus[key] ?? 0
            return (
              <div key={key} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderTop: '2px solid ' + color,
                borderRadius: '8px', padding: '14px',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: color, marginBottom: '4px' }}>
                  {num.toLocaleString('ru')}
                </div>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>{label}</div>
              </div>
            )
          })}
        </div>

        {/* Таблица сотрудников */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>
              СПИСОК СОТРУДНИКОВ (показано 100)
            </span>
          </div>

          {/* Шапка таблицы */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
            padding: '10px 16px', borderBottom: '1px solid #1E1E2E',
            background: '#0D0D14',
          }}>
            {['ФИО', 'Должность', 'Статус', 'Уровень допуска'].map(function(h) {
              return (
                <div key={h} style={{ fontSize: '9px', color: '#374151', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {h.toUpperCase()}
                </div>
              )
            })}
          </div>

          {/* Строки */}
          {employees?.map(function(emp, i) {
            const color = STATUS_COLOR[emp.status] ?? '#6B7280'
            const label = STATUS_LABEL[emp.status] ?? emp.status
            return (
              <div
                key={emp.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  padding: '10px 16px',
                  borderBottom: i < employees.length - 1 ? '1px solid #1A1A2A' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: color + '22', border: '1px solid ' + color + '44',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: color, fontWeight: 700, flexShrink: 0,
                  }}>
                    {emp.full_name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '12px', color: '#E8E8F0' }}>{emp.full_name}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#B0B0C0', display: 'flex', alignItems: 'center' }}>
                  {emp.position ?? '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, color: color,
                    padding: '2px 8px', background: color + '18', borderRadius: '3px',
                  }}>
                    {label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {Array.from({ length: 5 }).map(function(_, li) {
                    return (
                      <div key={li} style={{
                        width: '8px', height: '8px', borderRadius: '2px',
                        background: li < (emp.access_level ?? 1) ? '#C9A84C' : '#1E1E2E',
                      }} />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'

// ─── Уровни допуска ───────────────────────────────────────────
const ACCESS_LEVELS: Record<number, { code: string; label: string; color: string; desc: string }> = {
  1: { code: 'У1', label: 'Базовый',              color: '#6B7280', desc: 'Офисы, административные помещения' },
  2: { code: 'У2', label: 'Объектный',             color: '#4ADE80', desc: 'Стройплощадки, складские зоны' },
  3: { code: 'У3', label: 'Технический',           color: '#5B8CFF', desc: 'Инженерные помещения, лаборатории' },
  4: { code: 'У4', label: 'Промышленный',          color: '#C9A84C', desc: 'Тяжёлая техника, энергоустановки' },
  5: { code: 'У5', label: 'Критический',           color: '#A78BFA', desc: 'ЦОД, системы управления объектами' },
  6: { code: 'У6', label: 'Специальный',           color: '#EF4444', desc: 'Арктические станции, спец. объекты' },
}

// ─── Подстатусы ───────────────────────────────────────────────
const SUBSTATUS_GROUPS: Record<string, { label: string; color: string; items: string[] }> = {
  working: {
    label: 'Рабочие', color: '#00D4AA',
    items: ['На смене','На объекте','Выполняет задачу','На маршруте','В командировке','На производстве','На строительном участке','На инспекции','На обходе территории','На дежурстве'],
  },
  project: {
    label: 'Проектные', color: '#5B8CFF',
    items: ['Назначен на объект','Ожидает назначения','Переведён на объект','Завершил проект','Участвует в запуске объекта','Участвует в испытаниях'],
  },
  training: {
    label: 'Обучение', color: '#E8C96B',
    items: ['Проходит инструктаж','Проходит обучение','Проходит аттестацию','Проходит медосмотр','Проверка документов','Проверка допуска'],
  },
  temporary: {
    label: 'Временные', color: '#A78BFA',
    items: ['Перерыв','Обеденный перерыв','Завершает смену','Ожидает транспорт','Ожидает допуска','Ожидает распоряжения'],
  },
  admin: {
    label: 'Административные', color: '#6B7280',
    items: ['Отпуск','Больничный','Выходной','Удалённая работа','В резерве','Архивный сотрудник'],
  },
  ai: {
    label: 'ИИ-мониторинг', color: '#EF4444',
    items: ['Потеря связи','Нет движения','Выход за маршрут','Выход за периметр','Вход в опасную зону','Неполный комплект СИЗ','Отсутствует каска','Обнаружено падение','SOS сигнал','Требуется эвакуация'],
  },
  restricted: {
    label: 'Ограничения', color: '#F97316',
    items: ['Допуск истёк','Доступ ограничен','Отстранён от работ','Нарушение ТБ','Заблокирован системой','Требуется проверка'],
  },
}

// Плоский словарь подстатус → цвет
const SUBSTATUS_COLOR: Record<string, string> = {}
Object.values(SUBSTATUS_GROUPS).forEach(function(g) {
  g.items.forEach(function(item) { SUBSTATUS_COLOR[item] = g.color })
})

// Основные статусы → цвет шапки таблицы
const MAIN_STATUS_COLOR: Record<string, string> = {
  on_site:    '#00D4AA',
  in_transit: '#5B8CFF',
  working:    '#C9A84C',
  in_office:  '#A78BFA',
  unavailable:'#6B7280',
}

const MAIN_STATUS_LABEL: Record<string, string> = {
  on_site:    'На объекте',
  in_transit: 'В пути',
  working:    'Работает',
  in_office:  'В офисе',
  unavailable:'Недоступен',
}

export const revalidate = 60

export default async function EmployeesPage() {
  const supabase = createClient()

  const { data: employees, count } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .order('full_name', { ascending: true })
    .limit(200)

  // Статистика
  const byStatus: Record<string, number> = {}
  const byAccess: Record<number, number> = {}
  employees?.forEach(function(e) {
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
    byAccess[e.access_level] = (byAccess[e.access_level] ?? 0) + 1
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <PageHeader
        title="СОТРУДНИКИ"
        subtitle={`${count?.toLocaleString('ru') ?? 0} сотрудников конгломерата`}
        crumbs={[{ label: 'Сотрудники' }]}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Статусы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {Object.entries(MAIN_STATUS_LABEL).map(function([key, label]) {
            const color = MAIN_STATUS_COLOR[key] ?? '#6B7280'
            return (
              <div key={key} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderTop: '2px solid ' + color, borderRadius: '8px', padding: '14px',
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: color }}>{byStatus[key] ?? 0}</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{label}</div>
              </div>
            )
          })}
        </div>

        {/* Уровни допуска */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>УРОВНИ ДОПУСКА</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {Object.entries(ACCESS_LEVELS).map(function([lvl, info]) {
              const num = byAccess[Number(lvl)] ?? 0
              return (
                <div key={lvl} style={{
                  background: '#0A0A0F', borderRadius: '6px', padding: '10px',
                  border: '1px solid ' + info.color + '33',
                  borderTop: '2px solid ' + info.color,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: info.color }}>{info.code}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: info.color }}>{num}</span>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px' }}>{info.label}</div>
                  <div style={{ fontSize: '9px', color: '#6B7280', lineHeight: 1.4 }}>{info.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Фильтры */}
        <div style={{
          background: '#12121A', border: '1px solid #1E1E2E',
          borderRadius: '8px', padding: '14px 16px',
          display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', flexShrink: 0 }}>ФИЛЬТРЫ:</div>

          {/* Поиск */}
          <input
            placeholder="Поиск по имени, фамилии..."
            style={{
              flex: '1 1 200px', padding: '7px 12px',
              background: '#0A0A0F', border: '1px solid #2A2A3E',
              borderRadius: '6px', color: '#E8E8F0', fontSize: '12px',
              outline: 'none', minWidth: '160px',
            }}
          />

          {/* По статусу */}
          <select style={{
            padding: '7px 12px', background: '#0A0A0F',
            border: '1px solid #2A2A3E', borderRadius: '6px',
            color: '#E8E8F0', fontSize: '11px', cursor: 'pointer',
          }}>
            <option value="">Все статусы</option>
            {Object.entries(MAIN_STATUS_LABEL).map(function([k, v]) {
              return <option key={k} value={k}>{v}</option>
            })}
          </select>

          {/* По допуску */}
          <select style={{
            padding: '7px 12px', background: '#0A0A0F',
            border: '1px solid #2A2A3E', borderRadius: '6px',
            color: '#E8E8F0', fontSize: '11px', cursor: 'pointer',
          }}>
            <option value="">Все уровни допуска</option>
            {Object.entries(ACCESS_LEVELS).map(function([lvl, info]) {
              return <option key={lvl} value={lvl}>{info.code} — {info.label}</option>
            })}
          </select>

          {/* По сортировке */}
          <select style={{
            padding: '7px 12px', background: '#0A0A0F',
            border: '1px solid #2A2A3E', borderRadius: '6px',
            color: '#E8E8F0', fontSize: '11px', cursor: 'pointer',
          }}>
            <option>Сортировка: по имени</option>
            <option>По дате зачисления</option>
            <option>По уровню допуска</option>
            <option>По статусу</option>
            <option>По должности</option>
          </select>
        </div>

        {/* Таблица */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>

          {/* Шапка */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
            padding: '10px 16px',
            background: '#0D0D14',
            borderBottom: '1px solid #1E1E2E',
          }}>
            {[
              { label: 'СОТРУДНИК',  color: '#E8E8F0' },
              { label: 'ДОЛЖНОСТЬ',  color: '#E8E8F0' },
              { label: 'СТАТУС',     color: '#00D4AA' },
              { label: 'ДОПУСК',     color: '#C9A84C' },
            ].map(function(h) {
              return (
                <div key={h.label} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: h.color }}>
                  {h.label}
                </div>
              )
            })}
          </div>

          {/* Строки */}
          {employees?.map(function(emp, i) {
            const mainColor = MAIN_STATUS_COLOR[emp.status] ?? '#6B7280'
            const mainLabel = MAIN_STATUS_LABEL[emp.status] ?? emp.status
            const accessInfo = ACCESS_LEVELS[emp.access_level ?? 1]

            // Имитируем подстатус на основе основного статуса
            const substatusMap: Record<string, string> = {
              on_site:    'На объекте',
              in_transit: 'На маршруте',
              working:    'Выполняет задачу',
              in_office:  'В офисе',
              unavailable:'В резерве',
            }
            const substatus = substatusMap[emp.status] ?? mainLabel
            const subColor = SUBSTATUS_COLOR[substatus] ?? mainColor

            return (
              <div
                key={emp.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  padding: '9px 16px',
                  borderBottom: i < employees.length - 1 ? '1px solid #1A1A2A' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  alignItems: 'center',
                }}
              >
                {/* Сотрудник */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: mainColor + '22', border: '1px solid ' + mainColor + '55',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: mainColor,
                  }}>
                    {emp.full_name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '12px', color: '#E8E8F0' }}>{emp.full_name}</span>
                </div>

                {/* Должность */}
                <div style={{ fontSize: '11px', color: '#B0B0C0' }}>
                  {emp.position ?? '—'}
                </div>

                {/* Статус + подстатус */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontSize: '9px', fontWeight: 700,
                    color: mainColor,
                    letterSpacing: '0.05em',
                  }}>
                    {mainLabel}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    color: subColor,
                  }}>
                    {substatus}
                  </span>
                </div>

                {/* Допуск */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 800,
                    color: accessInfo?.color ?? '#6B7280',
                    padding: '2px 8px',
                    background: (accessInfo?.color ?? '#6B7280') + '18',
                    border: '1px solid ' + (accessInfo?.color ?? '#6B7280') + '44',
                    borderRadius: '4px',
                  }}>
                    {accessInfo?.code ?? 'У1'}
                  </span>
                  <span style={{ fontSize: '9px', color: '#6B7280' }}>
                    {accessInfo?.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Легенда подстатусов */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>
            ЛЕГЕНДА ПОДСТАТУСОВ
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {Object.entries(SUBSTATUS_GROUPS).map(function([key, group]) {
              return (
                <div key={key}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: group.color, marginBottom: '6px', letterSpacing: '0.08em' }}>
                    {group.label.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {group.items.slice(0, 4).map(function(item) {
                      return (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>{item}</span>
                        </div>
                      )
                    })}
                    {group.items.length > 4 && (
                      <span style={{ fontSize: '9px', color: '#374151' }}>+{group.items.length - 4} ещё</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

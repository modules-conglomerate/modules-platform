import Link from 'next/link'

const DOC_CATEGORIES = [
  {
    icon: '🏗', label: 'Проектная документация', color: '#5B8CFF',
    docs: [
      { name: 'Генеральный план территории', type: 'PDF', size: '—' },
      { name: 'Мастер-план застройки',        type: 'PDF', size: '—' },
      { name: 'Архитектурные концепции',      type: 'PDF', size: '—' },
      { name: 'Планировки помещений',         type: 'DWG', size: '—' },
    ],
  },
  {
    icon: '⚙️', label: 'Инженерные схемы', color: '#C9A84C',
    docs: [
      { name: 'Схемы электроснабжения',   type: 'DWG', size: '—' },
      { name: 'Водоснабжение и канализация', type: 'DWG', size: '—' },
      { name: 'Вентиляция и кондиционирование', type: 'PDF', size: '—' },
      { name: 'Слаботочные системы',      type: 'PDF', size: '—' },
    ],
  },
  {
    icon: '🌿', label: 'Экологическая документация', color: '#4ADE80',
    docs: [
      { name: 'Отчёт по выбросам CO₂',         type: 'PDF', size: '—' },
      { name: 'Обращение с отходами',           type: 'PDF', size: '—' },
      { name: 'Мониторинг окружающей среды',    type: 'PDF', size: '—' },
      { name: 'Инженерные изыскания',           type: 'PDF', size: '—' },
    ],
  },
  {
    icon: '📊', label: 'Отчёты', color: '#A78BFA',
    docs: [
      { name: 'Ежеквартальный отчёт',    type: 'PDF', size: '—' },
      { name: 'Отчёт по строительству',  type: 'PDF', size: '—' },
      { name: 'Климатические данные',    type: 'XLSX', size: '—' },
      { name: 'Паспорта объектов',       type: 'PDF', size: '—' },
    ],
  },
  {
    icon: '🛡', label: 'Нормативы и допуски', color: '#E8C96B',
    docs: [
      { name: 'Регламент КПП',              type: 'PDF', size: '—' },
      { name: 'Инструкции по ТБ',           type: 'PDF', size: '—' },
      { name: 'Требования к СИЗ',           type: 'PDF', size: '—' },
      { name: 'Порядок выдачи допусков',    type: 'PDF', size: '—' },
    ],
  },
  {
    icon: '🔬', label: 'Научные материалы', color: '#38BDF8',
    docs: [
      { name: 'Отчёты наблюдений обсерватории', type: 'PDF', size: '—' },
      { name: 'Результаты испытаний',           type: 'PDF', size: '—' },
      { name: 'Исследовательские протоколы',    type: 'PDF', size: '—' },
      { name: 'Архив измерений',                type: 'CSV', size: '—' },
    ],
  },
]

export default function DocumentsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#374151', fontSize: '11px' }}>Главная</span>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Документы</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ДОКУМЕНТЫ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Открытая документация конгломерата · Доступна без регистрации
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Поиск */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#12121A', border: '1px solid #1E1E2E',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
        }}>
          <span style={{ fontSize: '16px', opacity: 0.4 }}>🔍</span>
          <input
            placeholder="Поиск документов..."
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: '#E8E8F0', fontSize: '14px', outline: 'none',
            }}
          />
          <span style={{ fontSize: '10px', color: '#374151' }}>
            Все документы в открытом доступе
          </span>
        </div>

        {/* Уведомление об открытости */}
        <div style={{
          background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: '8px', padding: '14px 18px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '18px' }}>🔓</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#00D4AA', marginBottom: '2px' }}>
              Принцип максимальной открытости
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              Конгломерат «Модули» публикует проектную, инженерную и экологическую документацию в открытом доступе.
              Регистрация не требуется.
            </div>
          </div>
        </div>

        {/* Категории документов */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {DOC_CATEGORIES.map(function(cat) {
            return (
              <div key={cat.label} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid #1E1E2E',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: cat.color + '08',
                }}>
                  <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: cat.color }}>{cat.label}</span>
                </div>
                <div style={{ padding: '8px' }}>
                  {cat.docs.map(function(doc) {
                    return (
                      <div key={doc.name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 10px', borderRadius: '6px',
                        border: '1px solid transparent',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            fontSize: '9px', fontWeight: 700, color: cat.color,
                            padding: '2px 6px', background: cat.color + '18',
                            borderRadius: '3px', flexShrink: 0,
                          }}>
                            {doc.type}
                          </span>
                          <span style={{ fontSize: '12px', color: '#B0B0C0' }}>{doc.name}</span>
                        </div>
                        <button style={{
                          padding: '4px 10px', background: 'transparent',
                          border: '1px solid #2A2A3E', borderRadius: '4px',
                          color: '#6B7280', fontSize: '10px', cursor: 'pointer',
                        }}>
                          Скачать
                        </button>
                      </div>
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

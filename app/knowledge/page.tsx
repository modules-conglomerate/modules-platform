export default function KnowledgePage() {
  const categories = [
    { icon: '📐', label: 'Инженерные решения',   count: 0, color: '#5B8CFF' },
    { icon: '🔬', label: 'Исследования',          count: 0, color: '#00D4AA' },
    { icon: '📋', label: 'Нормативы и стандарты', count: 0, color: '#C9A84C' },
    { icon: '🛠',  label: 'Инструкции',            count: 0, color: '#A78BFA' },
    { icon: '📊', label: 'Отчёты',                count: 0, color: '#4ADE80' },
    { icon: '🏗',  label: 'Проектные решения',     count: 0, color: '#E8C96B' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          БИБЛИОТЕКА ЗНАНИЙ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Единая инженерная библиотека конгломерата
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Поиск */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '8px', padding: '12px 16px',
          }}>
            <span style={{ fontSize: '16px', opacity: 0.4 }}>🔍</span>
            <input
              placeholder="Поиск по библиотеке знаний..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: '#E8E8F0', fontSize: '14px', outline: 'none',
              }}
            />
            <span style={{ fontSize: '10px', color: '#374151', letterSpacing: '0.1em' }}>
              ИИ-ПОИСК
            </span>
          </div>
        </div>

        {/* Категории */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {categories.map(function(cat) {
            return (
              <div key={cat.label} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', padding: '20px',
                display: 'flex', alignItems: 'center', gap: '14px',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: cat.color + '18', border: '1px solid ' + cat.color + '33',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    {cat.count > 0 ? cat.count + ' документов' : 'Скоро пополнится'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Заглушка пустой библиотеки */}
        <div style={{
          background: '#12121A', border: '1px solid #1E1E2E',
          borderRadius: '8px', padding: '48px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>📚</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Библиотека формируется
          </div>
          <div style={{ fontSize: '12px', color: '#374151', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
            Здесь будут храниться исследования, инструкции, нормативы и проектные решения конгломерата.
            Документы добавляются командой инженеров.
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button style={{
              padding: '10px 20px', background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
              color: '#C9A84C', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.08em', cursor: 'pointer',
            }}>
              + ЗАГРУЗИТЬ ДОКУМЕНТ
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
import Link from 'next/link'

const LINES = [
  {
    id:    'moduli-a',
    name:  'Модули A',
    desc:  'Базовая линейка автономных мобильных апартаментов. Для вахтового персонала и временного размещения на строительных объектах.',
    color: '#C9A84C',
    icon:  '⬡',
    specs: [
      { label: 'Площадь',       value: '18–36 м²' },
      { label: 'Автономность',  value: '72 часа' },
      { label: 'Температура',   value: 'до −55°C' },
      { label: 'Мощность',      value: '5 кВт' },
      { label: 'Вместимость',   value: '2–4 чел.' },
      { label: 'Развёртка',     value: '4 часа' },
    ],
    tags: ['Вахта', 'Арктика', 'Мобильный'],
    status: 'В серии',
  },
  {
    id:    'moduli-nord',
    name:  'Модули NORD',
    desc:  'Арктическая линейка для экстремальных условий. Усиленная теплоизоляция, автономные системы жизнеобеспечения, работа при −70°C.',
    color: '#5B8CFF',
    icon:  '❄',
    specs: [
      { label: 'Площадь',       value: '24–48 м²' },
      { label: 'Автономность',  value: '168 часов' },
      { label: 'Температура',   value: 'до −70°C' },
      { label: 'Мощность',      value: '12 кВт' },
      { label: 'Вместимость',   value: '2–6 чел.' },
      { label: 'Развёртка',     value: '6 часов' },
    ],
    tags: ['Арктика', 'Экстрим', 'Автономный'],
    status: 'В серии',
  },
  {
    id:    'moduli-camp',
    name:  'Модули CAMP',
    desc:  'Модульные лагеря для полевых экспедиций и геологоразведки. Быстрое развёртывание, системы на солнечных панелях.',
    color: '#4ADE80',
    icon:  '⛺',
    specs: [
      { label: 'Площадь',       value: '12–24 м²' },
      { label: 'Автономность',  value: '120 часов' },
      { label: 'Температура',   value: 'до −40°C' },
      { label: 'Мощность',      value: '3 кВт' },
      { label: 'Вместимость',   value: '1–3 чел.' },
      { label: 'Развёртка',     value: '2 часа' },
    ],
    tags: ['Экспедиция', 'Солнечный', 'Лёгкий'],
    status: 'В серии',
  },
  {
    id:    'moduli-hub',
    name:  'Модули HUB',
    desc:  'Командные центры и административные узлы. Конференц-залы, серверные, системы связи. Для управления крупными проектами.',
    color: '#A78BFA',
    icon:  '🔷',
    specs: [
      { label: 'Площадь',       value: '48–120 м²' },
      { label: 'Автономность',  value: '240 часов' },
      { label: 'Температура',   value: 'до −50°C' },
      { label: 'Мощность',      value: '25 кВт' },
      { label: 'Вместимость',   value: 'до 30 чел.' },
      { label: 'Развёртка',     value: '12 часов' },
    ],
    tags: ['Командный', 'Офис', 'Связь'],
    status: 'В серии',
  },
  {
    id:    'moduli-lab',
    name:  'Модули LAB',
    desc:  'Мобильные лаборатории для научных исследований. Специализированное оборудование, изолированные рабочие зоны, системы фильтрации.',
    color: '#00D4AA',
    icon:  '🔬',
    specs: [
      { label: 'Площадь',       value: '30–60 м²' },
      { label: 'Автономность',  value: '200 часов' },
      { label: 'Температура',   value: 'до −55°C' },
      { label: 'Мощность',      value: '18 кВт' },
      { label: 'Вместимость',   value: '2–8 чел.' },
      { label: 'Развёртка',     value: '8 часов' },
    ],
    tags: ['Лаборатория', 'Наука', 'Изоляция'],
    status: 'Разработка',
  },
]

export default function ProductsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПРОДУКЦИЯ МОДУЛИ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Автономные мобильные апартаменты · 5 линеек · Серийное производство
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Шапка */}
        <div style={{
          background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)',
          border: '1px solid #2A2A3E', borderRadius: '12px',
          padding: '28px', marginBottom: '24px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '10px' }}>
              ОСНОВНОЙ СЕРИЙНЫЙ ПРОДУКТ КОНГЛОМЕРАТА
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#C9A84C', margin: '0 0 10px', letterSpacing: '0.05em' }}>
              АВТОНОМНЫЕ МОБИЛЬНЫЕ АПАРТАМЕНТЫ
            </h2>
            <p style={{ fontSize: '13px', color: '#B0B0C0', margin: '0 0 16px', lineHeight: 1.7, maxWidth: '600px' }}>
              Модульные жилые и рабочие пространства для эксплуатации в экстремальных условиях.
              Производятся на Гигафабриках Модули. Полная автономность, быстрое развёртывание,
              арктическое исполнение.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Линеек',          value: '5' },
                { label: 'Произведено',     value: '1 240+' },
                { label: 'Стран поставки',  value: '12' },
                { label: 'Лет на рынке',    value: '8' },
              ].map(function(stat) {
                return (
                  <div key={stat.label}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#C9A84C' }}>{stat.value}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 80 80" width="80" height="80" style={{ opacity: 0.3 }}>
              <polygon points="40,5 70,22.5 70,57.5 40,75 10,57.5 10,22.5" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
              <polygon points="40,18 60,29 60,51 40,62 20,51 20,29" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="40" cy="40" r="8" fill="#C9A84C" opacity="0.6"/>
            </svg>
          </div>
        </div>

        {/* Линейки */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
          {LINES.map(function(line) {
            return (
              <div key={line.id} style={{
                background: '#12121A',
                border: '1px solid #1E1E2E',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                {/* Цветная шапка */}
                <div style={{
                  padding: '20px',
                  background: line.color + '0E',
                  borderBottom: '1px solid ' + line.color + '33',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '22px' }}>{line.icon}</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: line.color, letterSpacing: '0.08em' }}>
                        {line.name}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#B0B0C0', margin: 0, lineHeight: 1.6, maxWidth: '280px' }}>
                      {line.desc}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                    padding: '4px 10px', borderRadius: '20px',
                    background: line.status === 'В серии' ? '#00D4AA22' : '#C9A84C22',
                    color: line.status === 'В серии' ? '#00D4AA' : '#C9A84C',
                    border: '1px solid ' + (line.status === 'В серии' ? '#00D4AA44' : '#C9A84C44'),
                    flexShrink: 0,
                  }}>
                    {line.status.toUpperCase()}
                  </span>
                </div>

                {/* Характеристики */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '10px' }}>
                    ХАРАКТЕРИСТИКИ
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    {line.specs.map(function(spec) {
                      return (
                        <div key={spec.label} style={{
                          background: '#0A0A0F', borderRadius: '6px',
                          padding: '8px 10px', border: '1px solid #1E1E2E',
                        }}>
                          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '3px' }}>{spec.label}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: line.color }}>{spec.value}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Теги */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {line.tags.map(function(tag) {
                      return (
                        <span key={tag} style={{
                          fontSize: '9px', padding: '3px 8px',
                          border: '1px solid ' + line.color + '33',
                          borderRadius: '12px', color: line.color,
                          background: line.color + '0A',
                        }}>
                          {tag}
                        </span>
                      )
                    })}
                  </div>

                  {/* Кнопки */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={'/products/' + line.id}
                      style={{
                        flex: 1, padding: '9px', textAlign: 'center',
                        background: line.color + '18',
                        border: '1px solid ' + line.color + '44',
                        borderRadius: '6px', color: line.color,
                        fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.08em', textDecoration: 'none',
                      }}
                    >
                      ПОДРОБНЕЕ
                    </Link>
                    <button style={{
                      padding: '9px 14px', background: 'transparent',
                      border: '1px solid #1E1E2E', borderRadius: '6px',
                      color: '#6B7280', fontSize: '10px', cursor: 'pointer',
                    }}>
                      BIM
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
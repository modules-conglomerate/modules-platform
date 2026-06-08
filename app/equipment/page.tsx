import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const CAT_LABEL: Record<string, string> = {
  construction: 'Строительная',
  road:         'Дорожная',
  quarry:       'Карьерная',
  energy:       'Энергетическая',
  airfield:     'Аэродромная',
  service:      'Сервисная',
  experimental: 'Экспериментальная',
}

const CAT_COLOR: Record<string, string> = {
  construction: '#C9A84C',
  road:         '#5B8CFF',
  quarry:       '#E8C96B',
  energy:       '#00D4AA',
  airfield:     '#A78BFA',
  service:      '#4ADE80',
  experimental: '#EF4444',
}

const STATUS_LABEL: Record<string, string> = {
  working:     'Работает',
  on_site:     'На объекте',
  maintenance: 'На ТО',
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

  const byStatus: Record<string, number> = {}
  const byCat: Record<string, number> = {}
  const byModel: Record<string, any[]> = {}

  equipment?.forEach(function(e) {
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
    byCat[e.category]  = (byCat[e.category] ?? 0) + 1
    if (!byModel[e.model]) byModel[e.model] = []
    byModel[e.model].push(e)
  })

  const MODEL_IMAGES: Record<string, string> = {
    'Бульдозер МД-120':                 '/equipment/md-120.jpg',
    'Экскаватор МД-330':                '/equipment/md-330.jpg',
    'Карьерный самосвал МД-100Т':       '/equipment/md-100t.jpg',
    'Фронтальный погрузчик МД-80':      '/equipment/md-80.jpg',
    'Автогрейдер МД-200':               '/equipment/md-200.jpg',
    'Каток грунтовый МД-90':            '/equipment/md-90.jpg',
    'Автобетоносмеситель МД-9':         '/equipment/md-9.jpg',
    'Бетононасос МД-60':                '/equipment/md-60.jpg',
    'Башенный кран МДК-560':            '/equipment/mdk-560.jpg',
    'Мобильный кран МДК-120':           '/equipment/mdk-120.jpg',
    'Агрегат бурения МДБ-50':           '/equipment/mdb-50.jpg',
    'Сваебойная МДС-45':                '/equipment/mds-45.jpg',
    'Манипулятор МД-45':                '/equipment/md-45.jpg',
    'Телескопический погрузчик МДЛ-38': '/equipment/mdl-38.jpg',
    'Компрессорная станция МДК-20':     '/equipment/mdk-20.jpg',
    'Электростанция МДЭС-250':          '/equipment/mdes-250.jpg',
    'Мастерская на колёсах МДМ-01':     '/equipment/mdm-01.jpg',
    'Транспортёр гусеничный МДТ-15':    '/equipment/mdt-15.jpg',
  }

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Техника</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПАРК ТЕХНИКИ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Полная линейка спецтехники МД-серии · {count ?? 0} единиц
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Общее фото линейки */}
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #1E1E2E', position: 'relative', height: '200px' }}>
          <img
            src="/lineup-full.png"
            alt="Линейка техники МД"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 60%)',
            display: 'flex', alignItems: 'center', padding: '32px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.15em', marginBottom: '8px' }}>
                КОНГЛОМЕРАТ МОДУЛИ · ГИБРИД
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#E8E8F0', marginBottom: '6px' }}>
                ПОЛНАЯ ЛИНЕЙКА СПЕЦТЕХНИКИ
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', maxWidth: '500px' }}>
                Высокотехнологичная техника для строительства инфраструктуры и работы в экстремальных условиях
              </div>
            </div>
          </div>
        </div>

        {/* Статусы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {Object.entries(STATUS_LABEL).map(function([key, label]) {
            const color = STATUS_COLOR[key]
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

        {/* Категории */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(byCat).map(function([cat, num]) {
            const color = CAT_COLOR[cat] ?? '#6B7280'
            return (
              <div key={cat} style={{
                padding: '5px 12px', borderRadius: '20px',
                border: '1px solid ' + color + '44', background: color + '11',
                fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: color, fontWeight: 700 }}>{CAT_LABEL[cat] ?? cat}</span>
                <span style={{ color: '#6B7280' }}>{num} ед.</span>
              </div>
            )
          })}
        </div>

        {/* Карточки по моделям */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {Object.entries(byModel).map(function([model, units]) {
            const first = units[0]
            const color = CAT_COLOR[first.category] ?? '#6B7280'
            const activeCount = units.filter(function(u) {
              return u.status === 'working' || u.status === 'on_site'
            }).length
            const imgSrc = MODEL_IMAGES[model]

            return (
              <div key={model} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', overflow: 'hidden',
              }}>
                <div style={{ height: '130px', background: '#0A0A0F', position: 'relative', overflow: 'hidden' }}>
                  {imgSrc ? (
                    <img src={imgSrc} alt={model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                      <div style={{ fontSize: '32px', marginBottom: '6px' }}>🚜</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Фото загружается</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,18,26,0.95) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: color, padding: '2px 8px', background: '#0A0A0F', border: '1px solid ' + color + '55', borderRadius: '4px' }}>
                      {CAT_LABEL[first.category] ?? first.category}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', marginBottom: '3px' }}>{model}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '10px' }}>
                    {units.length} ед. · {activeCount} в работе
                  </div>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {units.map(function(unit) {
                      const sc = STATUS_COLOR[unit.status] ?? '#6B7280'
                      const sl = STATUS_LABEL[unit.status] ?? unit.status
                      return (
                        <div
                          key={unit.id}
                          title={`${unit.serial_number} — ${sl}`}
                          style={{
                            padding: '3px 8px', borderRadius: '4px',
                            background: sc + '18', border: '1px solid ' + sc + '44',
                            fontSize: '9px', fontWeight: 700, color: sc,
                            cursor: 'default',
                          }}
                        >
                          {unit.serial_number ?? '?'}
                        </div>
                      )
                    })}
                  </div>

                  <div style={{
                    padding: '8px 10px', background: '#0A0A0F',
                    border: '1px dashed #2A2A3E', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px' }}>📡</span>
                      <span style={{ fontSize: '10px', color: '#374151' }}>Телеметрия не подключена</span>
                    </div>
                    <Link href="/iot" style={{ fontSize: '10px', color: '#C9A84C', textDecoration: 'none' }}>
                      Подключить →
                    </Link>
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

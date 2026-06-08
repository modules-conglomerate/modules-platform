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

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Техника</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ПАРК ТЕХНИКИ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Полная линейка спецтехники МД-серии · {count} единиц
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Шапка с изображением линейки */}
        <div style={{
          background: '#12121A', border: '1px solid #1E1E2E',
          borderRadius: '8px', overflow: 'hidden',
        }}>
          <div style={{
            height: '200px', background: '#0A0A0F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <img
              src="/equipment/lineup-full.jpg"
              alt="Линейка техники МД"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              onError={function(e) {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.3) 50%, rgba(10,10,15,0.6) 100%)',
              display: 'flex', alignItems: 'center', padding: '24px',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.15em', marginBottom: '8px' }}>
                  КОНГЛОМЕРАТ МОДУЛИ · ГИБРИД
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#E8E8F0', marginBottom: '4px' }}>
                  ПОЛНАЯ ЛИНЕЙКА СПЕЦТЕХНИКИ
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Высокотехнологичная техника для строительства инфраструктуры,
                  промышленного производства и работы в экстремальных условиях
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статусы */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {Object.entries(STATUS_LABEL).map(function([key, label]) {
            const color = STATUS_COLOR[key] ?? '#6B7280'
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

        {/* По категориям */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(byCat).map(function([cat, num]) {
            const color = CAT_COLOR[cat] ?? '#6B7280'
            return (
              <div key={cat} style={{
                padding: '5px 12px', borderRadius: '20px',
                border: '1px solid ' + color + '44',
                background: color + '11', fontSize: '10px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: color, fontWeight: 700 }}>{CAT_LABEL[cat] ?? cat}</span>
                <span style={{ color: '#6B7280' }}>{num} ед.</span>
              </div>
            )
          })}
        </div>

        {/* Карточки по моделям */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {Object.entries(byModel).map(function([model, units]) {
            const firstUnit = units[0]
            const color = CAT_COLOR[firstUnit.category] ?? '#6B7280'
            const workingCount = units.filter(function(u) { return u.status === 'working' || u.status === 'on_site' }).length

            const modelSlug = model.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-zа-яё0-9\-]/gi, '')

            return (
              <div key={model} style={{
                background: '#12121A', border: '1px solid #1E1E2E',
                borderRadius: '8px', overflow: 'hidden',
              }}>
                {/* Фото модели */}
                <div style={{
                  height: '140px', background: '#0A0A0F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <img
                    src={`/equipment/${modelSlug}.jpg`}
                    alt={model}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={function(e) {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.display = 'none'
                      img.parentElement!.innerHTML += `
                        <div style="display:flex;flex-direction:column;align-items:center;opacity:0.2">
                          <div style="font-size:32px;margin-bottom:8px">🚜</div>
                          <div style="font-size:10px;color:#6B7280">Фото в разработке</div>
                        </div>
                      `
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(18,18,26,0.95) 0%, transparent 60%)',
                  }} />
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, color: color,
                      padding: '3px 8px', background: '#0A0A0F',
                      border: '1px solid ' + color + '44', borderRadius: '4px',
                    }}>
                      {CAT_LABEL[firstUnit.category] ?? firstUnit.category}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', marginBottom: '4px' }}>
                    {model}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>
                    {units.length} ед. · {workingCount} в работе
                  </div>

                  {/* Статус каждой единицы */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {units.map(function(unit) {
                      const sc = STATUS_COLOR[unit.status] ?? '#6B7280'
                      return (
                        <div key={unit.id} title={unit.serial_number ?? ''} style={{
                          padding: '3px 8px', borderRadius: '4px',
                          background: sc + '18', border: '1px solid ' + sc + '44',
                          fontSize: '9px', fontWeight: 700, color: sc,
                        }}>
                          {unit.serial_number?.split('-').pop() ?? '?'}
                        </div>
                      )
                    })}
                  </div>

                  {/* Датчики — заглушка */}
                  <div style={{
                    padding: '8px', background: '#0A0A0F',
                    border: '1px dashed #2A2A3E', borderRadius: '6px',
                    fontSize: '10px', color: '#374151',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span>📡</span>
                    <span>Телеметрия не подключена</span>
                    <Link href="/iot" style={{ color: '#C9A84C', textDecoration: 'none', marginLeft: 'auto' }}>
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

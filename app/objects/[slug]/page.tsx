import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

const STATUS_LABEL: Record<string, string> = {
  construction: 'Строится',
  active: 'Действует',
  planning: 'Проектируется',
  archived: 'Архив',
}

const STATUS_COLOR: Record<string, string> = {
  construction: '#C9A84C',
  active: '#00D4AA',
  planning: '#5B8CFF',
  archived: '#6B7280',
}

const TYPE_LABEL: Record<string, string> = {
  production: 'Производство',
  transport: 'Транспорт',
  science: 'Наука',
  residential: 'Жилая зона',
  entertainment: 'Развлечения',
  sport: 'Спорт',
  culture: 'Культура',
  infrastructure: 'Инфраструктура',
}

const EVENT_COLORS: Record<string, string> = {
  construction: '#C9A84C',
  delivery: '#E8C96B',
  research: '#5B8CFF',
  employee: '#A78BFA',
  documentation: '#6B7280',
  ecology: '#4ADE80',
  completion: '#00D4AA',
  announcement: '#C9A84C',
}

const EVENT_LABELS: Record<string, string> = {
  construction: 'Строительство',
  delivery: 'Поставка',
  research: 'Исследование',
  employee: 'Сотрудник',
  documentation: 'Документация',
  ecology: 'Экология',
  completion: 'Завершение',
  announcement: 'Объявление',
}

export default async function ObjectPage({ params }: Props) {
  const supabase = createClient()

  const { data: obj } = await supabase
    .from('objects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!obj) notFound()

  const { data: events } = await supabase
    .from('object_events')
    .select('*')
    .eq('object_id', obj.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const statusColor = STATUS_COLOR[obj.status] ?? '#6B7280'
  const statusLabel = STATUS_LABEL[obj.status] ?? obj.status
  const typeLabel = TYPE_LABEL[obj.type] ?? obj.type

  return (
   <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <div style={{ padding: '10px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
        <span style={{ color: '#1E1E2E', fontSize: '11px' }}>/</span>
        <Link href="/objects" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Объекты</Link>
        <span style={{ color: '#1E1E2E', fontSize: '11px' }}>/</span>
        <span style={{ color: '#C9A84C', fontSize: '11px' }}>{obj.name}</span>
      </div>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', background: statusColor + '22', color: statusColor, border: '1px solid ' + statusColor + '44' }}>
                {statusLabel.toUpperCase()}
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>{typeLabel}</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#E8E8F0' }}>{obj.name}</h1>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
              {obj.region}
              {obj.lat && obj.lng && (
                <span style={{ marginLeft: '10px', color: '#374151' }}>
                  {obj.lat.toFixed(4)}° с.ш. · {obj.lng.toFixed(4)}° в.д.
                </span>
              )}
            </p>
          </div>
          <Link href="/objects" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #1E1E2E', borderRadius: '6px', color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>
            ← Все объекты
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '280px', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #12121A 0%, #1E1E2E 50%, #12121A 100%)', border: '1px solid #1E1E2E', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', opacity: 0.25 }}>
                <svg viewBox="0 0 64 64" width="56" height="56">
                  <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                  <circle cx="32" cy="32" r="8" fill="#C9A84C"/>
                </svg>
                <div style={{ color: '#6B7280', fontSize: '10px', marginTop: '8px', letterSpacing: '0.1em' }}>ФОТО ОБЪЕКТА</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 12px', background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>Готовность</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: statusColor }}>{obj.progress_pct}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{ height: '4px', borderRadius: '2px', background: statusColor, width: obj.progress_pct + '%' }} />
                </div>
              </div>
            </div>
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>ЖУРНАЛ СОБЫТИЙ</div>
              {events && events.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {events.map(function(ev) {
                    const evColor = EVENT_COLORS[ev.event_type] ?? '#6B7280'
                    return (
                      <div key={ev.id} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #1E1E2E' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: evColor, flexShrink: 0, marginTop: '5px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: evColor }}>{(EVENT_LABELS[ev.event_type] ?? ev.event_type).toUpperCase()}</span>
                            <span style={{ fontSize: '9px', color: '#374151' }}>{new Date(ev.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#E8E8F0', marginBottom: '3px' }}>{ev.title}</div>
                          {ev.description && <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>{ev.description}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ color: '#374151', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Событий пока нет</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '14px' }}>ЦИФРОВОЙ ПАСПОРТ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Код', value: obj.slug.toUpperCase() },
                  { label: 'Тип', value: typeLabel },
                  { label: 'Статус', value: statusLabel, color: statusColor },
                  { label: 'Регион', value: obj.region ?? '—' },
                  { label: 'Площадь', value: obj.area_m2 ? obj.area_m2.toLocaleString('ru') + ' м²' : '—' },
                  { label: 'Готовность', value: obj.progress_pct + '%', color: statusColor },
                  { label: 'Срок сдачи', value: obj.deadline ? new Date(obj.deadline).toLocaleDateString('ru', { month: 'long', year: 'numeric' }) : 'Не указан' },
                  { label: 'Координаты', value: obj.lat && obj.lng ? obj.lat.toFixed(3) + ', ' + obj.lng.toFixed(3) : '—' },
                ].map(function(row) {
                  return (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>{row.label}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: row.color ?? '#E8E8F0', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>РАЗДЕЛЫ ОБЪЕКТА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { href: '/objects/' + obj.slug + '/eco',     label: 'Экологический паспорт', icon: '🌿' },
                  { href: '/objects/' + obj.slug + '/archive', label: 'Сезонный архив',         icon: '📷' },
                  { href: '/objects/' + obj.slug + '/live',    label: 'Трансляции 24/7',        icon: '📡' },
                  { href: '/objects/' + obj.slug + '/twin',    label: 'Цифровой двойник',       icon: '⬡' },
                ].map(function(item) {
                  return (
                    <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E1E2E', textDecoration: 'none', color: '#B0B0C0', fontSize: '12px' }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      <span style={{ marginLeft: 'auto', color: '#374151' }}>→</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>ДЕЙСТВИЯ</div>
              <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.04) 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '14px', marginBottom: '8px' }}>
                <div style={{ fontSize: '9px', color: '#C9A84C66', letterSpacing: '0.12em', marginBottom: '4px' }}>ИНВЕСТИЦИОННАЯ ПРОГРАММА</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#C9A84C', marginBottom: '4px' }}>Усилить развитие</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '10px', lineHeight: 1.5 }}>Поддержите объект через TON. Каждый вклад фиксируется в цифровом дневнике с полной разбивкой расходов.</div>
                <a href="https://t.me/modules_invest_bot" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '10px', background: '#C9A84C', color: '#0A0A0F', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', borderRadius: '6px', textAlign: 'center', textDecoration: 'none' }}>
                  ⬡ УСИЛИТЬ РАЗВИТИЕ
                </a>
              </div>
              <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #1E1E2E', borderRadius: '6px', color: '#6B7280', fontSize: '11px', cursor: 'pointer' }}>
                + ДОБАВИТЬ СОБЫТИЕ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

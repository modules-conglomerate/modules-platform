
import Link from 'next/link'

interface Event {
  id: string
  event_type: string
  title: string
  description: string | null
  media_url: string | null
  region: string | null
  created_at: string
  objects?: { name: string; slug: string } | null
}

const EVENT_LABELS: Record<string, string> = {
  construction:  'СТРОИТЕЛЬСТВО',
  delivery:      'ПОСТАВКА ТЕХНИКИ',
  research:      'ИССЛЕДОВАНИЕ',
  employee:      'СОТРУДНИК',
  documentation: 'ДОКУМЕНТАЦИЯ',
  ecology:       'ЭКОЛОГИЯ',
  completion:    'ЗАВЕРШЕНИЕ',
  announcement:  'ОБЪЯВЛЕНИЕ',
}

const EVENT_COLORS: Record<string, string> = {
  construction:  '#00D4AA',
  delivery:      '#C9A84C',
  research:      '#5B8CFF',
  employee:      '#A78BFA',
  documentation: '#6B7280',
  ecology:       '#4ADE80',
  completion:    '#00D4AA',
  announcement:  '#C9A84C',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  if (mins < 60) return `${mins} мин назад`
  if (hours < 24) return `${hours} ч назад`
  return 'Вчера'
}

export function EventsFeed({ events }: { events: Event[] }) {
  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em' }}>ЛЕНТА СОБЫТИЙ</h2>
        <Link href="/events" style={{ fontSize: '11px', color: '#6B7280', textDecoration: 'none' }}>
          Все события →
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {events.length === 0 && (
          <div style={{ color: '#6B7280', fontSize: '12px', padding: '20px 0' }}>
            Нет событий
          </div>
        )}
        {events.map(event => (
          <div
            key={event.id}
            style={{
              flexShrink: 0, width: '200px',
              background: '#0A0A0F', border: '1px solid #1E1E2E',
              borderRadius: '8px', overflow: 'hidden',
            }}
          >
            <div style={{
              height: '100px', background: 'linear-gradient(135deg, #1E1E2E 0%, #12121A 100%)',
              position: 'relative', display: 'flex', alignItems: 'flex-start',
              padding: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9px', color: '#6B7280' }}>
                  {timeAgo(event.created_at)}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: EVENT_COLORS[event.event_type] ?? '#6B7280' }}>
                  {EVENT_LABELS[event.event_type] ?? event.event_type.toUpperCase()}
                </span>
              </div>
            </div>
            <div style={{ padding: '10px' }}>
              {event.objects && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#C9A84C', marginBottom: '4px' }}>
                  {event.objects.name}
                </div>
              )}
              <p style={{ fontSize: '11px', color: '#E8E8F0', lineHeight: 1.4, marginBottom: '8px' }}>
                {event.title}
              </p>
              {event.region && (
                <div style={{ fontSize: '10px', color: '#6B7280' }}>{event.region} →</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const EVENT_LABELS: Record<string, string> = {
  construction:  'Строительство',
  delivery:      'Поставка техники',
  research:      'Исследование',
  employee:      'Сотрудник',
  documentation: 'Документация',
  ecology:       'Экология',
  completion:    'Завершение',
  announcement:  'Объявление',
}

const EVENT_COLORS: Record<string, string> = {
  construction:  '#C9A84C',
  delivery:      '#E8C96B',
  research:      '#5B8CFF',
  employee:      '#A78BFA',
  documentation: '#6B7280',
  ecology:       '#4ADE80',
  completion:    '#00D4AA',
  announcement:  '#C9A84C',
}

export const revalidate = 30

export default async function EventsPage() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('object_events')
    .select('*, objects(name, slug, region)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)

  const grouped: Record<string, typeof events> = {}
  events?.forEach(function(ev) {
    const date = new Date(ev.created_at).toLocaleDateString('ru', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    if (!grouped[date]) grouped[date] = []
    grouped[date]!.push(ev)
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ЛЕНТА СОБЫТИЙ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Все события конгломерата в реальном времени · {events?.length ?? 0} записей
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Фильтры по типу */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {Object.entries(EVENT_LABELS).map(function([key, label]) {
            const color = EVENT_COLORS[key] ?? '#6B7280'
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '20px',
                border: '1px solid ' + color + '44',
                background: color + '11',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '10px', color: color, fontWeight: 600 }}>{label}</span>
              </div>
            )
          })}
        </div>

        {/* Таймлайн событий по датам */}
        {Object.entries(grouped).map(function([date, dayEvents]) {
          return (
            <div key={date} style={{ marginBottom: '32px' }}>

              {/* Дата */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#C9A84C', letterSpacing: '0.1em' }}>
                  {date.toUpperCase()}
                </span>
                <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
              </div>

              {/* События дня */}
              <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dayEvents?.map(function(ev) {
                  const color = EVENT_COLORS[ev.event_type] ?? '#6B7280'
                  const label = EVENT_LABELS[ev.event_type] ?? ev.event_type
                  const time = new Date(ev.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })

                  return (
                    <div key={ev.id} style={{
                      background: '#12121A', border: '1px solid #1E1E2E',
                      borderLeft: '3px solid ' + color,
                      borderRadius: '0 8px 8px 0', padding: '14px 16px',
                      display: 'flex', gap: '16px',
                    }}>
                      {/* Время */}
                      <div style={{ flexShrink: 0, width: '40px' }}>
                        <div style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>{time}</div>
                      </div>

                      {/* Контент */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                            color: color, padding: '2px 8px',
                            background: color + '18', borderRadius: '3px',
                          }}>
                            {label.toUpperCase()}
                          </span>
                          {ev.objects && (
                            <Link href={'/objects/' + ev.objects.slug} style={{
                              fontSize: '10px', color: '#C9A84C',
                              textDecoration: 'none', fontWeight: 600,
                            }}>
                              {ev.objects.name}
                            </Link>
                          )}
                          {(ev.region ?? ev.objects?.region) && (
                            <span style={{ fontSize: '10px', color: '#374151' }}>
                              {ev.region ?? ev.objects?.region}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '13px', color: '#E8E8F0', fontWeight: 500, marginBottom: '4px' }}>
                          {ev.title}
                        </div>

                        {ev.description && (
                          <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                            {ev.description}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {(!events || events.length === 0) && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#374151' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>◈</div>
            <div style={{ fontSize: '13px' }}>Событий пока нет</div>
          </div>
        )}
      </div>
    </div>
  )
}

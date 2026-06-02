
import type { ObjectEvent, EventType } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const eventLabels: Record<EventType, string> = {
  construction:  'СТРОИТЕЛЬСТВО',
  delivery:      'ПОСТАВКА ТЕХНИКИ',
  research:      'ИССЛЕДОВАНИЕ',
  employee:      'СОТРУДНИК',
  documentation: 'ДОКУМЕНТАЦИЯ',
  ecology:       'ЭКОЛОГИЯ',
  completion:    'ЗАВЕРШЕНИЕ',
  announcement:  'ОБЪЯВЛЕНИЕ',
}

const eventColors: Record<EventType, string> = {
  construction:  'text-moduli-teal',
  delivery:      'text-moduli-gold',
  research:      'text-moduli-blue',
  employee:      'text-purple-400',
  documentation: 'text-gray-400',
  ecology:       'text-green-400',
  completion:    'text-moduli-teal',
  announcement:  'text-moduli-gold',
}

function timeAgo(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ru })
}

interface Props { events: ObjectEvent[] }

export function EventsFeed({ events }: Props) {
  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider">ЛЕНТА СОБЫТИЙ</h2>
        <Link href="/events" className="flex items-center gap-1 text-[11px] text-moduli-muted hover:text-moduli-gold transition-colors">
          Все события <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {events.map(event => (
          <div
            key={event.id}
            className="flex-shrink-0 w-52 bg-moduli-bg border border-moduli-border rounded-lg overflow-hidden hover:border-moduli-gold/40 transition-colors"
          >
            {/* Картинка-заглушка */}
            <div className="h-28 bg-gradient-to-br from-moduli-border to-moduli-bg relative">
              {event.media_url && (
                <img src={event.media_url} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-moduli-bg/80 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="text-[9px] text-moduli-muted">
                  {timeAgo(event.created_at)}
                </span>
                <span className={`text-[9px] font-bold ${eventColors[event.event_type]}`}>
                  {eventLabels[event.event_type]}
                </span>
              </div>
            </div>

            <div className="p-2.5">
              {event.objects && (
                <div className="text-[10px] font-semibold text-moduli-gold mb-1 truncate">
                  {event.objects.name}
                </div>
              )}
              <p className="text-[11px] text-moduli-text line-clamp-2 mb-2">
                {event.title}
              </p>
              {event.region && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-moduli-muted truncate">{event.region}</span>
                  <ArrowRight size={10} className="text-moduli-muted flex-shrink-0" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

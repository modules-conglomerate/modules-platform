
import type { ModuliObject } from '@/lib/types'
import Link from 'next/link'

const statusLabel = {
  construction: { text: 'Строится',     color: 'text-moduli-gold',  bar: '#C9A84C' },
  active:       { text: 'Действует',    color: 'text-moduli-teal',  bar: '#00D4AA' },
  planning:     { text: 'Проектируется',color: 'text-moduli-blue',  bar: '#5B8CFF' },
  archived:     { text: 'Архив',        color: 'text-moduli-muted', bar: '#6B7280' },
}

interface Props { objects: ModuliObject[] }

export function ProjectsStatus({ objects }: Props) {
  const active = objects.filter(o => o.status !== 'archived').slice(0, 5)

  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider">СТАТУС ПРОЕКТОВ</h2>
        <Link href="/objects" className="text-[11px] text-moduli-muted hover:text-moduli-gold transition-colors">
          Все проекты ↓
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {active.map(obj => {
          const s = statusLabel[obj.status]
          return (
            <Link
              key={obj.id}
              href={`/objects/${obj.slug}`}
              className="bg-moduli-bg border border-moduli-border rounded-lg p-3 hover:border-moduli-gold/40 transition-colors group"
            >
              <div className="text-[11px] font-semibold text-moduli-text group-hover:text-moduli-gold transition-colors mb-0.5 leading-tight">
                {obj.name}
              </div>
              <div className="text-[10px] text-moduli-muted mb-3">{obj.region}</div>

              {/* Прогресс бар */}
              <div className="mb-1">
                <div className="text-lg font-bold" style={{ color: s.bar }}>
                  {obj.progress_pct}%
                </div>
              </div>
              <div className="w-full h-1 bg-moduli-border rounded-full mb-2">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${obj.progress_pct}%`, background: s.bar }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold ${s.color}`}>{s.text}</span>
                {obj.deadline && (
                  <span className="text-[9px] text-moduli-muted">
                    Сдача: {new Date(obj.deadline).toLocaleDateString('ru', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

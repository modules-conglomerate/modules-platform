
'use client'

import { useState } from 'react'
import type { ModuliObject } from '@/lib/types'

const filters = [
  { key: 'all',          label: 'ВСЕ ОБЪЕКТЫ' },
  { key: 'construction', label: 'СТРОЯТСЯ' },
  { key: 'active',       label: 'ДЕЙСТВУЮЩИЕ' },
  { key: 'planning',     label: 'ПРОЕКТИРУЮТСЯ' },
]

const statusLabel: Record<string, string> = {
  construction: 'Строится',
  active:       'Действует',
  planning:     'Проектируется',
  archived:     'Архив',
}

interface Props {
  objects: ModuliObject[]
}

export function MapSection({ objects }: Props) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<ModuliObject | null>(null)

  const filtered = filter === 'all'
    ? objects
    : objects.filter(o => o.status === filter)

  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg overflow-hidden">

      {/* Заголовок + фильтры */}
      <div className="flex items-center justify-between p-4 border-b border-moduli-border">
        <div>
          <h1 className="text-base font-semibold tracking-wider">КАРТА ОБЪЕКТОВ</h1>
          <p className="text-[10px] text-moduli-muted mt-0.5">ИНТЕРАКТИВНАЯ КАРТА ЭКОСИСТЕМЫ</p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                filter === f.key
                  ? 'px-3 py-1.5 text-[10px] font-bold tracking-wider rounded bg-moduli-gold text-moduli-bg'
                  : 'px-3 py-1.5 text-[10px] font-bold tracking-wider rounded text-moduli-muted border border-moduli-border'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Область карты */}
      <div className="relative h-96 bg-moduli-bg">

        {/* Временная заглушка карты — MapClient подключим следующим шагом */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <svg viewBox="0 0 48 48" width="48" height="48" className="mx-auto mb-3 opacity-30">
              <polygon
                points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
                fill="none" stroke="#C9A84C" strokeWidth="1.5"
              />
              <circle cx="24" cy="24" r="5" fill="#C9A84C" />
            </svg>
            <p className="text-moduli-muted text-xs tracking-wider">
              КАРТА ОБЪЕКТОВ — {filtered.length} объектов
            </p>
          </div>
        </div>

        {/* Попап выбранного объекта */}
        {selected && (
          <div className="absolute top-4 right-4 w-56 bg-moduli-bg border border-moduli-gold rounded-lg p-3">
            <div className="text-[9px] text-moduli-muted mb-1">ВЫБРАННЫЙ ОБЪЕКТ</div>
            <div className="text-sm font-bold text-moduli-gold mb-1">{selected.name}</div>
            <div className="text-[10px] text-moduli-muted mb-1">{selected.region}</div>
            <div className="text-[10px] mb-1">
              {'Статус: '}
              <span className="text-moduli-teal">
                {statusLabel[selected.status] ?? selected.status}
              </span>
            </div>
            <div className="text-[10px] mb-2">
              {'Готовность: '}
              <span className="font-bold">{selected.progress_pct}%</span>
            </div>
            <div className="w-full h-1 bg-moduli-border rounded-full mb-3">
              <div
                className="h-1 rounded-full bg-moduli-gold"
                style={{ width: `${selected.progress_pct}%` }}
              />
            </div>
            <button
              onClick={() => window.location.href = `/objects/${selected.slug}`}
              className="block w-full text-center py-1.5 bg-moduli-gold text-moduli-bg text-[10px] font-bold tracking-wider rounded"
            >
              ОТКРЫТЬ ДНЕВНИК ОБЪЕКТА
            </button>
          </div>
        )}
      </div>
    </div>


'use client'

import { useState } from 'react'
import { MapClient } from './MapClient'
import type { ModuliObject } from '@/lib/types'

const filters = [
  { key: 'all',          label: 'ВСЕ ОБЪЕКТЫ' },
  { key: 'construction', label: 'СТРОЯТСЯ' },
  { key: 'active',       label: 'ДЕЙСТВУЮЩИЕ' },
  { key: 'planning',     label: 'ПРОЕКТИРУЮТСЯ' },
]

interface Props { objects: ModuliObject[] }

export function MapSection({ objects }: Props) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<ModuliObject | null>(null)

  const filtered = filter === 'all'
    ? objects
    : objects.filter(o => o.status === filter)

  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg overflow-hidden">
      {/* Заголовок */}
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
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider rounded transition-all ${
                filter === f.key
                  ? 'bg-moduli-gold text-moduli-bg'
                  : 'text-moduli-muted border border-moduli-border hover:border-moduli-gold/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Карта */}
      <div className="relative h-96">
        <MapClient objects={filtered} onSelect={setSelected} />

        {/* Попап выбранного объекта */}
        {selected && (
          <div className="absolute top-4 right-4 w-56 bg-moduli-bg/95 border border-moduli-gold/40 rounded-lg p-3 backdrop-blur">
            <div className="text-[9px] text-moduli-muted mb-1">ВЫБРАННЫЙ ОБЪЕКТ</div>
            <div className="text-sm font-bold text-moduli-gold mb-1">{selected.name}</div>
            <div className="text-[10px] text-moduli-muted mb-1">{selected.region}</div>
            <div className="text-[10px] mb-1">
              Статус: <span className="text-moduli-teal">{selected.status === 'construction' ? 'Строится' : 'Действует'}</span>
            </div>
            <div className="text-[10px] mb-2">
              Готовность: <span className="font-bold">{selected.progress_pct}%</span>
            </div>
            <div className="w-full h-1 bg-moduli-border rounded-full mb-3">
              <div className="h-1 rounded-full bg-moduli-gold" style={{ width: `${selected.progress_pct}%` }} />
            </div>
            
              href={`/objects/${selected.slug}`}
              className="block w-full text-center py-1.5 bg-moduli-gold text-moduli-bg text-[10px] font-bold tracking-wider rounded hover:bg-moduli-gold-2 transition-colors"
            >
              ОТКРЫТЬ ДНЕВНИК ОБЪЕКТА
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

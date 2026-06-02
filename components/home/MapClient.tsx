'use client'

import { useState } from 'react'
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
      <div className="h-96 flex items-center justify-center bg-moduli-bg">
        <p className="text-moduli-muted text-sm">Карта загружается... ({filtered.length} объектов)</p>
      </div>
    </div>
  )
}

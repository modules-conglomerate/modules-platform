
'use client'

import { useState } from 'react'
import type { ModuliObject } from '@/lib/types'

interface Props {
  objects: ModuliObject[]
}

export function MapSection({ objects }: Props) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? objects
    : objects.filter(function(o) { return o.status === filter })

  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-moduli-border">
        <div>
          <h1 className="text-base font-semibold tracking-wider">КАРТА ОБЪЕКТОВ</h1>
          <p className="text-[10px] text-moduli-muted mt-0.5">ИНТЕРАКТИВНАЯ КАРТА ЭКОСИСТЕМЫ</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={function() { setFilter('all') }}
            className={filter === 'all' ? 'px-3 py-1.5 text-[10px] font-bold rounded bg-moduli-gold text-moduli-bg' : 'px-3 py-1.5 text-[10px] font-bold rounded text-moduli-muted border border-moduli-border'}
          >
            ВСЕ ОБЪЕКТЫ
          </button>
          <button
            onClick={function() { setFilter('construction') }}
            className={filter === 'construction' ? 'px-3 py-1.5 text-[10px] font-bold rounded bg-moduli-gold text-moduli-bg' : 'px-3 py-1.5 text-[10px] font-bold rounded text-moduli-muted border border-moduli-border'}
          >
            СТРОЯТСЯ
          </button>
          <button
            onClick={function() { setFilter('active') }}
            className={filter === 'active' ? 'px-3 py-1.5 text-[10px] font-bold rounded bg-moduli-gold text-moduli-bg' : 'px-3 py-1.5 text-[10px] font-bold rounded text-moduli-muted border border-moduli-border'}
          >
            ДЕЙСТВУЮЩИЕ
          </button>
          <button
            onClick={function() { setFilter('planning') }}
            className={filter === 'planning' ? 'px-3 py-1.5 text-[10px] font-bold rounded bg-moduli-gold text-moduli-bg' : 'px-3 py-1.5 text-[10px] font-bold rounded text-moduli-muted border border-moduli-border'}
          >
            ПРОЕКТИРУЮТСЯ
          </button>
        </div>
      </div>
      <div className="h-96 bg-moduli-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-moduli-muted text-xs tracking-wider mb-2">
            КАРТА ОБЪЕКТОВ
          </div>
          <div className="text-moduli-gold text-2xl font-bold">
            {filtered.length}
          </div>
          <div className="text-moduli-muted text-xs">
            объектов
          </div>
        </div>
      </div>
    </div>
  )
}

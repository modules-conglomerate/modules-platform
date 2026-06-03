'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const MapClient = dynamic(
  () => import('./MapClient').then(function(m) { return m.MapClient }),
  { ssr: false }
)

interface MapObject {
  id: string
  name: string
  slug: string
  status: string
  region: string | null
  progress_pct: number
  lat: number | null
  lng: number | null
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

const MIN_H = 280
const MAX_H = 720
const DEFAULT_H = 420

interface Props {
  objects: MapObject[]
}

export function MapSection({ objects }: Props) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<MapObject | null>(null)
  const [mapHeight, setMapHeight] = useState(DEFAULT_H)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startH = useRef(DEFAULT_H)

  const filtered = filter === 'all'
    ? objects
    : objects.filter(function(o) { return o.status === filter })

  const handleSelect = useCallback(function(obj: MapObject) {
    setSelected(obj)
  }, [])

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    startY.current = e.clientY
    startH.current = mapHeight

    function onMove(ev: MouseEvent) {
      if (!isDragging.current) return
      const delta = ev.clientY - startY.current
      const newH = Math.min(MAX_H, Math.max(MIN_H, startH.current + delta))
      setMapHeight(newH)
    }

    function onUp() {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const selColor = selected ? (STATUS_COLOR[selected.status] ?? '#6B7280') : '#C9A84C'

  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #1E1E2E' }}>
        <div>
          <h1 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', margin: 0 }}>КАРТА ОБЪЕКТОВ</h1>
          <p style={{ fontSize: '10px', color: '#6B7280', margin: '2px 0 0' }}>ИНТЕРАКТИВНАЯ КАРТА ЭКОСИСТЕМЫ</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'construction', 'active', 'planning'].map(function(key) {
            const labels: Record<string, string> = { all: 'ВСЕ ОБЪЕКТЫ', construction: 'СТРОЯТСЯ', active: 'ДЕЙСТВУЮЩИЕ', planning: 'ПРОЕКТИРУЮТСЯ' }
            return (
              <button
                key={key}
                onClick={function() { setFilter(key) }}
                style={{
                  padding: '6px 12px', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.08em', borderRadius: '4px', cursor: 'pointer',
                  border: filter === key ? 'none' : '1px solid #1E1E2E',
                  background: filter === key ? '#C9A84C' : 'transparent',
                  color: filter === key ? '#0A0A0F' : '#6B7280',
                }}
              >
                {labels[key]}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ position: 'relative', height: mapHeight + 'px' }}>
        <MapClient objects={filtered} onSelect={handleSelect} />

        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(10,10,15,0.85)', border: '1px solid #1E1E2E', borderRadius: '6px', padding: '6px 10px' }}>
          <span style={{ fontSize: '10px', color: '#C9A84C', fontWeight: 700 }}>{filtered.length}</span>
          <span style={{ fontSize: '10px', color: '#6B7280' }}> объектов</span>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(10,10,15,0.85)', border: '1px solid #1E1E2E', borderRadius: '6px', padding: '8px 12px', display: 'flex', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C9A84C' }} />
            <span style={{ fontSize: '9px', color: '#6B7280' }}>Строится</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00D4AA' }} />
            <span style={{ fontSize: '9px', color: '#6B7280' }}>Действует</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#5B8CFF' }} />
            <span style={{ fontSize: '9px', color: '#6B7280' }}>Проектируется</span>
          </div>
        </div>

        {selected && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '220px', background: 'rgba(10,10,15,0.95)', border: '1px solid ' + selColor + '55', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '6px' }}>ВЫБРАННЫЙ ОБЪЕКТ</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: selColor, marginBottom: '4px', lineHeight: 1.3 }}>{selected.name}</div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '10px' }}>{selected.region}</div>
            <div style={{ fontSize: '10px', marginBottom: '3px' }}>
              {'Статус: '}
              <span style={{ color: selColor, fontWeight: 600 }}>{STATUS_LABEL[selected.status]}</span>
            </div>
            <div style={{ fontSize: '10px', marginBottom: '8px' }}>
              {'Готовность: '}
              <span style={{ fontWeight: 700 }}>{selected.progress_pct}%</span>
            </div>
            <div style={{ width: '100%', height: '3px', background: '#1E1E2E', borderRadius: '2px', marginBottom: '12px' }}>
              <div style={{ height: '3px', borderRadius: '2px', background: selColor, width: selected.progress_pct + '%' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={function() { window.location.href = '/objects/' + selected.slug }}
                style={{ flex: 1, padding: '8px', background: selColor, color: '#0A0A0F', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ОТКРЫТЬ ДНЕВНИК
              </button>
              <button
                onClick={function() { setSelected(null) }}
                style={{ padding: '8px 10px', background: 'transparent', color: '#6B7280', border: '1px solid #1E1E2E', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        onMouseDown={onMouseDown}
        style={{ height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14', borderTop: '1px solid #1E1E2E', cursor: 'ns-resize', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.35 }}>
          <div style={{ width: '28px', height: '1px', background: '#6B7280' }} />
          <div style={{ width: '28px', height: '1px', background: '#6B7280' }} />
        </div>
      </div>

    </div>
  )
}

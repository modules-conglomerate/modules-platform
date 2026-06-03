'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const MapClient = dynamic(
  () => import('./MapClient').then(m => m.MapClient),
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
  active:       'Действует',
  planning:     'Проектируется',
  archived:     'Архив',
}

const STATUS_COLOR: Record<string, string> = {
  construction: '#C9A84C',
  active:       '#00D4AA',
  planning:     '#5B8CFF',
  archived:     '#6B7280',
}

const FILTERS = [
  { key: 'all',          label: 'ВСЕ ОБЪЕКТЫ' },
  { key: 'construction', label: 'СТРОЯТСЯ' },
  { key: 'active',       label: 'ДЕЙСТВУЮЩИЕ' },
  { key: 'planning',     label: 'ПРОЕКТИРУЮТСЯ' },
]

const MIN_H = 280
const MAX_H = 720
const DEFAULT_H = 420

interface Props { objects: MapObject[] }

export function MapSection({ objects }: Props) {
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState<MapObject | null>(null)
  const [mapHeight, setMapHeight] = useState(DEFAULT_H)
  const isDragging = useRef(false)
  const startY     = useRef(0)
  const startH     = useRef(DEFAULT_H)

  const filtered = filter === 'all'
    ? objects
    : objects.filter(o => o.status === filter)

  const handleSelect = useCallback((obj: MapObject) => setSelected(obj), [])

  // Drag-to-resize
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startY.current = e.clientY
    startH.current = mapHeight

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return
      const delta = ev.clientY - startY.current
      const newH = Math.min(MAX_H, Math.max(MIN_H, startH.current + delta))
      setMapHeight(newH)
    }
    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div style={{
      background: '#12121A',
      border: '1px solid #1E1E2E',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>

      {/* Заголовок + фильтры */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid #1E1E2E',
      }}>
        <div>
          <h1 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', margin: 0 }}>
            КАРТА ОБЪЕКТОВ
          </h1>
          <p style={{ fontSize: '10px', color: '#6B7280', margin: '2px 0 0' }}>
            ИНТЕРАКТИВНАЯ КАРТА ЭКОСИСТЕМЫ
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '6px 12px', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.08em', borderRadius: '4px', cursor: 'pointer',
                border: filter === f.key ? 'none' : '1px solid #1E1E2E',
                background: filter === f.key ? '#C9A84C' : 'transparent',
                color: filter === f.key ? '#0A0A0F' : '#6B7280',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Карта */}
      <div style={{ position: 'relative', height: `${mapHeight}px`, transition: isDragging.current ? 'none' : 'height 0.1s' }}>
        <MapClient objects={filtered} onSelect={handleSelect} />

        {/* Попап выбранного объекта */}
        {selected && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px', width: '220px',
            background: 'rgba(10,10,15,0.95)',
            border: `1px solid ${STATUS_COLOR[selected.status]}55`,
            borderRadius: '8px', padding: '14px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 24px ${STATUS_COLOR[selected.status]}22`,
          }}>
            <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '6px' }}>
              ВЫБРАННЫЙ ОБЪЕКТ
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: STATUS_COLOR[selected.status], marginBottom: '4px', lineHeight: 1.3 }}>
              {selected.name}
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '10px' }}>
              {selected.region}
            </div>
            <div style={{ fontSize: '10px', marginBottom: '3px' }}>
              Статус:{' '}
              <span style={{ color: STATUS_COLOR[selected.status], fontWeight: 600 }}>
                {STATUS_LABEL[selected.status]}
              </span>
            </div>
            <div style={{ fontSize: '10px', marginBottom: '8px' }}>
              Готовность:{' '}
              <span style={{ fontWeight: 700 }}>{selected.progress_pct}%</span>
            </div>
            <div style={{ width: '100%', height: '3px', background: '#1E1E2E', borderRadius: '2px', marginBottom: '12px' }}>
              <div style={{
                height: '3px', borderRadius: '2px',
                background: STATUS_COLOR[selected.status],
                width: `${selected.progress_pct}%`,
              }} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => { window.location.href = `/objects/${selected.slug}` }}
                style={{
                  flex: 1, padding: '8px',
                  background: STATUS_COLOR[selected.status],
                  color: '#0A0A0F', fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.08em', border: 'none',
                  borderRadius: '4px', cursor: 'pointer',
                }}
              >
                ОТКРЫТЬ ДНЕВНИК
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{
                  padding: '8px 10px', background: 'transparent',
                  color: '#6B7280', border: '1px solid #1E1E2E',
                  borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Легенда */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'rgba(10,10,15,0.85)', border: '1px solid #1E1E2E',
          borderRadius: '6px', padding: '8px 12px',
          display: 'flex', gap: '14px',
        }}>
          {[
            { key: 'construction', label: 'Строится' },
            { key: 'active',       label: 'Действует' },
            { key: 'planning',     label: 'Проектируется' },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLOR[key] }} />
              <span style={{ fontSize: '9px', color: '#6B7280' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Счётчик объектов */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(10,10,15,0.85)', bord

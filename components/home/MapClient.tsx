
'use client'

import { useEffect, useRef, useState } from 'react'

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

const COLORS: Record<string, string> = {
  construction: '#C9A84C',
  active:       '#00D4AA',
  planning:     '#5B8CFF',
  archived:     '#6B7280',
}

interface Props {
  objects: MapObject[]
  onSelect: (obj: MapObject) => void
}

export function MapClient({ objects, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const mlRef        = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    import('maplibre-gl').then(ml => {
      if (cancelled || !containerRef.current || mapRef.current) return
      mlRef.current = ml

      const key = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ''
      const map = new ml.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`,
        center: [55, 65] as [number, number],
        zoom: 2.8,
        attributionControl: false,
      })

      map.on('load', () => { if (!cancelled) setReady(true) })
      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || !mlRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    objects.forEach(obj => {
      if (!obj.lat || !obj.lng) return
      const color = COLORS[obj.status] ?? '#6B7280'

      const el = document.createElement('div')
      el.style.cssText = 'position:relative;width:32px;height:32px;cursor:pointer;'
      el.innerHTML = `
        <div style="
          position:absolute;inset:2px;border-radius:50%;
          background:${color};opacity:0.2;
          animation:ping-gold 2s ease-in-out infinite;
        "></div>
        <svg viewBox="0 0 32 32" width="32" height="32" style="position:relative;z-index:1;filter:drop-shadow(0 0 4px ${color}88)">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9"
            fill="rgba(10,10,15,0.9)" stroke="${color}" stroke-width="1.5"/>
          <circle cx="16" cy="16" r="4" fill="${color}"/>
        </svg>
      `

      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)'; el.style.transition = 'transform 0.15s' })
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
      el.addEventListener('click', () => onSelect(obj))

      const marker = new mlRef.current.Marker({ element: el })
        .setLngLat([obj.lng, obj.lat])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [ready, objects, onSelect])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#0A0A0F', flexDirection: 'column', gap: '8px',
        }}>
          <svg viewBox="0 0 48 48" width="36" height="36" style={{ opacity: 0.4 }}>
            <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
              fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
            <circle cx="24" cy="24" r="5" fill="#C9A84C"/>
          </svg>
          <span style={{ color: '#6B7280', fontSize: '11px', letterSpacing: '0.1em' }}>
            ЗАГРУЗКА КАРТЫ...
          </span>
        </div>
      )}
    </div>
  )
}

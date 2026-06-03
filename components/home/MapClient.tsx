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
  const onSelectRef  = useRef(onSelect)
  const [ready, setReady] = useState(false)

  // Обновляем ref чтобы не пересоздавать маркеры при смене колбэка
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  // Инициализация карты — только один раз
  useEffect(() => {
    let cancelled = false

    import('maplibre-gl').then(ml => {
      if (cancelled || !containerRef.current || mapRef.current) return
      mlRef.current = ml

      const key = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ''
      const map = new ml.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`,
        center: [55, 64] as [number, number],
        zoom: 2.5,
        attributionControl: false,
        pitchWithRotate: false,
      })

      map.on('load', () => {
        if (!cancelled) setReady(true)
      })

      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        setReady(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Маркеры — обновляем только когда меняется список объектов
  useEffect(() => {
    if (!ready || !mapRef.current || !mlRef.current) return

    // Удаляем старые
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    objects.forEach(obj => {
      if (obj.lat == null || obj.lng == null) return
      const color = COLORS[obj.status] ?? '#6B7280'

      const el = document.createElement('div')
      el.style.cssText = 'position:relative;width:30px;height:30px;cursor:pointer;'
      el.innerHTML = `
        <div style="
          position:absolute;top:50%;left:50%;
          width:30px;height:30px;
          transform:translate(-50%,-50%);
          border-radius:50%;
          background:${color};
          opacity:0.15;
          animation:ping-gold 2.5s ease-in-out infinite;
        "></div>
        <svg viewBox="0 0 30 30" width="30" height="30"
          style="position:relative;z-index:1;filter:drop-shadow(0 0 5px ${color}66)">
          <polygon points="15,2 26,8.5 26,21.5 15,28 4,21.5 4,8.5"
            fill="rgba(10,10,15,0.92)" stroke="${color}" stroke-width="1.5"/>
          <circle cx="15" cy="15" r="3.5" fill="${color}"/>
        </svg>
      `

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.35)'
        el.style.transition = 'transform 0.15s ease'
        el.style.zIndex = '10'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
        el.style.zIndex = '1'
      })
      el.addEventListener('click', () => onSelectRef.current(obj))

      const marker = new mlRef.current.Marker({ element: el, anchor: 'center' })
        .setLngLat([obj.lng, obj.lat])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [ready, objects])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0A0A0F', gap: '10px',
        }}>
          <svg viewBox="0 0 48 48" width="40" height="40" style={{ opacity: 0.35 }}>
            <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
              fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
            <circle cx="24" cy="24" r="5" fill="#C9A84C"/>
          </svg>
          <span style={{ color: '#6B7280', fontSize: '11px', letterSpacing: '0.12em' }}>
            ЗАГРУЗКА КАРТЫ...
          </span>
        </div>
      )}
    </div>
  )
}

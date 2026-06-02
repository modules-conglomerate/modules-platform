
'use client'

import { useEffect, useRef, useState } from 'react'
import type { ModuliObject } from '@/lib/types'

// Импортируем mapbox только на клиенте
let mapboxgl: typeof import('mapbox-gl') | null = null

const statusColors: Record<string, string> = {
  construction: '#C9A84C',
  active:       '#00D4AA',
  planning:     '#5B8CFF',
  archived:     '#6B7280',
}

interface Props {
  objects: ModuliObject[]
  onSelect: (obj: ModuliObject) => void
}

export function MapClient({ objects, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const [ready, setReady] = useState(false)

  // Инициализация карты
  useEffect(() => {
    let cancelled = false

    async function init() {
      const mb = await import('mapbox-gl')
      await import('mapbox-gl/dist/mapbox-gl.css' as any)
      mapboxgl = mb.default ?? mb

      if (cancelled || !containerRef.current || mapRef.current) return

      mapboxgl!.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const map = new mapboxgl!.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [50, 62],
        zoom: 3.5,
        projection: { name: 'globe' } as any,
        attributionControl: false,
      })

      map.on('load', () => {
        // Туман для глобуса
        map.setFog({
          color: 'rgb(10, 10, 15)',
          'high-color': 'rgb(18, 18, 26)',
          'horizon-blend': 0.02,
        } as any)
        if (!cancelled) setReady(true)
      })

      mapRef.current = map
    }

    init()
    return () => { cancelled = true }
  }, [])

  // Маркеры
  useEffect(() => {
    if (!ready || !mapRef.current || !mapboxgl) return

    // Удаляем старые маркеры
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Добавляем новые
    objects.forEach(obj => {
      if (!obj.lat || !obj.lng) return

      const color = statusColors[obj.status] ?? '#6B7280'

      // Кастомный элемент маркера
      const el = document.createElement('div')
      el.className = 'relative cursor-pointer'
      el.innerHTML = `
        <div style="position:relative;width:24px;height:24px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.2;animation:ping-gold 2s infinite;"></div>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7"
              fill="none" stroke="${color}" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="3" fill="${color}"/>
          </svg>
        </div>
      `

      el.addEventListener('click', () => onSelect(obj))

      const marker = new mapboxgl!.Marker({ element: el })
        .setLngLat([obj.lng, obj.lat])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [ready, objects, onSelect])

  return (
    <div ref={containerRef} className="w-full h-full">
      {!ready && (
        <div className="w-full h-full flex items-center justify-center bg-moduli-bg">
          <div className="text-moduli-muted text-xs">Загрузка карты...</div>
        </div>
      )}
    </div>
  )
}

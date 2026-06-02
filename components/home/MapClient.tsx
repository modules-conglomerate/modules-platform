'use client'

import { useEffect, useRef, useState } from 'react'
import type { ModuliObject } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
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
  const mlRef        = useRef<any>(null)
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
        center: [50, 63] as [number, number],
        zoom: 3.2,
        attributionControl: false,
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
      }
    }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || !mlRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    objects.forEach(obj => {
      if (!obj.lat || !obj.lng) return

      const color = STATUS_COLORS[obj.status] ?? '#6B7280'

      const el = document.createElement('div')
      el.style.cssText = 'position:relative;width:28px;height:28px;cursor:pointer;'
      el.innerHTML = `
        <svg viewBox="0 0 28 28" width="28" height="28">
          <polygon
            points="14,2 24,8 24,20 14,26 4,20 4,8"
            fill="rgba(10,10,15,0.85)"
            stroke="${color}"
            stroke-width="1.5"
          />
          <circle cx="14" cy="14" r="3.5" fill="${color}"/>
        </svg>
      `

      el.addEventListener('click', () => onSelect(obj))

      const marker = new mlRef.current.Marker({ element: el })
        .setLngLat([obj.lng, obj.lat])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [ready, objects, onSelect])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-moduli-bg">
          <span className="text-moduli-muted text-xs tracking-wider">Загрузка карты...</span>
        </div>
      )}
    </div>
  )
}

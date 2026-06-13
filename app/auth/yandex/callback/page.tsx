'use client'
import { useEffect } from 'react'

export default function YandexCallback() {
  useEffect(function() {
    const code  = new URLSearchParams(window.location.search).get('code')
    const error = new URLSearchParams(window.location.search).get('error')
    if (error || !code) { window.location.href = '/login?error=cancelled'; return }
    window.location.href = '/api/auth/yandex?code=' + encodeURIComponent(code)
  }, [])
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B7280', fontSize: '13px' }}>Авторизация через Яндекс...</div>
    </div>
  )
}

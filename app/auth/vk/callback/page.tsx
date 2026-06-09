'use client'

import { useEffect } from 'react'

export default function VKCallbackPage() {
  useEffect(function() {
    const params = new URLSearchParams(window.location.search)
    const token    = params.get('token')
    const userId   = params.get('user_id')
    const email    = params.get('email') || ''
    const code     = params.get('code')
    const deviceId = params.get('device_id') || ''

    let url = '/api/auth/vk?'
    if (token && userId) {
      url += 'token=' + encodeURIComponent(token) + '&user_id=' + userId + '&email=' + encodeURIComponent(email)
    } else if (code) {
      url += 'code=' + encodeURIComponent(code) + '&device_id=' + encodeURIComponent(deviceId)
    } else {
      window.location.href = '/login?error=no_params'
      return
    }

    window.location.href = url
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
    }}>
      <img src="/Group_1637.png" alt="Модули"
        style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: 0.5 }} />
      <div style={{ color: '#6B7280', fontSize: '13px' }}>
        Авторизация через ВКонтакте...
      </div>
    </div>
  )
}

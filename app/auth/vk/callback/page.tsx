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

    const EDGE    = 'https://plgesxqkponmwmghvpin.supabase.co/functions/v1/vk-auth'
    const ANON    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    async function doAuth() {
      let url = EDGE
      if (token && userId) {
        url += '?token=' + encodeURIComponent(token) + '&user_id=' + userId + '&email=' + encodeURIComponent(email)
      } else if (code) {
        url += '?code=' + encodeURIComponent(code) + '&device_id=' + encodeURIComponent(deviceId)
      } else {
        window.location.href = '/login?error=no_params'
        return
      }

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + ANON,
            'apikey': ANON,
          },
        })

        const text = await res.text()
        let data: any = {}
        try { data = JSON.parse(text) } catch { data = {} }

        if (data.magic_link) {
          window.location.href = data.magic_link
        } else if (data.error) {
          window.location.href = '/login?error=' + encodeURIComponent(data.error)
        } else {
          window.location.href = '/dashboard'
        }
      } catch (e: any) {
        window.location.href = '/login?error=fetch_failed'
      }
    }

    doAuth()
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
    }}>
      <img
        src="/Group_1637.png"
        alt="Модули"
        style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: 0.5 }}
      />
      <div style={{ color: '#6B7280', fontSize: '13px', letterSpacing: '0.05em' }}>
        Авторизация через ВКонтакте...
      </div>
      <div style={{ color: '#374151', fontSize: '11px' }}>
        Пожалуйста подождите
      </div>
    </div>
  )
}

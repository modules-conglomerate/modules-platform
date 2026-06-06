'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(function() {
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js'
    s.onload = function() {
      const W = window as any
      if (!W.VKIDSDK) return
      const V = W.VKIDSDK
      V.Config.init({
        app: 54625282,
        redirectUrl: 'https://modules-platform.vercel.app/auth/vk/callback',
        responseMode: V.ConfigResponseMode.Callback,
        source: V.ConfigSource.LOWCODE,
        scope: 'email',
      })
      if (!ref.current) return
      new V.OneTap()
        .render({ container: ref.current, showAlternativeLogin: true })
        .on(V.WidgetEvents.ERROR, function(e: any) { console.error(e) })
        .on(V.OneTapInternalEvents.LOGIN_SUCCESS, function(p: any) {
          V.Auth.exchangeCode(p.code, p.device_id)
            .then(function(d: any) {
              const base = 'https://plgesxqkponmwmghvpin.supabase.co/functions/v1/vk-auth'
              if (d.access_token) {
                window.location.href = base + '?token=' + d.access_token + '&user_id=' + d.user_id + '&email=' + (d.email || '')
              } else {
                window.location.href = base + '?code=' + p.code + '&device_id=' + p.device_id
              }
            })
            .catch(function(e: any) { console.error(e) })
        })
    }
    document.head.appendChild(s)
    return function() { if (document.head.contains(s)) document.head.removeChild(s) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/Group_1637.png" alt="Модули" style={{ width: '56px', height: '56px', objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em', margin: '0 0 6px' }}>МОДУЛИ</h1>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Цифровая платформа конгломерата</p>
        </div>
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '28px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '20px', textAlign: 'center' }}>АВТОРИЗАЦИЯ</div>
          <div ref={ref} style={{ marginBottom: '8px', minHeight: '44px' }} />
          <div style={{ fontSize: '10px', color: '#374151', textAlign: 'center', marginBottom: '20px' }}>Авторизация через VK ID</div>
          <div style={{ height: '1px', background: '#1E1E2E', margin: '20px 0' }} />
          <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.1em' }}>ИНВЕСТИЦИИ ЧЕРЕЗ TON</div>
              <div style={{ fontSize: '8px', fontWeight: 700, color: '#C9A84C', padding: '3px 7px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '20px', boxShadow: '0 0 10px rgba(201,168,76,0.25)' }}>
                ✦ ДЛЯ КВАЛИФИЦИРОВАННЫХ ИНВЕСТОРОВ
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.6, marginBottom: '10px' }}>
              Инвестирование в объекты через Telegram в TON-коинах. Номер МИ присваивается после приобретения карты в боте.
            </div>
            <a href="https://t.me/modules_invest_bot" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#229ED9', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
              Подключить Telegram-бот
            </a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '11px', color: '#374151', textDecoration: 'none' }}>← Вернуться на платформу</Link>
        </div>
      </div>
    </div>
  )
}

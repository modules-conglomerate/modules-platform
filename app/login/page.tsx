'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    // Загружаем VK ID SDK
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js'
    script.nonce = 'csp_nonce'
    script.onload = function() {
      if ('VKIDSDK' in window) {
        const VKID = (window as any).VKIDSDK

        VKID.Config.init({
          app: 54625282,
          redirectUrl: 'https://plgesxqkponmwmghvpin.supabase.co/auth/v1/callback',
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: 'email',
        })

        const oneTap = new VKID.OneTap()

        if (containerRef.current) {
          oneTap.render({
            container: containerRef.current,
            showAlternativeLogin: true,
          })
          .on(VKID.WidgetEvents.ERROR, function(err: any) {
            console.error('VK Auth error:', err)
          })
          .on((VKID as any).OneTapInternalEvents.LOGIN_SUCCESS, function(data: any) {
            console.log('VK Login success:', data)
            const code = data?.code
            if (code) {
              window.location.href =
                `https://plgesxqkponmwmghvpin.supabase.co/functions/v1/vk-auth?code=${code}`
            }
          })
        }
      }
    }
    document.head.appendChild(script)

    return function() {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', height: '100vh', overflowY: 'auto',
      background: '#0A0A0F', color: '#E8E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg viewBox="0 0 48 48" width="48" height="48" style={{ margin: '0 auto 16px' }}>
            <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
              fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
            <circle cx="24" cy="24" r="5" fill="#C9A84C"/>
          </svg>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em', margin: '0 0 6px' }}>
            МОДУЛИ
          </h1>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Цифровая платформа конгломерата
          </p>
        </div>

        <div style={{
          background: '#12121A', border: '1px solid #1E1E2E',
          borderRadius: '12px', padding: '28px',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '20px', textAlign: 'center' }}>
            АВТОРИЗАЦИЯ
          </div>

          {/* VK ID One Tap кнопка */}
          <div ref={containerRef} style={{ marginBottom: '20px' }} />

          <div style={{ height: '1px', background: '#1E1E2E', margin: '20px 0' }} />

          {/* Инвестиции через TON */}
          <div style={{
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px', padding: '14px',
          }}>
            <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ИНВЕСТИЦИИ ЧЕРЕЗ TON
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.6, marginBottom: '10px' }}>
              Инвестирование через экосистему Telegram в TON-коинах.
              Номер МИ привязывается к Telegram-боту после авторизации.
            </div>
            
              href="https://t.me/moduli_invest_bot"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px', background: '#229ED9', borderRadius: '6px',
                color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 13.947l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.993.612z"/>
              </svg>
              Подключить Telegram-бот
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '11px', color: '#374151', textDecoration: 'none' }}>
            ← Вернуться на платформу
          </Link>
        </div>

      </div>
    </div>
  )
}

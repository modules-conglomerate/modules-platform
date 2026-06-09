'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Step = 'vk' | 'phone' | 'code' | 'done'

export default function LoginPage() {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep]   = useState<Step>('vk')
  const [phone, setPhone] = useState('')
  const [code, setCode]   = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [vkDone, setVkDone] = useState(false)

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
              const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
              let url = base
              if (d.access_token) {
                url += '?token=' + encodeURIComponent(d.access_token) + '&user_id=' + d.user_id + '&email=' + encodeURIComponent(d.email || '')
              } else {
                url += '?code=' + encodeURIComponent(p.code) + '&device_id=' + encodeURIComponent(p.device_id)
              }
              fetch(url, {
                headers: { 'Authorization': 'Bearer ' + ANON, 'apikey': ANON }
              })
              .then(function(r) { return r.json() })
              .then(function(data) {
                if (data.magic_link) {
                  setVkDone(true)
                  setStep('phone')
                  sessionStorage.setItem('vk_magic_link', data.magic_link)
                } else {
                  setError('Ошибка VK авторизации: ' + (data.error || 'неизвестно'))
                }
              })
              .catch(function() { setError('Ошибка соединения') })
            })
            .catch(function(e: any) { setError('Ошибка VK: ' + e.message) })
        })
    }
    document.head.appendChild(s)
    return function() { if (document.head.contains(s)) document.head.removeChild(s) }
  }, [])

  async function sendSms() {
    if (!phone || phone.length < 10) { setError('Введите корректный номер телефона'); return }
    setSending(true)
    setError('')
    await new Promise(function(r) { setTimeout(r, 1000) })
    setSending(false)
    setStep('code')
  }

  async function verifyCode() {
    if (!code || code.length < 4) { setError('Введите код из SMS'); return }
    setSending(true)
    await new Promise(function(r) { setTimeout(r, 800) })
    setSending(false)
    const magicLink = sessionStorage.getItem('vk_magic_link')
    if (magicLink) {
      window.location.href = magicLink
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/Group_1637.png" alt="Модули" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em', margin: '0 0 6px' }}>МОДУЛИ</h1>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Цифровая платформа конгломерата</p>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '28px' }}>

          {/* Прогресс шагов */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {[
              { key: 'vk',    label: '1. VK ID' },
              { key: 'phone', label: '2. Телефон' },
              { key: 'code',  label: '3. Код' },
            ].map(function(s, i) {
              const active = s.key === step
              const done   = (step === 'phone' && i === 0) || (step === 'code' && i <= 1) || step === 'done'
              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    flex: 1, textAlign: 'center', fontSize: '10px', fontWeight: 700,
                    color: done ? '#00D4AA' : active ? '#C9A84C' : '#374151',
                    padding: '4px', borderRadius: '4px',
                    background: done ? 'rgba(0,212,170,0.1)' : active ? 'rgba(201,168,76,0.1)' : 'transparent',
                    border: '1px solid ' + (done ? 'rgba(0,212,170,0.3)' : active ? 'rgba(201,168,76,0.3)' : '#1E1E2E'),
                  }}>
                    {done && i < 2 ? '✓ ' : ''}{s.label}
                  </div>
                  {i < 2 && <div style={{ width: '12px', height: '1px', background: '#1E1E2E', flexShrink: 0 }} />}
                </div>
              )
            })}
          </div>

          {/* ШАГ 1 — VK */}
          {step === 'vk' && (
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px', textAlign: 'center' }}>
                ШАГ 1 — АВТОРИЗАЦИЯ ЧЕРЕЗ VK ID
              </div>
              <div ref={ref} style={{ minHeight: '44px', marginBottom: '8px' }} />
              {error && (
                <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', fontSize: '11px', color: '#FCA5A5', marginTop: '12px' }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* ШАГ 2 — Телефон */}
          {step === 'phone' && (
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px', textAlign: 'center' }}>
                ШАГ 2 — ПОДТВЕРЖДЕНИЕ ТЕЛЕФОНА
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px', textAlign: 'center', lineHeight: 1.5 }}>
                Введите номер телефона для получения SMS-кода
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>НОМЕР ТЕЛЕФОНА</div>
                <input
                  value={phone}
                  onChange={function(e) { setPhone(e.target.value) }}
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  style={{
                    width: '100%', padding: '11px 12px', boxSizing: 'border-box',
                    background: '#0A0A0F', border: '1px solid #2A2A3E',
                    borderRadius: '6px', color: '#E8E8F0', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>
              {error && (
                <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', fontSize: '11px', color: '#FCA5A5', marginBottom: '12px' }}>
                  {error}
                </div>
              )}
              <button onClick={sendSms} disabled={sending} style={{
                width: '100%', padding: '12px', background: '#C9A84C',
                border: 'none', borderRadius: '8px', color: '#0A0A0F',
                fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                cursor: sending ? 'wait' : 'pointer',
              }}>
                {sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ КОД'}
              </button>
            </div>
          )}

          {/* ШАГ 3 — Код */}
          {step === 'code' && (
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px', textAlign: 'center' }}>
                ШАГ 3 — ВВЕДИТЕ КОД ИЗ SMS
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px', textAlign: 'center', lineHeight: 1.5 }}>
                Код отправлен на номер {phone}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <input
                  value={code}
                  onChange={function(e) { setCode(e.target.value) }}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  style={{
                    width: '100%', padding: '16px', boxSizing: 'border-box',
                    background: '#0A0A0F', border: '1px solid #2A2A3E',
                    borderRadius: '6px', color: '#E8E8F0', fontSize: '24px',
                    outline: 'none', textAlign: 'center', letterSpacing: '0.5em',
                  }}
                />
              </div>
              {error && (
                <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', fontSize: '11px', color: '#FCA5A5', marginBottom: '12px' }}>
                  {error}
                </div>
              )}
              <button onClick={verifyCode} disabled={sending} style={{
                width: '100%', padding: '12px', background: '#00D4AA',
                border: 'none', borderRadius: '8px', color: '#0A0A0F',
                fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                cursor: sending ? 'wait' : 'pointer',
              }}>
                {sending ? 'ПРОВЕРКА...' : 'ПОДТВЕРДИТЬ'}
              </button>
              <button onClick={function() { setStep('phone'); setCode('') }} style={{
                width: '100%', padding: '10px', background: 'transparent',
                border: 'none', color: '#6B7280', fontSize: '11px',
                cursor: 'pointer', marginTop: '8px',
              }}>
                ← Изменить номер телефона
              </button>
            </div>
          )}

          <div style={{ height: '1px', background: '#1E1E2E', margin: '20px 0' }} />

          <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.1em' }}>ИНВЕСТИЦИИ ЧЕРЕЗ TON</div>
              <div style={{ fontSize: '8px', fontWeight: 700, color: '#C9A84C', padding: '3px 7px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '20px', boxShadow: '0 0 10px rgba(201,168,76,0.25)' }}>
                ✦ ДЛЯ КВАЛИФИЦИРОВАННЫХ ИНВЕСТОРОВ
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.6, marginBottom: '10px' }}>
              Номер МИ присваивается после приобретения инвестиционной карты в Telegram-боте.
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

'use client'

import { signInWithVK } from '@/lib/supabase/auth'
import Link from 'next/link'

export default function LoginPage() {
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
            ДВОЙНАЯ АВТОРИЗАЦИЯ
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '8px', letterSpacing: '0.08em' }}>
              ШАГ 1 — ОСНОВНАЯ АВТОРИЗАЦИЯ
            </div>
            <button
              onClick={signInWithVK}
              style={{
                width: '100%', padding: '13px',
                background: '#0077FF', border: 'none',
                borderRadius: '8px', color: '#fff',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.585-1.496c.598-.19 1.365 1.26 2.182 1.818.616.422 1.084.33 1.084.33l2.178-.03s1.139-.071.599-.964c-.044-.073-.314-.661-1.617-1.869-1.363-1.261-1.18-1.057.461-3.238.999-1.332 1.397-2.145 1.272-2.493-.12-.332-.855-.244-.855-.244l-2.451.015s-.182-.025-.317.055c-.132.078-.217.26-.217.26s-.386 1.026-.901 1.898c-1.085 1.844-1.52 1.942-1.697 1.827-.412-.267-.309-1.073-.309-1.646 0-1.789.271-2.534-.528-2.726-.265-.064-.46-.106-1.138-.113-.869-.009-1.604.003-2.02.206-.277.135-.491.436-.361.453.161.021.527.099.72.363.249.341.24 1.107.24 1.107s.143 2.105-.334 2.365c-.327.176-.777-.183-1.742-1.827-.494-.855-.868-1.8-.868-1.8s-.072-.176-.202-.271c-.157-.115-.376-.151-.376-.151l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.271 3.889 6.422c1.894 1.974 4.045 1.844 4.045 1.844h.975z"/>
              </svg>
              Войти через ВКонтакте
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
            <span style={{ fontSize: '10px', color: '#374151' }}>затем</span>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '8px', letterSpacing: '0.08em' }}>
              ШАГ 2 — ПОДТВЕРЖДЕНИЕ ЧЕРЕЗ МАКС
            </div>
            <div style={{
              width: '100%', padding: '13px',
              background: '#0A0A0F', border: '1px solid #2A2A3E',
              borderRadius: '8px', color: '#6B7280', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              Подтверждение в мессенджере МАКС
            </div>
            <div style={{ fontSize: '10px', color: '#374151', marginTop: '6px', textAlign: 'center', lineHeight: 1.5 }}>
              После авторизации ВКонтакте придёт код подтверждения в МАКС
            </div>
          </div>

          <div style={{ height: '1px', background: '#1E1E2E', margin: '16px 0' }} />

          <div style={{
            background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px', padding: '14px',
          }}>
            <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ИНВЕСТИЦИИ ЧЕРЕЗ TON
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.6, marginBottom: '10px' }}>
              Инвестирование через экосистему Telegram в TON-коинах.
              Номер МИ привязывается к Telegram-боту после авторизации.
            </div>
            <a href="https://t.me/moduli_invest_bot" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', background: '#229ED9', borderRadius: '6px',
              color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
            }}>
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

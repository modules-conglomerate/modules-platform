'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser]       = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    const supabase = createClient()

    async function init() {
      // Supabase автоматически читает токен из URL хэша
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setUser(session.user)
        setLoading(false)
        // Чистим хэш из URL
        window.history.replaceState(null, '', '/dashboard')
        return
      }

      // Если сессии нет — слушаем событие
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        function(event, session) {
          if (session) {
            setUser(session.user)
            setLoading(false)
            window.history.replaceState(null, '', '/dashboard')
          } else {
            setLoading(false)
          }
        }
      )

      return function() { subscription.unsubscribe() }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <img src="/Group_1637.png" alt="Модули" style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: 0.5 }} />
        <div style={{ color: '#6B7280', fontSize: '13px' }}>Загрузка кабинета...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: '#6B7280', fontSize: '13px' }}>Сессия истекла</div>
        <Link href="/login" style={{ padding: '10px 20px', background: '#C9A84C', color: '#0A0A0F', borderRadius: '6px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
          Войти снова
        </Link>
      </div>
    )
  }

  const meta = user.user_metadata ?? {}
  const vkId = meta.vk_id
  const name = meta.full_name || user.email

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Личный кабинет</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>ЛИЧНЫЙ КАБИНЕТ</h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{user.email}</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Профиль */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {meta.avatar_url ? (
            <img src={meta.avatar_url} alt={name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #C9A84C' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#C9A84C' }}>
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#E8E8F0', marginBottom: '4px' }}>{name || 'Пользователь'}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{user.email}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#00D4AA', padding: '3px 10px', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '20px' }}>
                ✓ Авторизован через VK
              </span>
              {vkId && (
                <span style={{ fontSize: '10px', color: '#6B7280', padding: '3px 10px', border: '1px solid #1E1E2E', borderRadius: '20px' }}>
                  VK ID: {vkId}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={async function() {
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #1E1E2E', borderRadius: '6px', color: '#6B7280', fontSize: '12px', cursor: 'pointer' }}
          >
            Выйти
          </button>
        </div>

        {/* Нет инвест карты */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>⬡</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#E8E8F0', marginBottom: '8px' }}>
            Инвестиционная карта не привязана
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px', lineHeight: 1.6 }}>
            Приобретите карту Модули чтобы инвестировать в объекты,<br />
            участвовать в мероприятиях и получить номер МИ
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link href="/invest" style={{ padding: '11px 24px', background: '#C9A84C', color: '#0A0A0F', borderRadius: '8px', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em', textDecoration: 'none' }}>
              ПОЛУЧИТЬ КАРТУ
            </Link>
            <a href="https://t.me/modules_invest_bot" target="_blank" rel="noopener noreferrer" style={{ padding: '11px 24px', background: '#229ED9', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
              Telegram-бот
            </a>
          </div>
        </div>

        {/* Быстрые ссылки */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { href: '/objects',   label: 'Объекты',    icon: '🏗' },
            { href: '/invest',    label: 'Инвестиции', icon: '⬡' },
            { href: '/documents', label: 'Документы',  icon: '📄' },
            { href: '/events',    label: 'События',    icon: '⚡' },
            { href: '/access',    label: 'Допуски',    icon: '🔑' },
            { href: '/messages',  label: 'Сообщения',  icon: '💬' },
          ].map(function(item) {
            return (
              <Link key={item.href} href={item.href} style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', color: '#E8E8F0', fontWeight: 500 }}>{item.label}</span>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}

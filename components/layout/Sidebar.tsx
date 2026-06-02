
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/',          label: 'Карта объектов' },
  { href: '/events',    label: 'События' },
  { href: '/streams',   label: 'Трансляции' },
  { href: '/weather',   label: 'Погода' },
  { href: '/ecology',   label: 'Экология' },
  { href: '/analytics', label: 'Аналитика' },
  { href: '/access',    label: 'Допуски' },
  { href: '/documents', label: 'Документы' },
  { href: '/messages',  label: 'Сообщения' },
]

export function Sidebar() {
  const path = usePathname()
  const [logoHover, setLogoHover] = useState(false)

  return (
    <>
      <style>{`
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(201,168,76,0.4)); }
          50%       { filter: drop-shadow(0 0 18px rgba(201,168,76,0.9)); }
        }
        @keyframes pulseGlowFast {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(201,168,76,0.6)); }
          50%       { filter: drop-shadow(0 0 24px rgba(255,200,50,1)); }
        }
        .logo-wrap {
          animation: pulseGlow 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .logo-wrap:hover {
          animation: pulseGlowFast 1s ease-in-out infinite;
          transform: scale(1.08);
        }
        .logo-img {
          transition: transform 0.6s ease;
        }
        .logo-wrap:hover .logo-img {
          transform: rotate(15deg) scale(1.05);
        }
        .nav-link {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 2px;
          text-decoration: none;
          border-left: 2px solid transparent;
          color: #6B7280;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .nav-link:hover {
          color: #E8C96B;
          background: rgba(201,168,76,0.06);
          border-left-color: rgba(201,168,76,0.4);
        }
        .nav-link.active {
          color: #C9A84C;
          background: rgba(201,168,76,0.1);
          border-left-color: #C9A84C;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: rgba(201,168,76,0.04);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      <aside style={{
        width: '200px',
        flexShrink: 0,
        background: '#0D0D14',
        borderRight: '1px solid #1E1E2E',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Логотип */}
          <div
            className="logo-wrap"
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Group_1637.png"
              alt="Модули логотип"
              className="logo-img"
              width={38}
              height={38}
              style={{ width: '38px', height: '38px', objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                // Если PNG не нашёлся — показываем SVG-запасной вариант
                const target = e.currentTarget
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<svg viewBox="0 0 38 38" width="38" height="38">
                    <polygon points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
                      fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                    <polygon points="19,8 29,13.5 29,24.5 19,30 9,24.5 9,13.5"
                      fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"/>
                    <circle cx="19" cy="19" r="4" fill="#C9A84C"/>
                  </svg>`
                }
              }}
            />
          </div>

        {/* Навигация */}
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{
            color: '#374151',
            fontSize: '9px',
            letterSpacing: '0.14em',
            padding: '0 10px',
            marginBottom: '8px',
          }}>
            ЭКОСИСТЕМА МОДУЛИ
          </div>
          <nav>
            {nav.map(({ href, label }) => {
              const active = path === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${active ? ' active' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Нижний блок */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #1E1E2E',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '8px', color: '#374151', letterSpacing: '0.1em', marginBottom: '4px' }}>
            10:24:31 · 24 мая 2025
          </div>
          <div style={{ fontSize: '9px', color: '#4B5563', lineHeight: 1.5 }}>
            СОЗДАЁМ ИНФРАСТРУКТУРУ<br />БУДУЩЕГО
          </div>
        </div>

      </aside>
    </>
  )
}

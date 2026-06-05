
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  { href: '/invest',    label: '⬡ Инвестиции' },
  { href: '/dashboard', label: '◈ Кабинет' },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <>
      <style>{`
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(201,168,76,0.3)); }
          50%       { filter: drop-shadow(0 0 14px rgba(201,168,76,0.8)); }
        }
        @keyframes logoGlowHover {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(201,168,76,0.7)); }
          50%       { filter: drop-shadow(0 0 22px rgba(255,200,50,1)); }
        }
        .moduli-logo {
          animation: logoGlow 3s ease-in-out infinite;
          transition: transform 0.4s ease;
        }
        .moduli-logo:hover {
          animation: logoGlowHover 0.8s ease-in-out infinite;
          transform: rotate(12deg) scale(1.1);
        }
        .moduli-navlink {
          display: block;
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 2px;
          text-decoration: none;
          border-left: 2px solid transparent;
          color: #6B7280;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .moduli-navlink:hover {
          color: #E8C96B;
          background: rgba(201,168,76,0.07);
          border-left-color: rgba(201,168,76,0.35);
        }
        .moduli-navlink.active {
          color: #C9A84C;
          background: rgba(201,168,76,0.1);
          border-left-color: #C9A84C;
        }
      `}</style>

      <aside style={{
        width: '210px',
        minWidth: '210px',
        flexShrink: 0,
        background: '#0D0D14',
        borderRight: '1px solid #1E1E2E',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}>

        {/* ── Логотип ── */}
        <div style={{
          padding: '16px 14px',
          borderBottom: '1px solid #1E1E2E',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '64px',
        }}>
          <div className="moduli-logo" style={{ flexShrink: 0, width: '36px', height: '36px' }}>
            <img
              src="/Group_1637.png"
              alt="Модули"
              style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              color: '#C9A84C',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.2em',
              lineHeight: 1.1,
            }}>
              МОДУЛИ
            </div>
            <div style={{
              color: '#4B5563',
              fontSize: '8px',
              letterSpacing: '0.14em',
              marginTop: '2px',
            }}>
              КОНГЛОМЕРАТ
            </div>
          </div>
        </div>

        {/* ── Навигация ── */}
        <div style={{ padding: '14px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{
            color: '#374151',
            fontSize: '9px',
            letterSpacing: '0.14em',
            padding: '0 12px',
            marginBottom: '10px',
          }}>
            ЭКОСИСТЕМА МОДУЛИ
          </div>
          <nav>
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`moduli-navlink${path === href ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Подвал сайдбара ── */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid #1E1E2E',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '8px', color: '#374151', letterSpacing: '0.08em' }}>
            СОЗДАЁМ ИНФРАСТРУКТУРУ БУДУЩЕГО
          </div>
        </div>

      </aside>
    </>
  )
}

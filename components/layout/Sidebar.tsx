
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
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{ width: '192px', flexShrink: 0, background: '#12121A', borderRight: '1px solid #1E1E2E', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #1E1E2E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 32 32" width="32" height="32">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
            <polygon points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
            <circle cx="16" cy="16" r="3" fill="#C9A84C" />
          </svg>
          <div>
            <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: '13px', letterSpacing: '0.15em' }}>МОДУЛИ</div>
            <div style={{ color: '#6B7280', fontSize: '9px', letterSpacing: '0.1em' }}>КОНГЛОМЕРАТ</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{ color: '#6B7280', fontSize: '9px', letterSpacing: '0.12em', padding: '0 8px', marginBottom: '8px' }}>
          ЭКОСИСТЕМА МОДУЛИ
        </div>
        <nav>
          {nav.map(({ href, label }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '2px',
                  textDecoration: 'none',
                  borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent',
                  background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                  color: active ? '#C9A84C' : '#6B7280',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #1E1E2E', textAlign: 'center' }}>
        <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 8px', opacity: 0.2 }}>
          <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="#C9A84C" strokeWidth="1" />
        </svg>
        <div style={{ color: '#C9A84C', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em' }}>МОДУЛИ</div>
        <div style={{ color: '#6B7280', fontSize: '9px', marginTop: '4px', lineHeight: 1.4 }}>
          СОЗДАЁМ ИНФРАСТРУКТУРУ<br />БУДУЩЕГО
        </div>
      </div>
    </aside>
  )
}

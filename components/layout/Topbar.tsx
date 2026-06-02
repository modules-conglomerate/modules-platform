import Link from 'next/link'

const links = [
  { href: '/',          label: 'ГЛАВНАЯ' },
  { href: '/objects',   label: 'ОБЪЕКТЫ' },
  { href: '/products',  label: 'ПРОДУКЦИЯ' },
  { href: '/employees', label: 'СОТРУДНИКИ' },
  { href: '/equipment', label: 'ТЕХНИКА' },
  { href: '/analytics', label: 'АНАЛИТИКА' },
  { href: '/knowledge', label: 'БИБЛИОТЕКА' },
]

export function Topbar() {
  return (
    <header style={{
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid #1E1E2E',
      background: '#12121A',
      flexShrink: 0,
    }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: '#6B7280',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingLeft: '16px',
          borderLeft: '1px solid #1E1E2E',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#C9A84C', fontWeight: 600,
          }}>
            А
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#E8E8F0' }}>Аджна</div>
            <div style={{ fontSize: '10px', color: '#6B7280' }}>Администратор</div>
          </div>
        </div>
      </div>
    </header>
  )
}

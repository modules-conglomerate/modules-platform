
import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, crumbs, actions }: Props) {
  return (
    <div style={{ background: '#0D0D14', borderBottom: '1px solid #1E1E2E' }}>
      {/* Хлебные крошки */}
      <div style={{ padding: '10px 24px', borderBottom: '1px solid #1A1A2A', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>
          ⬡ Модули
        </Link>
        {crumbs?.map(function(crumb, i) {
          return (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#1E1E2E', fontSize: '11px' }}>/</span>
              {crumb.href ? (
                <Link href={crumb.href} style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: '#C9A84C', fontSize: '11px' }}>{crumb.label}</span>
              )}
            </span>
          )
        })}
      </div>

      {/* Заголовок */}
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 2px', color: '#E8E8F0' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{subtitle}</p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

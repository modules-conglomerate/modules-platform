
import Link from 'next/link'
import { Search, Bell } from 'lucide-react'

const links = [
  { href: '/',           label: 'ГЛАВНАЯ' },
  { href: '/objects',    label: 'ОБЪЕКТЫ' },
  { href: '/products',   label: 'ПРОДУКЦИЯ' },
  { href: '/employees',  label: 'СОТРУДНИКИ' },
  { href: '/equipment',  label: 'ТЕХНИКА' },
  { href: '/analytics',  label: 'АНАЛИТИКА' },
  { href: '/knowledge',  label: 'БИБЛИОТЕКА' },
]

export function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-moduli-border bg-moduli-surface flex-shrink-0">
      <nav className="flex items-center gap-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs font-medium tracking-wider text-moduli-muted hover:text-moduli-gold transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <button className="p-2 text-moduli-muted hover:text-moduli-text transition-colors">
          <Search size={16} />
        </button>
        <button className="p-2 text-moduli-muted hover:text-moduli-text transition-colors">
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-moduli-border">
          <div className="w-7 h-7 rounded-full bg-moduli-gold/20 border border-moduli-gold/40 flex items-center justify-center text-xs text-moduli-gold font-medium">
            А
          </div>
          <div>
            <div className="text-xs font-medium">Аджна</div>
            <div className="text-[10px] text-moduli-muted">Администратор</div>
          </div>
        </div>
      </div>
    </header>
  )
}

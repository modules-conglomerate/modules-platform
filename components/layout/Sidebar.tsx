
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Map, Radio, Sun, Leaf, BarChart2,
  Shield, FileText, MessageSquare, Zap
} from 'lucide-react'
import { clsx } from 'clsx'

const nav = [
  { href: '/',           label: 'Карта объектов',  icon: Map },
  { href: '/events',     label: 'События',          icon: Zap },
  { href: '/streams',    label: 'Трансляции',       icon: Radio },
  { href: '/weather',    label: 'Погода',           icon: Sun },
  { href: '/ecology',    label: 'Экология',         icon: Leaf },
  { href: '/analytics',  label: 'Аналитика',        icon: BarChart2 },
  { href: '/access',     label: 'Допуски',          icon: Shield },
  { href: '/documents',  label: 'Документы',        icon: FileText },
  { href: '/messages',   label: 'Сообщения',        icon: MessageSquare },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-48 flex-shrink-0 flex flex-col bg-moduli-surface border-r border-moduli-border">
      {/* Логотип */}
      <div className="p-4 border-b border-moduli-border">
        <div className="flex items-center gap-2 mb-1">
          {/* Гексагональный логотип */}
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8">
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="none" stroke="#C9A84C" strokeWidth="1.5"
              />
              <polygon
                points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5"
                fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"
              />
              <circle cx="16" cy="16" r="3" fill="#C9A84C" />
            </svg>
          </div>
          <div>
            <div className="text-moduli-gold font-bold text-sm tracking-widest">МОДУЛИ</div>
            <div className="text-moduli-muted text-[9px] tracking-wider">КОНГЛОМЕРАТ</div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="px-2 py-3 flex-1">
        <div className="text-[9px] text-moduli-muted tracking-widest px-2 mb-2">
          ЭКОСИСТЕМА МОДУЛИ
        </div>
        <nav className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2.5 px-2 py-2 rounded text-xs transition-all',
                  active
                    ? 'bg-moduli-gold/10 text-moduli-gold border-l-2 border-moduli-gold'
                    : 'text-moduli-muted hover:text-moduli-text hover:bg-moduli-border/50'
                )}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Нижняя секция */}
      <div className="p-4 border-t border-moduli-border text-center">
        <div className="w-12 h-12 mx-auto mb-2">
          <svg viewBox="0 0 48 48" className="w-full h-full opacity-30">
            <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
              fill="none" stroke="#C9A84C" strokeWidth="1"/>
          </svg>
        </div>
        <div className="text-moduli-gold text-xs font-bold tracking-widest">МОДУЛИ</div>
        <div className="text-moduli-muted text-[9px] mt-0.5">
          СОЗДАЁМ ИНФРАСТРУКТУРУ<br />БУДУЩЕГО
        </div>
      </div>
    </aside>
  )
}

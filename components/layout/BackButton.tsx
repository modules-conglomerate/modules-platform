
'use client'

import { useRouter } from 'next/navigation'

interface Props {
  label?: string
  href?: string
}

export function BackButton({ label = '← Назад', href }: Props) {
  const router = useRouter()

  return (
    <button
      onClick={function() { href ? router.push(href) : router.back() }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', background: 'transparent',
        border: '1px solid #1E1E2E', borderRadius: '6px',
        color: '#6B7280', fontSize: '12px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={function(e) {
        e.currentTarget.style.borderColor = '#C9A84C'
        e.currentTarget.style.color = '#C9A84C'
      }}
      onMouseLeave={function(e) {
        e.currentTarget.style.borderColor = '#1E1E2E'
        e.currentTarget.style.color = '#6B7280'
      }}
    >
      {label}
    </button>
  )
}

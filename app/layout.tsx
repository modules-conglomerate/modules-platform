
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Модули — Цифровая платформа конгломерата',
  description: 'Цифровой дневник объектов и территорий',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body style={{ background: '#0A0A0F', color: '#E8E8F0' }}>
        {children}
      </body>
    </html>
  )
}

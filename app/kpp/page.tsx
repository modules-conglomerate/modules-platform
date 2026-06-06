
'use client'

import { useState } from 'react'

const MOCK_EMPLOYEES = [
  { id: '1', name: 'Александр Иванов',  position: 'Прораб',          access: 4, status: 'on_site',    color: '#00D4AA' },
  { id: '2', name: 'Михаил Петров',     position: 'Инженер',          access: 3, status: 'in_transit', color: '#5B8CFF' },
  { id: '3', name: 'Сергей Козлов',     position: 'Оператор',         access: 2, status: 'working',   color: '#C9A84C' },
  { id: '4', name: 'Андрей Новиков',    position: 'Техник',           access: 3, status: 'on_site',   color: '#00D4AA' },
  { id: '5', name: 'Дмитрий Морозов',   position: 'Геодезист',        access: 2, status: 'in_office', color: '#A78BFA' },
]

const STATUS_LABEL: Record<string, string> = {
  on_site:    'На объекте',
  in_transit: 'В пути',
  working:    'Работает',
  in_office:  'В офисе',
  unavailable:'Недоступен',
}

const ACCESS_COLORS: Record<number, string> = {
  1: '#6B7280', 2: '#4ADE80', 3: '#5B8CFF', 4: '#C9A84C', 5: '#A78BFA', 6: '#EF4444',
}

export default function KppPage() {
  const [scanInput, setScanInput] = useState('')
  const [lastScan, setLastScan] = useState<any>(null)
  const [scanStatus, setScanStatus] = useState<'idle'|'granted'|'denied'>('idle')
  const [log, setLog] = useState<any[]>([
    { time: '08:42', name: 'Александр Иванов', action: 'ВХОД',  access: 4, color: '#00D4AA' },
    { time: '08:38', name: 'Михаил Петров',    action: 'ВЫХОД', access: 3, color: '#EF4444' },
    { time: '08:31', name: 'Сергей Козлов',    action: 'ВХОД',  access: 2, color: '#00D4AA' },
    { time: '08:15', name: 'Андрей Новиков',   action: 'ВХОД',  access: 3, color: '#00D4AA' },
  ])

  function handleScan() {
    const found = MOCK_EMPLOYEES.find(function(e) {
      return e.name.toLowerCase().includes(scanInput.toLowerCase()) || scanInput === e.id
    })
    if (found) {
      setLastScan(found)
      setScanStatus('granted')
      const now = new Date()
      const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0')
      setLog(function(prev) {
        return [{ time, name: found.name, action: 'ВХОД', access: found.access, color: '#00D4AA' }, ...prev.slice(0, 9)]
      })
    } else if (scanInput.length > 0) {
      setLastScan(null)
      setScanStatus('denied')
    }
    setScanInput('')
    setTimeout(function() { setScanStatus('idle') }, 3000)
  }

  const onSite = MOCK_EMPLOYEES.filter(function(e) { return e.status === 'on_site' || e.status === 'working' })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D4AA', boxShadow: '0 0 8px #00D4AA' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: 0 }}>
            ИНТЕЛЛЕКТУАЛЬНЫЙ КПП
          </h1>
        </div>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: '4px 0 0' }}>
          Система контроля доступа · Терразавод Гибрид
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Сканер */}
          <div style={{
            background: '#12121A', border: '1px solid ' + (scanStatus === 'granted' ? '#00D4AA' : scanStatus === 'denied' ? '#EF4444' : '#1E1E2E'),
            borderRadius: '12px', padding: '24px',
            boxShadow: scanStatus === 'granted' ? '0 0 30px rgba(0,212,170,0.15)' : scanStatus === 'denied' ? '0 0 30px rgba(239,68,68,0.15)' : 'none',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>
              СКАНЕР ПРОПУСКОВ
            </div>

            {scanStatus === 'idle' && (
              <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', opacity: 0.2, marginBottom: '8px' }}>📷</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Ожидание сканирования QR / NFC</div>
              </div>
            )}

            {scanStatus === 'granted' && lastScan && (
              <div style={{ textAlign: 'center', padding: '16px 0', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#00D4AA', marginBottom: '4px' }}>
                  ДОСТУП РАЗРЕШЁН
                </div>
                <div style={{ fontSize: '14px', color: '#E8E8F0', marginBottom: '2px' }}>{lastScan.name}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{lastScan.position} · Уровень У{lastScan.access}</div>
              </div>
            )}

            {scanStatus === 'denied' && (
              <div style={{ textAlign: 'center', padding: '16px 0', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚫</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>
                  ДОСТУП ЗАПРЕЩЁН
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Пропуск не найден или недействителен</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={scanInput}
                onChange={function(e) { setScanInput(e.target.value) }}
                onKeyDown={function(e) { if (e.key === 'Enter') handleScan() }}
                placeholder="Имя сотрудника или ID пропуска..."
                style={{
                  flex: 1, padding: '10px 14px',
                  background: '#0A0A0F', border: '1px solid #2A2A3E',
                  borderRadius: '6px', color: '#E8E8F0', fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleScan}
                style={{
                  padding: '10px 20px', background: '#C9A84C',
                  border: 'none', borderRadius: '6px',
                  color: '#0A0A0F', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                СКАНИРОВАТЬ
              </button>
            </div>
            <div style={{ fontSize: '10px', color: '#374151', marginTop: '8px' }}>
              Введите имя для демо или нажмите Enter
            </div>
          </div>

          {/* На объекте сейчас */}
          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>НА ОБЪЕКТЕ СЕЙЧАС</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#00D4AA' }}>{onSite.length} чел.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MOCK_EMPLOYEES.map(function(emp) {
                const color = ACCESS_COLORS[emp.access] ?? '#6B7280'
                return (
                  <div key={emp.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', background: '#0A0A0F',
                    border: '1px solid #1E1E2E', borderRadius: '6px',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: emp.color + '22', border: '1px solid ' + emp.color + '55',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: emp.color,
                    }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#E8E8F0', fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>{emp.position}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: emp.color }}>
                        {STATUS_LABEL[emp.status]}
                      </div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: color }}>
                        У{emp.access}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Правая колонка — лог */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px' }}>
              ЖУРНАЛ ПРОХОДОВ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {log.map(function(entry, i) {
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', background: '#0A0A0F',
                    border: '1px solid #1E1E2E', borderRadius: '6px',
                  }}>
                    <span style={{ fontSize: '10px', color: '#374151', fontFamily: 'monospace', flexShrink: 0 }}>
                      {entry.time}
                    </span>
                    <span style={{ fontSize: '11px', color: '#E8E8F0', flex: 1 }}>{entry.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: ACCESS_COLORS[entry.access] }}>
                      У{entry.access}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: entry.color, padding: '2px 8px', background: entry.color + '18', borderRadius: '3px' }}>
                      {entry.action}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Статистика дня */}
          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '14px' }}>
              СТАТИСТИКА ДНЯ
            </div>
            {[
              { label: 'Всего проходов',   value: log.length, color: '#E8E8F0' },
              { label: 'Входов',           value: log.filter(function(l) { return l.action === 'ВХОД' }).length,  color: '#00D4AA' },
              { label: 'Выходов',          value: log.filter(function(l) { return l.action === 'ВЫХОД' }).length, color: '#C9A84C' },
              { label: 'На объекте',       value: onSite.length, color: '#5B8CFF' },
            ].map(function(stat) {
              return (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1A1A2A' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{stat.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}


import Link from 'next/link'

const LEVELS = [
  { name: 'Резидент',          color: '#6B7280', min: 0,      desc: 'Базовый уровень участия' },
  { name: 'Участник',          color: '#4ADE80', min: 100,    desc: 'Активный участник экосистемы' },
  { name: 'Партнёр проекта',   color: '#5B8CFF', min: 1000,   desc: 'Регулярная поддержка объектов' },
  { name: 'Хранитель объекта', color: '#C9A84C', min: 10000,  desc: 'Значительная поддержка проектов' },
  { name: 'Основатель проекта',color: '#EF4444', min: 100000, desc: 'Высший уровень участия' },
]

const BENEFITS = [
  { icon: '🎫', title: 'Закрытые мероприятия',    desc: 'Презентации, инженерные экскурсии, MODULES SUMMIT' },
  { icon: '⬡',  title: 'Поддержка объектов',      desc: 'Инвестиции в конкретные проекты через TON' },
  { icon: '📊', title: 'Прозрачная отчётность',   desc: 'Полная выписка расходов для налоговой' },
  { icon: '🏗',  title: 'Экскурсии на объекты',    desc: 'Посещение строительных площадок и производств' },
  { icon: '🌍', title: 'Международные программы', desc: 'Деловые поездки и отраслевые выставки' },
  { icon: '🔢', title: 'номер МИ',                desc: 'Бессрочный персональный идентификатор МИ-XXXXXXXX' },
]

export default function InvestPage() {
  return (
   <div style={{ minHeight: '100vh', height: '100vh', overflowY: 'auto', background: '#0A0A0F', color: '#E8E8F0' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A14 100%)',
        borderBottom: '1px solid #1E1E2E',
        padding: '60px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04 }}>
          <svg viewBox="0 0 400 400" width="400" height="400">
            <polygon points="200,20 360,110 360,290 200,380 40,290 40,110" fill="none" stroke="#C9A84C" strokeWidth="1"/>
            <polygon points="200,60 320,130 320,270 200,340 80,270 80,130" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
            <polygon points="200,100 280,150 280,250 200,300 120,250 120,150" fill="none" stroke="#C9A84C" strokeWidth="0.6"/>
          </svg>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.2em', marginBottom: '16px' }}>
            ИНВЕСТИЦИОННАЯ ПРОГРАММА
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 12px', color: '#E8E8F0' }}>
            КАРТА МОДУЛИ
          </h1>
          <div style={{ fontSize: '14px', color: '#C9A84C', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '16px' }}>
            МИ-XXXXXX
          </div>
          <p style={{ fontSize: '14px', color: '#B0B0C0', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Инструмент участия в развитии экосистемы конгломерата. Поддержка объектов через TON,
            доступ к закрытым мероприятиям и полная прозрачность инвестиций.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button style={{
              padding: '13px 28px', background: '#C9A84C', color: '#0A0A0F',
              border: 'none', borderRadius: '8px', fontSize: '13px',
              fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              ПОЛУЧИТЬ КАРТУ
            </button>
            <Link href="/objects" style={{
              padding: '13px 28px', background: 'transparent',
              border: '1px solid #2A2A3E', borderRadius: '8px',
              color: '#B0B0C0', fontSize: '13px', textDecoration: 'none',
            }}>
              ОБЪЕКТЫ КОНГЛОМЕРАТА
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Карта */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.15em', marginBottom: '16px' }}>
            ФИЗИЧЕСКАЯ КАРТА
          </div>
          <div style={{
            display: 'inline-block',
            width: '340px', height: '200px',
            background: 'linear-gradient(135deg, #1A1A2E 0%, #0D0D14 60%, #1A1410 100%)',
            borderRadius: '16px', border: '1px solid #C9A84C33',
            boxShadow: '0 20px 60px rgba(201,168,76,0.15), 0 0 0 1px rgba(201,168,76,0.1)',
            position: 'relative', overflow: 'hidden', padding: '24px',
            textAlign: 'left',
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', opacity: 0.06 }}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <polygon points="60,5 105,32.5 105,87.5 60,115 15,87.5 15,32.5" fill="none" stroke="#C9A84C" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <svg viewBox="0 0 32 32" width="28" height="28">
                <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="3" fill="#C9A84C"/>
              </svg>
              <div style={{ fontSize: '9px', color: '#C9A84C66', letterSpacing: '0.2em' }}>МЕТАЛЛИЧЕСКАЯ</div>
            </div>
            <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.3em', marginBottom: '8px' }}>
              МИ-184272
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0', letterSpacing: '0.1em' }}>МОДУЛИ</div>
                <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.15em' }}>КОНГЛОМЕРАТ</div>
              </div>
              <div style={{ fontSize: '9px', color: '#C9A84C66' }}>РЕЗИДЕНТ</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {['Металл', 'NFC-метка', 'QR-код', 'Индивидуальный номер'].map(function(f) {
              return (
                <span key={f} style={{ fontSize: '10px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#C9A84C' }}>✓</span> {f}
                </span>
              )
            })}
          </div>
        </div>

        {/* Преимущества */}
        <div>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.15em', marginBottom: '16px', textAlign: 'center' }}>
            ВОЗМОЖНОСТИ ДЕРЖАТЕЛЕЙ КАРТЫ
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {BENEFITS.map(function(b) {
              return (
                <div key={b.title} style={{
                  background: '#12121A', border: '1px solid #1E1E2E',
                  borderRadius: '8px', padding: '20px',
                  display: 'flex', gap: '14px',
                }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '4px' }}>{b.title}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Уровни */}
        <div>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.15em', marginBottom: '16px', textAlign: 'center' }}>
            УРОВНИ УЧАСТИЯ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LEVELS.map(function(level, i) {
              return (
                <div key={level.name} style={{
                  background: '#12121A', border: '1px solid #1E1E2E',
                  borderLeft: '3px solid ' + level.color,
                  borderRadius: '0 8px 8px 0', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: level.color + '22', border: '1px solid ' + level.color + '55',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800, color: level.color, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: level.color }}>{level.name}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{level.desc}</div>
                  </div>
                  {level.min > 0 && (
                    <div style={{ fontSize: '11px', color: '#374151', flexShrink: 0 }}>
                      от {level.min.toLocaleString('ru')} TON
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Прозрачность */}
        <div style={{
          background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)',
          border: '1px solid #2A2A3E', borderRadius: '12px', padding: '28px',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.15em', marginBottom: '12px' }}>
            ПРИНЦИП ПРОЗРАЧНОСТИ
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#E8E8F0', margin: '0 0 12px' }}>
            100% открытость расходов
          </h2>
          <p style={{ fontSize: '13px', color: '#B0B0C0', lineHeight: 1.7, margin: '0 0 20px' }}>
            Каждый инвестированный TON отслеживается в цифровом дневнике объекта.
            Вы видите куда распределились средства — материалы, зарплаты, техника, логистика.
            Выписка для налоговой формируется автоматически и подтверждает статус квалифицированного инвестора.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Материалы',   icon: '🧱', color: '#C9A84C' },
              { label: 'Зарплаты',    icon: '👷', color: '#00D4AA' },
              { label: 'Техника',     icon: '🏗',  color: '#5B8CFF' },
              { label: 'Логистика',   icon: '🚛', color: '#A78BFA' },
            ].map(function(cat) {
              return (
                <div key={cat.label} style={{
                  background: '#0A0A0F', borderRadius: '8px', padding: '14px',
                  border: '1px solid ' + cat.color + '33', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{cat.icon}</div>
                  <div style={{ fontSize: '11px', color: cat.color, fontWeight: 600 }}>{cat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

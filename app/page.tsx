export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      color: '#E8E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <svg viewBox="0 0 48 48" width="64" height="64">
        <polygon
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill="none" stroke="#C9A84C" strokeWidth="1.5"
        />
        <circle cx="24" cy="24" r="5" fill="#C9A84C" />
      </svg>
      <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '0.2em', color: '#C9A84C' }}>
        МОДУЛИ
      </h1>
      <p style={{ color: '#6B7280', fontSize: '13px', letterSpacing: '0.1em' }}>
        ЦИФРОВАЯ ПЛАТФОРМА КОНГЛОМЕРАТА
      </p>
      <div style={{
        marginTop: '24px',
        padding: '12px 24px',
        border: '1px solid #1E1E2E',
        borderRadius: '8px',
        color: '#6B7280',
        fontSize: '12px',
      }}>
        Платформа запускается · Версия 0.1.0
      </div>
    </div>
  )
}

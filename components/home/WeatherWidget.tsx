
export function WeatherWidget() {
  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '12px' }}>
      <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>
        ПОГОДА НА ТЕРРИТОРИИ
      </div>
      <div style={{ fontSize: '11px', color: '#C9A84C', marginBottom: '8px' }}>Архангельская область</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6B7280" strokeWidth="1.5">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
        <span style={{ fontSize: '28px', fontWeight: 700 }}>−12°C</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {[
          { label: 'Влажность', value: '78%' },
          { label: 'Ветер',     value: '6 м/с' },
          { label: 'Давление',  value: '759 мм' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#6B7280' }}>{label}</div>
            <div style={{ fontSize: '11px', fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1E1E2E' }}>
        <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '8px' }}>
          БЫСТРЫЕ ДЕЙСТВИЯ
        </div>
        {[
          '+ Создать объект',
          '+ Добавить сотрудника',
          '+ Добавить технику',
          '+ Создать событие',
        ].map(action => (
          <button
            key={action}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '6px 8px', marginBottom: '4px',
              background: 'transparent', border: '1px solid #1E1E2E',
              borderRadius: '4px', color: '#C9A84C', fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}

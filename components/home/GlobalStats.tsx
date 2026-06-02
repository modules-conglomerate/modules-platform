
interface Stats {
  total_objects: number
  construction_count: number
  active_count: number
  planning_count: number
  total_employees: number
  total_equipment: number
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1
  const R = 28
  const C = 2 * Math.PI * R
  let offset = 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width="66" height="66" viewBox="0 0 66 66" style={{ flexShrink: 0 }}>
        <circle cx="33" cy="33" r={R} fill="none" stroke="#1E1E2E" strokeWidth="8" />
        {segments.map((seg, i) => {
          const pct = seg.value / total
          const dash = pct * C
          const rotation = (offset / total) * 360 - 90
          offset += seg.value
          return (
            <circle
              key={i}
              cx="33" cy="33" r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="8"
              strokeDasharray={`${dash} ${C - dash}`}
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '33px 33px' }}
            />
          )
        })}
        <text x="33" y="37" textAnchor="middle" fill="#E8E8F0" fontSize="11" fontWeight="600">
          {total}
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: '#6B7280', flex: 1 }}>{seg.label}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#E8E8F0' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GlobalStats({ stats }: { stats: Stats }) {
  const eqTotal = stats.total_equipment || 342
  const empTotal = stats.total_employees || 2148

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Объекты */}
      <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '12px' }}>
        <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '12px' }}>
          ГЛОБАЛЬНАЯ СТАТИСТИКА
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Всего объектов',  value: stats.total_objects },
            { label: 'Строится',         value: stats.construction_count },
            { label: 'Действующие',      value: stats.active_count },
            { label: 'Проектируются',    value: stats.planning_count },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: '9px', color: '#6B7280' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#E8E8F0', lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Техника */}
      <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '12px' }}>
        <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '8px' }}>ТЕХНИКА</div>
        <div style={{ fontSize: '9px', color: '#6B7280' }}>Всего единиц</div>
        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{eqTotal}</div>
        <DonutChart segments={[
          { label: 'Работает',        value: Math.round(eqTotal * 0.63), color: '#00D4AA' },
          { label: 'На объекте',      value: Math.round(eqTotal * 0.20), color: '#5B8CFF' },
          { label: 'На обслуживании', value: Math.round(eqTotal * 0.11), color: '#C9A84C' },
          { label: 'В резерве',       value: Math.round(eqTotal * 0.06), color: '#6B7280' },
        ]} />
      </div>

      {/* Сотрудники */}
      <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '12px' }}>
        <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '8px' }}>СОТРУДНИКИ</div>
        <div style={{ fontSize: '9px', color: '#6B7280' }}>Всего сотрудников</div>
        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{empTotal.toLocaleString('ru')}</div>
        <DonutChart segments={[
          { label: 'На объектах', value: Math.round(empTotal * 0.62), color: '#00D4AA' },
          { label: 'В пути',      value: Math.round(empTotal * 0.11), color: '#5B8CFF' },
          { label: 'В офисах',    value: Math.round(empTotal * 0.18), color: '#C9A84C' },
          { label: 'Недоступны',  value: Math.round(empTotal * 0.09), color: '#6B7280' },
        ]} />
      </div>
    </div>
  )
}

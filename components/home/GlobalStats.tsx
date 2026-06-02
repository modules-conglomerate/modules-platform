
import type { GlobalStats as Stats } from '@/lib/types'

interface Props { stats: Stats }

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let offset = 0
  const R = 30
  const C = 2 * Math.PI * R

  return (
    <div className="flex items-center gap-3">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={R} fill="none" stroke="#1E1E2E" strokeWidth="8" />
        {data.map((d, i) => {
          const pct = total > 0 ? d.value / total : 0
          const dash = pct * C
          const gap  = C - dash
          const el = (
            <circle
              key={i}
              cx="35" cy="35" r={R}
              fill="none"
              stroke={d.color}
              strokeWidth="8"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * C / 360 * 360}
              style={{ transform: `rotate(${offset * 360 / C - 90}deg)`, transformOrigin: '35px 35px' }}
            />
          )
          offset += dash
          return el
        })}
        <text x="35" y="39" textAnchor="middle" fill="#E8E8F0" fontSize="10" fontWeight="600">
          {total}
        </text>
      </svg>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span className="text-[10px] text-moduli-muted">{d.label}</span>
            <span className="text-[10px] font-medium ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GlobalStats({ stats }: Props) {
  return (
    <div className="space-y-4">
      {/* Объекты */}
      <div className="bg-moduli-surface border border-moduli-border rounded-lg p-3">
        <div className="text-[10px] text-moduli-muted tracking-wider mb-3">ГЛОБАЛЬНАЯ СТАТИСТИКА</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[
            { label: 'Всего объектов',  value: stats.total_objects },
            { label: 'Строится',         value: stats.construction_count },
            { label: 'Действующие',      value: stats.active_count },
            { label: 'Проектируются',    value: stats.planning_count },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-moduli-muted">{label}</div>
              <div className="text-xl font-bold text-moduli-text">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Техника */}
      <div className="bg-moduli-surface border border-moduli-border rounded-lg p-3">
        <div className="text-[10px] text-moduli-muted tracking-wider mb-2">ТЕХНИКА</div>
        <div className="text-[10px] text-moduli-muted mb-1">Всего единиц</div>
        <div className="text-2xl font-bold mb-3">{stats.total_equipment}</div>
        <DonutChart data={[
          { label: 'Работает',       value: Math.round(stats.total_equipment * 0.63), color: '#00D4AA' },
          { label: 'На объекте',     value: Math.round(stats.total_equipment * 0.20), color: '#5B8CFF' },
          { label: 'На обслуживании',value: Math.round(stats.total_equipment * 0.11), color: '#C9A84C' },
          { label: 'В резерве',      value: Math.round(stats.total_equipment * 0.06), color: '#6B7280' },
        ]} />
      </div>

      {/* Сотрудники */}
      <div className="bg-moduli-surface border border-moduli-border rounded-lg p-3">
        <div className="text-[10px] text-moduli-muted tracking-wider mb-2">СОТРУДНИКИ</div>
        <div className="text-[10px] text-moduli-muted mb-1">Всего сотрудников</div>
        <div className="text-2xl font-bold mb-3">{stats.total_employees.toLocaleString('ru')}</div>
        <DonutChart data={[
          { label: 'На объектах', value: Math.round(stats.total_employees * 0.62), color: '#00D4AA' },
          { label: 'В пути',      value: Math.round(stats.total_employees * 0.11), color: '#5B8CFF' },
          { label: 'В офисах',    value: Math.round(stats.total_employees * 0.18), color: '#C9A84C' },
          { label: 'Недоступны',  value: Math.round(stats.total_employees * 0.09), color: '#6B7280' },
        ]} />
      </div>
    </div>
  )
}

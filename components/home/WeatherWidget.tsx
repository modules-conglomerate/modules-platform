
import { Cloud } from 'lucide-react'

export function WeatherWidget() {
  return (
    <div className="bg-moduli-surface border border-moduli-border rounded-lg p-3">
      <div className="text-[10px] text-moduli-muted tracking-wider mb-3">ПОГОДА НА ТЕРРИТОРИИ</div>
      <div className="text-[11px] text-moduli-gold mb-2">Архангельская область</div>
      <div className="flex items-center gap-2 mb-3">
        <Cloud size={28} className="text-moduli-muted" />
        <span className="text-3xl font-bold">−12°C</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Влажность', value: '78%' },
          { label: 'Ветер',     value: '6 м/с' },
          { label: 'Давление',  value: '759 мм' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-[10px] text-moduli-muted">{label}</div>
            <div className="text-[11px] font-medium">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

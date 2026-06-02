
import Link from 'next/link'

interface Obj {
  id: string
  name: string
  slug: string
  status: string
  region: string | null
  progress_pct: number
  deadline: string | null
}

const STATUS: Record<string, { label: string; color: string }> = {
  construction: { label: 'Строится',      color: '#C9A84C' },
  active:       { label: 'Действует',     color: '#00D4AA' },
  planning:     { label: 'Проектируется', color: '#5B8CFF' },
  archived:     { label: 'Архив',         color: '#6B7280' },
}

export function ProjectsStatus({ objects }: { objects: Obj[] }) {
  const shown = objects.filter(o => o.status !== 'archived').slice(0, 5)

  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em' }}>СТАТУС ПРОЕКТОВ</h2>
        <Link href="/objects" style={{ fontSize: '11px', color: '#6B7280', textDecoration: 'none' }}>
          Все проекты →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {shown.map(obj => {
          const s = STATUS[obj.status] ?? STATUS.planning
          return (
            <Link
              key={obj.id}
              href={`/objects/${obj.slug}`}
              style={{
                background: '#0A0A0F', border: '1px solid #1E1E2E',
                borderRadius: '8px', padding: '12px', textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#E8E8F0', marginBottom: '2px', lineHeight: 1.3 }}>
                {obj.name}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '12px' }}>
                {obj.region}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: s.color, marginBottom: '4px' }}>
                {obj.progress_pct}%
              </div>
              <div style={{ width: '100%', height: '3px', background: '#1E1E2E', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ height: '3px', borderRadius: '2px', background: s.color, width: `${obj.progress_pct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: s.color }}>{s.label}</span>
                {obj.deadline && (
                  <span style={{ fontSize: '9px', color: '#6B7280' }}>
                    {new Date(obj.deadline).toLocaleDateString('ru', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

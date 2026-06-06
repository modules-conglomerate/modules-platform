import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60

export default async function AccessPage() {
  const supabase = createClient()

  const { data: objects } = await supabase
    .from('objects')
    .select('id, name, slug, status, region')
    .eq('is_public', true)
    .order('name')

  const ACCESS_LEVELS = [
    { code: 'У1', label: 'Базовый',           color: '#6B7280', desc: 'Офисы, административные помещения, переговорные' },
    { code: 'У2', label: 'Объектный',          color: '#4ADE80', desc: 'Стройплощадки, складские зоны, производственные площадки' },
    { code: 'У3', label: 'Технический',        color: '#5B8CFF', desc: 'Инженерные помещения, диспетчерские, лаборатории' },
    { code: 'У4', label: 'Промышленный',       color: '#C9A84C', desc: 'Тяжёлая техника, энергоустановки, высотные работы' },
    { code: 'У5', label: 'Критический',        color: '#A78BFA', desc: 'ЦОД назрОС, системы управления, диспетчерские центры' },
    { code: 'У6', label: 'Специальный',        color: '#EF4444', desc: 'Арктические станции, испытательные полигоны, спец. объекты' },
  ]

  const STATUS_COLOR: Record<string, string> = {
    construction: '#C9A84C',
    active:       '#00D4AA',
    planning:     '#5B8CFF',
    archived:     '#6B7280',
  }

  const STATUS_LABEL: Record<string, string> = {
    construction: 'Строится',
    active:       'Действует',
    planning:     'Проектируется',
    archived:     'Архив',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Допуски</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          СИСТЕМА ДОПУСКОВ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          Управление доступом на объекты конгломерата
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Уровни допуска */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>
            УРОВНИ ДОПУСКА
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {ACCESS_LEVELS.map(function(lvl) {
              return (
                <div key={lvl.code} style={{
                  background: '#0A0A0F', borderRadius: '8px', padding: '14px',
                  border: '1px solid ' + lvl.color + '33',
                  borderLeft: '3px solid ' + lvl.color,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: lvl.color }}>{lvl.code}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8E8F0' }}>{lvl.label}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280', lineHeight: 1.5 }}>{lvl.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Форма заявки */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '16px' }}>
            ПОДАТЬ ЗАЯВКУ НА ДОПУСК
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>ОБЪЕКТ</div>
              <select style={{
                width: '100%', padding: '10px 12px',
                background: '#0A0A0F', border: '1px solid #2A2A3E',
                borderRadius: '6px', color: '#E8E8F0', fontSize: '12px',
              }}>
                <option value="">Выберите объект</option>
                {objects?.map(function(obj) {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name} — {obj.region}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>УРОВЕНЬ ДОПУСКА</div>
              <select style={{
                width: '100%', padding: '10px 12px',
                background: '#0A0A0F', border: '1px solid #2A2A3E',
                borderRadius: '6px', color: '#E8E8F0', fontSize: '12px',
              }}>
                {ACCESS_LEVELS.map(function(lvl) {
                  return (
                    <option key={lvl.code} value={lvl.code}>
                      {lvl.code} — {lvl.label}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>ДАТА ПОСЕЩЕНИЯ</div>
              <input
                type="date"
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0A0A0F', border: '1px solid #2A2A3E',
                  borderRadius: '6px', color: '#E8E8F0', fontSize: '12px',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>ЦЕЛЬ ПОСЕЩЕНИЯ</div>
              <input
                placeholder="Инспекция, работы, экскурсия..."
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0A0A0F', border: '1px solid #2A2A3E',
                  borderRadius: '6px', color: '#E8E8F0', fontSize: '12px',
                }}
              />
            </div>
          </div>
          <button style={{
            padding: '11px 24px', background: '#C9A84C',
            border: 'none', borderRadius: '6px',
            color: '#0A0A0F', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.08em', cursor: 'pointer',
          }}>
            ПОДАТЬ ЗАЯВКУ
          </button>
        </div>

        {/* Объекты и их требования */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E' }}>
            <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>
              ОБЪЕКТЫ И ТРЕБОВАНИЯ К ДОПУСКУ
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', background: '#0D0D14', borderBottom: '1px solid #1E1E2E' }}>
            {['ОБЪЕКТ', 'РЕГИОН', 'СТАТУС', 'МИН. ДОПУСК'].map(function(h) {
              return (
                <div key={h} style={{ fontSize: '9px', color: '#374151', fontWeight: 700, letterSpacing: '0.1em' }}>{h}</div>
              )
            })}
          </div>
          {objects?.map(function(obj, i) {
            const sColor = STATUS_COLOR[obj.status] ?? '#6B7280'
            const minAccess = obj.status === 'active' ? ACCESS_LEVELS[1] : ACCESS_LEVELS[0]
            return (
              <div key={obj.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '10px 16px', alignItems: 'center',
                borderBottom: i < (objects.length - 1) ? '1px solid #1A1A2A' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}>
                <Link href={'/objects/' + obj.slug} style={{ fontSize: '12px', color: '#E8E8F0', textDecoration: 'none' }}>
                  {obj.name}
                </Link>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{obj.region}</div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: sColor, padding: '2px 8px', background: sColor + '18', borderRadius: '3px' }}>
                    {STATUS_LABEL[obj.status] ?? obj.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: minAccess.color }}>{minAccess.code}</span>
                  <span style={{ fontSize: '10px', color: '#6B7280', marginLeft: '6px' }}>{minAccess.label}</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

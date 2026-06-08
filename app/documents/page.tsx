import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const CAT_LABEL: Record<string, string> = {
  project:     'Проектная документация',
  engineering: 'Инженерные схемы',
  ecology:     'Экологическая документация',
  report:      'Отчёты',
  normative:   'Нормативы',
  science:     'Научные материалы',
  other:       'Прочее',
}

const CAT_ICON: Record<string, string> = {
  project:     '🏗',
  engineering: '⚙️',
  ecology:     '🌿',
  report:      '📊',
  normative:   '🛡',
  science:     '🔬',
  other:       '📄',
}

const CAT_COLOR: Record<string, string> = {
  project:     '#5B8CFF',
  engineering: '#C9A84C',
  ecology:     '#4ADE80',
  report:      '#A78BFA',
  normative:   '#E8C96B',
  science:     '#38BDF8',
  other:       '#6B7280',
}

const STATUS_LABEL: Record<string, string> = {
  pending:  'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён',
}

const STATUS_COLOR: Record<string, string> = {
  pending:  '#C9A84C',
  approved: '#00D4AA',
  rejected: '#EF4444',
}

export const revalidate = 60

export default async function DocumentsPage() {
  const supabase = createClient()

  const { data: objects } = await supabase
    .from('objects')
    .select('id, name, slug')
    .eq('is_public', true)
    .order('name')

  const { data: docs } = await supabase
    .from('documents')
    .select('*, objects(name, slug)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100)

  const byCategory: Record<string, typeof docs> = {}
  docs?.forEach(function(d) {
    if (!byCategory[d.category]) byCategory[d.category] = []
    byCategory[d.category]!.push(d)
  })

  const totalDocs = docs?.length ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>Главная</Link>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Документы</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
              ДОКУМЕНТЫ
            </h1>
            <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
              Открытая документация конгломерата · {totalDocs} документов
            </p>
          </div>
          <Link href="/documents/upload" style={{
            padding: '9px 18px', background: '#C9A84C', color: '#0A0A0F',
            borderRadius: '6px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', textDecoration: 'none',
          }}>
            + ЗАГРУЗИТЬ ДОКУМЕНТ
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Открытость */}
        <div style={{
          background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: '8px', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '18px' }}>🔓</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#00D4AA', marginBottom: '2px' }}>
              Принцип максимальной открытости
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              Любой может загрузить документ. После проверки модератором документ появляется в открытом доступе.
              Модерацию проводят сотрудники с уровнем допуска У3 и выше.
            </div>
          </div>
        </div>

        {/* Общая отчётность конгломерата */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0' }}>Отчётность конгломерата</span>
            </div>
          </div>
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Ежеквартальный отчёт Q1 2026', type: 'PDF', status: 'pending', date: '—' },
              { label: 'Годовой отчёт 2025',           type: 'PDF', status: 'pending', date: '—' },
              { label: 'Экологический отчёт 2025',     type: 'PDF', status: 'pending', date: '—' },
            ].map(function(r) {
              return (
                <div key={r.label} style={{
                  background: '#0A0A0F', borderRadius: '6px', padding: '12px',
                  border: '1px solid #1E1E2E',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#5B8CFF', padding: '2px 6px', background: '#5B8CFF18', borderRadius: '3px' }}>
                      {r.type}
                    </span>
                    <span style={{ fontSize: '9px', color: '#C9A84C' }}>Готовится</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#E8E8F0', marginBottom: '8px' }}>{r.label}</div>
                  <button style={{ width: '100%', padding: '6px', background: 'transparent', border: '1px solid #2A2A3E', borderRadius: '4px', color: '#6B7280', fontSize: '10px', cursor: 'pointer' }}>
                    Уведомить когда появится
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Фильтр по объекту */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em' }}>ОБЪЕКТ:</span>
          <Link href="/documents" style={{ padding: '4px 12px', background: '#C9A84C', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: '#0A0A0F', textDecoration: 'none' }}>
            Все
          </Link>
          {objects?.map(function(obj) {
            return (
              <Link key={obj.id} href={`/documents?object=${obj.slug}`} style={{
                padding: '4px 12px', background: 'transparent',
                border: '1px solid #2A2A3E', borderRadius: '20px',
                fontSize: '10px', color: '#6B7280', textDecoration: 'none',
              }}>
                {obj.name}
              </Link>
            )
          })}
        </div>

        {/* Документы по категориям */}
        {totalDocs > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {Object.entries(CAT_LABEL).map(function([cat, label]) {
              const catDocs = byCategory[cat] ?? []
              if (catDocs.length === 0) return null
              const color = CAT_COLOR[cat] ?? '#6B7280'
              return (
                <div key={cat} style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #1E1E2E', display: 'flex', alignItems: 'center', gap: '8px', background: color + '08' }}>
                    <span style={{ fontSize: '16px' }}>{CAT_ICON[cat]}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: color }}>{label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#374151' }}>{catDocs.length}</span>
                  </div>
                  <div style={{ padding: '8px' }}>
                    {catDocs.map(function(doc) {
                      return (
                        <div key={doc.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px', borderRadius: '6px', border: '1px solid transparent',
                          marginBottom: '4px',
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                              {doc.file_type && (
                                <span style={{ fontSize: '9px', fontWeight: 700, color: color, padding: '2px 6px', background: color + '18', borderRadius: '3px' }}>
                                  {doc.file_type.toUpperCase()}
                                </span>
                              )}
                              {doc.objects && (
                                <span style={{ fontSize: '9px', color: '#C9A84C' }}>{doc.objects.name}</span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: '#E8E8F0' }}>{doc.title}</div>
                            {doc.description && (
                              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{doc.description}</div>
                            )}
                          </div>
                          {doc.file_url ? (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{
                              padding: '5px 12px', background: 'transparent',
                              border: '1px solid ' + color + '44', borderRadius: '4px',
                              color: color, fontSize: '10px', textDecoration: 'none',
                              flexShrink: 0, marginLeft: '12px',
                            }}>
                              ↓ Скачать
                            </a>
                          ) : (
                            <span style={{ fontSize: '10px', color: '#374151', marginLeft: '12px' }}>Нет файла</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.2 }}>📄</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Документов пока нет</div>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '20px' }}>
              Загрузите первый документ — после проверки он появится здесь
            </div>
            <Link href="/documents/upload" style={{
              padding: '10px 24px', background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
              color: '#C9A84C', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
            }}>
              + ЗАГРУЗИТЬ ДОКУМЕНТ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

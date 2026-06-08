
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 0

export default async function ModeratePage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <div>Требуется авторизация</div>
          <Link href="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '12px' }}>Войти →</Link>
        </div>
      </div>
    )
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('access_level, full_name')
    .eq('user_id', user.id)
    .single()

  if (!employee || employee.access_level < 3) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚫</div>
          <div style={{ marginBottom: '8px' }}>Требуется уровень допуска У3+</div>
          <Link href="/documents" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '12px' }}>← К документам</Link>
        </div>
      </div>
    )
  }

  const { data: pending } = await supabase
    .from('documents')
    .select('*, objects(name, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: recent } = await supabase
    .from('documents')
    .select('*, objects(name, slug)')
    .in('status', ['approved', 'rejected'])
    .order('moderated_at', { ascending: false })
    .limit(20)

  const CAT_LABEL: Record<string, string> = {
    project: 'Проектная', engineering: 'Инженерная',
    ecology: 'Экология', report: 'Отчёт',
    normative: 'Норматив', science: 'Наука', other: 'Прочее',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/documents" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>← Документы</Link>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          МОДЕРАЦИЯ ДОКУМЕНТОВ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          {employee.full_name} · Уровень У{employee.access_level} · {pending?.length ?? 0} ожидают проверки
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Ожидают модерации */}
        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 6px #C9A84C' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.08em' }}>
                НА МОДЕРАЦИИ
              </span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#C9A84C' }}>{pending?.length ?? 0}</span>
          </div>

          {pending && pending.length > 0 ? (
            pending.map(function(doc, i) {
              return (
                <div key={doc.id} style={{
                  padding: '16px', borderBottom: i < pending.length - 1 ? '1px solid #1A1A2A' : 'none',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#5B8CFF', padding: '2px 8px', background: '#5B8CFF18', borderRadius: '3px' }}>
                        {doc.file_type ?? 'FILE'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#6B7280' }}>
                        {CAT_LABEL[doc.category] ?? doc.category}
                      </span>
                      {doc.objects && (
                        <span style={{ fontSize: '10px', color: '#C9A84C' }}>{doc.objects.name}</span>
                      )}
                      <span style={{ fontSize: '10px', color: '#374151', marginLeft: 'auto' }}>
                        {new Date(doc.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8E8F0', marginBottom: '4px' }}>{doc.title}</div>
                    {doc.description && (
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{doc.description}</div>
                    )}
                    {doc.file_name && (
                      <div style={{ fontSize: '10px', color: '#374151' }}>📎 {doc.file_name}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #2A2A3E', borderRadius: '6px', color: '#6B7280', fontSize: '11px', textDecoration: 'none', textAlign: 'center' }}>
                        👁 Просмотр
                      </a>
                    )}
                    <form action={`/api/documents/moderate`} method="POST" style={{ display: 'contents' }}>
                      <input type="hidden" name="id" value={doc.id} />
                      <input type="hidden" name="action" value="approve" />
                      <button type="submit" style={{ padding: '7px 14px', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.4)', borderRadius: '6px', color: '#00D4AA', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                        ✓ Одобрить
                      </button>
                    </form>
                    <form action={`/api/documents/moderate`} method="POST" style={{ display: 'contents' }}>
                      <input type="hidden" name="id" value={doc.id} />
                      <input type="hidden" name="action" value="reject" />
                      <button type="submit" style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#EF4444', fontSize: '11px', cursor: 'pointer' }}>
                        ✗ Отклонить
                      </button>
                    </form>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#374151', fontSize: '13px' }}>
              Нет документов на модерации
            </div>
          )}
        </div>

        {/* Недавно проверенные */}
        {recent && recent.length > 0 && (
          <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', letterSpacing: '0.08em' }}>НЕДАВНО ПРОВЕРЕННЫЕ</span>
            </div>
            {recent.map(function(doc, i) {
              const isApproved = doc.status === 'approved'
              return (
                <div key={doc.id} style={{
                  padding: '12px 16px', borderBottom: i < recent.length - 1 ? '1px solid #1A1A2A' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#E8E8F0', marginBottom: '2px' }}>{doc.title}</div>
                    <div style={{ fontSize: '10px', color: '#374151' }}>
                      {doc.objects?.name ?? 'Общий'} · {new Date(doc.created_at).toLocaleDateString('ru')}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '3px',
                    background: isApproved ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)',
                    color: isApproved ? '#00D4AA' : '#EF4444',
                    border: '1px solid ' + (isApproved ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)'),
                  }}>
                    {isApproved ? 'ОДОБРЕН' : 'ОТКЛОНЁН'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

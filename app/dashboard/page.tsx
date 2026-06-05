
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const LEVEL_LABEL: Record<string, { label: string; color: string }> = {
  resident:    { label: 'Резидент',           color: '#6B7280' },
  participant: { label: 'Участник',           color: '#4ADE80' },
  partner:     { label: 'Партнёр проекта',    color: '#5B8CFF' },
  guardian:    { label: 'Хранитель объекта',  color: '#C9A84C' },
  founder:     { label: 'Основатель проекта', color: '#EF4444' },
}

const ALLOC_LABEL: Record<string, string> = {
  materials:    'Материалы',
  salary:       'Зарплаты',
  equipment:    'Техника',
  logistics:    'Логистика',
  design:       'Проектирование',
  research:     'Исследования',
  construction: 'Строительство',
  other:        'Прочее',
}

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: card } = user ? await supabase
    .from('investor_cards')
    .select('*')
    .eq('user_id', user.id)
    .single() : { data: null }

  const { data: investments } = card ? await supabase
    .from('investments')
    .select('*, objects(name, slug), investment_allocations(*)')
    .eq('card_id', card.id)
    .order('invested_at', { ascending: false }) : { data: null }

  const totalTon = investments?.reduce(function(s, i) { return s + (i.amount_ton ?? 0) }, 0) ?? 0
  const totalRub = investments?.reduce(function(s, i) { return s + (i.amount_rub ?? 0) }, 0) ?? 0

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⬡</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#E8E8F0', marginBottom: '8px' }}>
            Личный кабинет
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
            Войдите в аккаунт чтобы получить доступ к инвестиционному дневнику
          </p>
          <Link href="/login" style={{
            display: 'block', padding: '12px 24px',
            background: '#C9A84C', color: '#0A0A0F',
            borderRadius: '8px', fontWeight: 700,
            fontSize: '13px', textDecoration: 'none',
            letterSpacing: '0.08em',
          }}>
            ВОЙТИ В СИСТЕМУ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
          ЛИЧНЫЙ КАБИНЕТ
        </h1>
        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
          {user.email}
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {card ? (
          <>
            {/* Карточка инвестора */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Профиль */}
              <div style={{
                background: 'linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)',
                border: '1px solid ' + (LEVEL_LABEL[card.level]?.color ?? '#6B7280') + '44',
                borderRadius: '12px', padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.15em', marginBottom: '6px' }}>
                      ИНВЕСТИЦИОННАЯ КАРТА МОДУЛИ
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#C9A84C', letterSpacing: '0.2em' }}>
                      {card.card_number}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                    padding: '5px 12px', borderRadius: '20px',
                    background: (LEVEL_LABEL[card.level]?.color ?? '#6B7280') + '22',
                    color: LEVEL_LABEL[card.level]?.color ?? '#6B7280',
                    border: '1px solid ' + (LEVEL_LABEL[card.level]?.color ?? '#6B7280') + '44',
                  }}>
                    {LEVEL_LABEL[card.level]?.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Участник с', value: new Date(card.activated_at).toLocaleDateString('ru', { month: 'long', year: 'numeric' }) },
                    { label: 'Всего вложено', value: totalTon.toFixed(2) + ' TON' },
                    { label: 'В рублях', value: totalRub > 0 ? totalRub.toLocaleString('ru') + ' ₽' : '—' },
                    { label: 'Транзакций', value: investments?.length ?? 0 },
                  ].map(function(stat) {
                    return (
                      <div key={stat.label}>
                        <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{stat.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8E8F0' }}>{stat.value}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Быстрые действия */}
              <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '0.12em', marginBottom: '14px' }}>
                  ДЕЙСТВИЯ
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: '📊 Сформировать выписку для налоговой', color: '#C9A84C', primary: true },
                    { label: '⬡ Поддержать объект через TON',         color: '#5B8CFF', primary: false },
                    { label: '🎫 Мероприятия для держателей карт',     color: '#A78BFA', primary: false },
                    { label: '📋 История всех транзакций',             color: '#00D4AA', primary: false },
                  ].map(function(action) {
                    return (
                      <button key={action.label} style={{
                        width: '100%', padding: '11px 14px', textAlign: 'left',
                        background: action.primary ? action.color + '18' : 'transparent',
                        border: '1px solid ' + action.color + (action.primary ? '44' : '22'),
                        borderRadius: '6px', color: action.primary ? action.color : '#B0B0C0',
                        fontSize: '12px', fontWeight: action.primary ? 700 : 400,
                        cursor: 'pointer',
                      }}>
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* История инвестиций */}
            <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>ИСТОРИЯ ИНВЕСТИЦИЙ</span>
                <span style={{ fontSize: '11px', color: '#C9A84C' }}>{investments?.length ?? 0} транзакций</span>
              </div>

              {investments && investments.length > 0 ? (
                investments.map(function(inv, i) {
                  const allocs = inv.investment_allocations ?? []
                  return (
                    <div key={inv.id} style={{
                      padding: '16px',
                      borderBottom: i < investments.length - 1 ? '1px solid #1A1A2A' : 'none',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8E8F0', marginBottom: '3px' }}>
                            {inv.objects?.name ?? 'Объект'}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6B7280' }}>
                            {new Date(inv.invested_at).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {inv.tx_hash && (
                              <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: '#374151' }}>
                                #{inv.tx_hash.slice(0, 8)}...
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#C9A84C' }}>
                            {inv.amount_ton} TON
                          </div>
                          {inv.amount_rub && (
                            <div style={{ fontSize: '11px', color: '#6B7280' }}>
                              ≈ {inv.amount_rub.toLocaleString('ru')} ₽
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Распределение */}
                      {allocs.length > 0 && (
                        <div>
                          <div style={{ fontSize: '9px', color: '#374151', letterSpacing: '0.1em', marginBottom: '6px' }}>
                            РАСПРЕДЕЛЕНИЕ СРЕДСТВ
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {allocs.map(function(alloc: any) {
                              const pct = Math.round((alloc.amount_ton / inv.amount_ton) * 100)
                              return (
                                <div key={alloc.id} style={{
                                  padding: '4px 10px', borderRadius: '4px',
                                  background: '#0A0A0F', border: '1px solid #2A2A3E',
                                  fontSize: '10px', color: '#B0B0C0',
                                }}>
                                  {ALLOC_LABEL[alloc.category] ?? alloc.category}
                                  <span style={{ color: '#C9A84C', fontWeight: 700, marginLeft: '4px' }}>
                                    {pct}%
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#374151' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>Транзакций пока нет</div>
                  <div style={{ fontSize: '11px' }}>
                    Поддержите объект через кнопку «Усилить развитие» на странице объекта
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Нет карты */
          <div style={{
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '12px', padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⬡</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#E8E8F0', marginBottom: '8px' }}>
              У вас нет инвестиционной карты
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
              Получите карту Модули чтобы поддерживать объекты,<br />
              участвовать в мероприятиях и отслеживать инвестиции
            </p>
            <Link href="/invest" style={{
              padding: '12px 28px', background: '#C9A84C',
              color: '#0A0A0F', borderRadius: '8px',
              fontWeight: 800, fontSize: '13px',
              letterSpacing: '0.1em', textDecoration: 'none',
            }}>
              ПОЛУЧИТЬ КАРТУ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

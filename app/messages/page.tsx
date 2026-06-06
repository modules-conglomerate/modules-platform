
import { createClient } from '@/lib/supabase/server'

const MSG_TYPES: Record<string, { label: string; color: string; icon: string }> = {
  salary:   { label: 'Зарплата',    color: '#00D4AA', icon: '💰' },
  access:   { label: 'Допуск',      color: '#5B8CFF', icon: '🔑' },
  task:     { label: 'Задание',     color: '#C9A84C', icon: '📋' },
  system:   { label: 'Система',     color: '#6B7280', icon: '⚙️' },
  ecology:  { label: 'Экология',    color: '#4ADE80', icon: '🌿' },
  manager:  { label: 'Руководитель',color: '#A78BFA', icon: '👤' },
  contract: { label: 'Контракт',    color: '#E8C96B', icon: '⬡' },
}

export const revalidate = 30

export default async function MessagesPage() {
  const supabase = createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('*, objects(name, slug)')
    .order('created_at', { ascending: false })
    .limit(50)

  const unreadCount = messages?.filter(function(m) { return !m.is_read }).length ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#374151', fontSize: '11px' }}>Главная</span>
          <span style={{ color: '#374151', fontSize: '11px' }}>/</span>
          <span style={{ color: '#C9A84C', fontSize: '11px' }}>Сообщения</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 4px' }}>
              СООБЩЕНИЯ
            </h1>
            <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
              {unreadCount > 0 ? unreadCount + ' непрочитанных' : 'Все прочитаны'} · {messages?.length ?? 0} всего
            </p>
          </div>
          <button style={{
            padding: '8px 16px', background: 'transparent',
            border: '1px solid #2A2A3E', borderRadius: '6px',
            color: '#6B7280', fontSize: '11px', cursor: 'pointer',
          }}>
            Отметить все как прочитанные
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <button style={{ padding: '5px 14px', background: '#C9A84C', border: 'none', borderRadius: '20px', color: '#0A0A0F', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
            Все
          </button>
          {Object.entries(MSG_TYPES).map(function([key, type]) {
            return (
              <button key={key} style={{
                padding: '5px 12px', background: 'transparent',
                border: '1px solid ' + type.color + '44',
                borderRadius: '20px', color: type.color,
                fontSize: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            )
          })}
        </div>

        {messages && messages.length > 0 ? (
          messages.map(function(msg) {
            const typeInfo = MSG_TYPES[msg.type] ?? MSG_TYPES.system
            return (
              <div key={msg.id} style={{
                background: msg.is_read ? '#12121A' : '#15151F',
                border: '1px solid ' + (msg.is_read ? '#1E1E2E' : typeInfo.color + '33'),
                borderLeft: '3px solid ' + (msg.is_read ? '#2A2A3E' : typeInfo.color),
                borderRadius: '0 8px 8px 0', padding: '14px 16px',
                display: 'flex', gap: '14px', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                  background: typeInfo.color + '18', border: '1px solid ' + typeInfo.color + '33',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  {typeInfo.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                        color: typeInfo.color, padding: '2px 8px',
                        background: typeInfo.color + '18', borderRadius: '3px',
                      }}>
                        {typeInfo.label.toUpperCase()}
                      </span>
                      {!msg.is_read && (
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: typeInfo.color, display: 'inline-block',
                          boxShadow: '0 0 6px ' + typeInfo.color,
                        }} />
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: '#374151' }}>
                      {new Date(msg.created_at).toLocaleDateString('ru', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: msg.is_read ? 400 : 600, color: '#E8E8F0', marginBottom: '4px' }}>
                    {msg.title}
                  </div>
                  {msg.body && (
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                      {msg.body}
                    </div>
                  )}
                  {msg.objects && (
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#C9A84C' }}>
                      Объект: {msg.objects.name}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div style={{
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '8px', padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.2 }}>💬</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Сообщений нет</div>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              Уведомления о зарплате, допусках и заданиях появятся здесь
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

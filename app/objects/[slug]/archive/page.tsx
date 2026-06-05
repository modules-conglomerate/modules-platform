import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props { params: { slug: string } }

const SEASON_LABEL: Record<string, string> = {
  spring: '🌱 Весна',
  summer: '☀️ Лето',
  autumn: '🍂 Осень',
  winter: '❄️ Зима',
}

const SEASON_COLOR: Record<string, string> = {
  spring: '#4ADE80',
  summer: '#E8C96B',
  autumn: '#C9A84C',
  winter: '#5B8CFF',
}

export default async function ArchivePage({ params }: Props) {
  const supabase = createClient()

  const { data: obj } = await supabase
    .from('objects')
    .select('id, name, slug, region')
    .eq('slug', params.slug)
    .single()

  if (!obj) notFound()

  const { data: archive } = await supabase
    .from('seasonal_archive')
    .select('*')
    .eq('object_id', obj.id)
    .order('year', { ascending: false })

  const byYear: Record<number, typeof archive> = {}
  archive?.forEach(function(a) {
    if (!byYear[a.year]) byYear[a.year] = []
    byYear[a.year]!.push(a)
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>Главная</Link>
        <span style={{ color: '#374151' }}>/</span>
        <Link href="/objects" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>Объекты</Link>
        <span style={{ color: '#374151' }}>/</span>
        <Link href={'/objects/' + obj.slug} style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>{obj.name}</Link>
        <span style={{ color: '#374151' }}>/</span>
        <span style={{ color: '#E8C96B', fontSize: '12px' }}>Сезонный архив</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
            📷 Сезонный архив
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            {obj.name} · {obj.region} · {archive?.length ?? 0} записей
          </p>
        </div>

        {archive && archive.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries(byYear).map(function([year, seasons]) {
              return (
                <div key={year}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#C9A84C' }}>{year}</span>
                    <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {seasons?.map(function(s) {
                      const color = SEASON_COLOR[s.season] ?? '#6B7280'
                      const photos = Array.isArray(s.photos) ? s.photos : []
                      return (
                        <div key={s.id} style={{
                          background: '#12121A', border: '1px solid #1E1E2E',
                          borderTop: '2px solid ' + color, borderRadius: '8px', overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '120px', background: color + '11',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px',
                          }}>
                            {photos.length > 0 ? (
                              <img src={photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ opacity: 0.4 }}>
                                {s.season === 'spring' ? '🌱' : s.season === 'summer' ? '☀️' : s.season === 'autumn' ? '🍂' : '❄️'}
                              </span>
                            )}
                          </div>
                          <div style={{ padding: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: color, marginBottom: '6px' }}>
                              {SEASON_LABEL[s.season] ?? s.season}
                            </div>
                            {s.summary && (
                              <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 8px', lineHeight: 1.5 }}>
                                {s.summary}
                              </p>
                            )}
                            <div style={{ fontSize: '10px', color: '#374151' }}>
                              {photos.length} фото
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            background: '#12121A', border: '1px solid #1E1E2E',
            borderRadius: '8px', padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📷</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Архив пуст</div>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              Фотоматериалы появятся по мере развития объекта
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
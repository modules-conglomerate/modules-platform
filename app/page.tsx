import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MapSection } from '@/components/home/MapSection'
import { EventsFeed } from '@/components/home/EventsFeed'
import { ProjectsStatus } from '@/components/home/ProjectsStatus'
import { GlobalStats } from '@/components/home/GlobalStats'
import { WeatherWidget } from '@/components/home/WeatherWidget'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: objects },
    { data: events },
    { count: totalEmployees },
    { count: totalEquipment },
  ] = await Promise.all([
    supabase.from('objects').select('*').eq('is_public', true).order('created_at', { ascending: false }),
    supabase.from('object_events').select('*, objects(name, slug)').eq('is_public', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('equipment').select('*', { count: 'exact', head: true }),
  ])

  const stats = {
    total_objects:      objects?.length ?? 0,
    construction_count: objects?.filter(o => o.status === 'construction').length ?? 0,
    active_count:       objects?.filter(o => o.status === 'active').length ?? 0,
    planning_count:     objects?.filter(o => o.status === 'planning').length ?? 0,
    total_employees:    totalEmployees ?? 2148,
    total_equipment:    totalEquipment ?? 342,
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#0A0A0F',
    }}>

      {/* Левый сайдбар — фиксированная ширина */}
      <Sidebar />

      {/* Правая часть — топбар + контент */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <Topbar />

        {/* Скроллируемый контент */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
        }}>

          {/* Центральная зона */}
          <main style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <MapSection objects={objects ?? []} />
            <EventsFeed events={events ?? []} />
            <ProjectsStatus objects={objects ?? []} />
          </main>

          {/* Правая панель */}
          <aside style={{
            width: '280px',
            minWidth: '280px',
            flexShrink: 0,
            overflowY: 'auto',
            borderLeft: '1px solid #1E1E2E',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <GlobalStats stats={stats} />
            <WeatherWidget />
          </aside>

        </div>
      </div>
    </div>
  )
}

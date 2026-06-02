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
    supabase
      .from('objects')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('object_events')
      .select('*, objects(name, slug)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('employees')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true }),
  ])

  const stats = {
    total_objects:      objects?.length ?? 0,
    construction_count: objects?.filter(o => o.status === 'construction').length ?? 0,
    active_count:       objects?.filter(o => o.status === 'active').length ?? 0,
    planning_count:     objects?.filter(o => o.status === 'planning').length ?? 0,
    total_employees:    totalEmployees ?? 0,
    total_equipment:    totalEquipment ?? 0,
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0A0A0F' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            <MapSection objects={objects ?? []} />
            <EventsFeed events={events ?? []} />
            <ProjectsStatus objects={objects ?? []} />
          </main>
          <aside className="w-72 flex-shrink-0 overflow-y-auto border-l p-4 space-y-4" style={{ borderColor: '#1E1E2E' }}>
            <GlobalStats stats={stats} />
            <WeatherWidget />
          </aside>
        </div>
      </div>
    </div>
  )
}

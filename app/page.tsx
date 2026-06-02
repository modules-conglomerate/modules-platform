
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MapSection } from '@/components/home/MapSection'
import { EventsFeed } from '@/components/home/EventsFeed'
import { ProjectsStatus } from '@/components/home/ProjectsStatus'
import { GlobalStats } from '@/components/home/GlobalStats'
import { WeatherWidget } from '@/components/home/WeatherWidget'
import type { ModuliObject, ObjectEvent } from '@/lib/types'

export const revalidate = 60 // ISR — обновляем каждую минуту

export default async function HomePage() {
  const supabase = createClient()

  // Параллельные запросы
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
      .limit(10),
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
    <div className="flex h-screen overflow-hidden bg-moduli-bg">
      {/* Левый сайдбар */}
      <Sidebar />

      {/* Основной контент */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <div className="flex flex-1 overflow-hidden">
          {/* Центральная зона */}
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            <MapSection objects={objects as ModuliObject[] ?? []} />
            <EventsFeed events={events as ObjectEvent[] ?? []} />
            <ProjectsStatus objects={objects as ModuliObject[] ?? []} />
          </main>

          {/* Правая панель */}
          <aside className="w-72 flex-shrink-0 overflow-y-auto border-l border-moduli-border p-4 space-y-4">
            <GlobalStats stats={stats} />
            <WeatherWidget />
          </aside>
        </div>
      </div>
    </div>
  )
}

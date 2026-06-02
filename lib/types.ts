
export type ObjectStatus = 'planning' | 'construction' | 'active' | 'archived'
export type ObjectType =
  | 'production' | 'transport' | 'science'
  | 'residential' | 'entertainment' | 'sport'
  | 'culture' | 'infrastructure'

export interface ModuliObject {
  id: string
  name: string
  slug: string
  type: ObjectType
  status: ObjectStatus
  region: string | null
  description: string | null
  area_m2: number | null
  progress_pct: number
  deadline: string | null
  lat: number | null
  lng: number | null
  cover_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export type EventType =
  | 'construction' | 'delivery' | 'research'
  | 'employee' | 'documentation' | 'ecology'
  | 'completion' | 'announcement'

export interface ObjectEvent {
  id: string
  object_id: string | null
  event_type: EventType
  title: string
  description: string | null
  media_url: string | null
  region: string | null
  is_public: boolean
  created_at: string
  objects?: { name: string; slug: string } | null
}

export interface Equipment {
  id: string
  serial_number: string | null
  model: string
  category: string
  status: 'working' | 'on_site' | 'maintenance' | 'reserve'
  object_id: string | null
  photo_url: string | null
}

export interface Employee {
  id: string
  full_name: string
  position: string | null
  specialization: string | null
  access_level: number
  status: 'on_site' | 'in_transit' | 'working' | 'in_office' | 'unavailable'
  current_object: string | null
  photo_url: string | null
}

export interface GlobalStats {
  total_objects: number
  construction_count: number
  active_count: number
  planning_count: number
  total_employees: number
  total_equipment: number
}

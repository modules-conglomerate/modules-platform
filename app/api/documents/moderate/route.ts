
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: employee } = await supabase
    .from('employees')
    .select('access_level')
    .eq('user_id', user.id)
    .single()

  if (!employee || employee.access_level < 3) {
    return NextResponse.json({ error: 'Insufficient access level' }, { status: 403 })
  }

  const formData = await req.formData()
  const id = formData.get('id') as string
  const action = formData.get('action') as string

  const newStatus = action === 'approve' ? 'approved' : 'rejected'

  const { error } = await supabase
    .from('documents')
    .update({
      status:       newStatus,
      is_public:    newStatus === 'approved',
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.redirect(new URL('/documents/moderate', req.url))
}

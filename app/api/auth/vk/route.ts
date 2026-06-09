
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token    = searchParams.get('token')
  const userId   = searchParams.get('user_id')
  const email    = searchParams.get('email') || ''
  const code     = searchParams.get('code')
  const deviceId = searchParams.get('device_id') || ''

  const EDGE = 'https://plgesxqkponmwmghvpin.supabase.co/functions/v1/vk-auth'
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  let url = EDGE
  if (token && userId) {
    url += '?token=' + encodeURIComponent(token) + '&user_id=' + userId + '&email=' + encodeURIComponent(email)
  } else if (code) {
    url += '?code=' + encodeURIComponent(code) + '&device_id=' + encodeURIComponent(deviceId)
  } else {
    return NextResponse.redirect(new URL('/login?error=no_params', req.url))
  }

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + ANON,
        'apikey': ANON,
      },
    })

    const data = await res.json()

    if (data.magic_link) {
      return NextResponse.redirect(data.magic_link)
    }

    return NextResponse.redirect(
      new URL('/login?error=' + encodeURIComponent(data.error || 'unknown'), req.url)
    )
  } catch (e: any) {
    return NextResponse.redirect(
      new URL('/login?error=server_error', req.url)
    )
  }
}

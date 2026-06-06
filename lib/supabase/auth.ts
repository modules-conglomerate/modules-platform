export async function signInWithVK() {
  const VK_APP_ID = '54625282'
  const REDIRECT_URI = `${window.location.origin}/auth/vk/callback`

  const vkUrl = new URL('https://oauth.vk.com/authorize')
  vkUrl.searchParams.set('client_id', VK_APP_ID)
  vkUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  vkUrl.searchParams.set('scope', 'email')
  vkUrl.searchParams.set('response_type', 'code')
  vkUrl.searchParams.set('v', '5.131')

  window.location.href = vkUrl.toString()
}

export async function signOut() {
  const { createBrowserClient } = await import('@supabase/ssr')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.auth.signOut()
  window.location.href = '/'
}

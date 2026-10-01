'use client'

import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  return <button className="button secondary" onClick={logout}>로그아웃</button>
}

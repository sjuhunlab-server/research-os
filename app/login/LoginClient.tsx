'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function oauth(provider: 'google' | 'github') {
    setBusy(true); setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    })
    if (error) { setMessage(error.message); setBusy(false) }
  }

  async function emailAuth(mode: 'login' | 'signup') {
    setBusy(true); setMessage('')
    const supabase = createClient()
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (result.error) setMessage(result.error.message)
    else if (mode === 'signup' && !result.data.session) setMessage('가입 확인 메일을 확인해 주세요.')
    else window.location.href = '/dashboard'
    setBusy(false)
  }

  return (
    <div className="login-card stack">
      <div>
        <h1 className="title">Research OS</h1>
        <p className="subtitle">각 연구자의 아이디어와 연구 기록을 분리해 저장합니다.</p>
      </div>
      <button className="button" disabled={busy} onClick={() => oauth('google')}>Google로 계속</button>
      <button className="button secondary" disabled={busy} onClick={() => oauth('github')}>GitHub로 계속</button>
      <div className="divider" />
      <div className="small muted">Google OAuth 설정 전에도 이메일/비밀번호로 테스트할 수 있습니다.</div>
      <input className="input" type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="비밀번호 (6자 이상)" value={password} onChange={e => setPassword(e.target.value)} />
      <div className="row">
        <button className="button" disabled={busy} onClick={() => emailAuth('login')}>로그인</button>
        <button className="button secondary" disabled={busy} onClick={() => emailAuth('signup')}>계정 만들기</button>
      </div>
      {message && <div className="notice">{message}</div>}
    </div>
  )
}

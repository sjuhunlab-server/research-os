import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { requireUser } from '@/lib/auth'

export default async function AdminPage(){
 const {supabase,profile}=await requireUser(); if(profile?.role!=='admin')redirect('/dashboard')
 const {data,error}=await supabase.rpc('admin_overview'); const o=data||{}
 return <AppShell role={profile?.role} email={profile?.email}><div className="topbar"><div><h1 className="title">Admin</h1><p className="subtitle">연구 원문은 읽지 않고 시스템 상태의 집계만 봅니다.</p></div></div>{error&&<div className="error">{error.message}</div>}<div className="grid grid-4"><div className="card"><div className="muted">Users</div><div className="metric">{o.users??0}</div></div><div className="card"><div className="muted">Projects</div><div className="metric">{o.projects??0}</div></div><div className="card"><div className="muted">Ideas</div><div className="metric">{o.ideas??0}</div></div><div className="card"><div className="muted">Logs</div><div className="metric">{o.logs??0}</div></div></div><div style={{height:16}}/><div className="grid grid-3"><div className="card"><h2>AI Jobs</h2><div className="kv"><span>Queued</span><strong>{o.ai_jobs?.queued??0}</strong><span>Running</span><strong>{o.ai_jobs?.running??0}</strong><span>Failed</span><strong>{o.ai_jobs?.failed??0}</strong></div></div><div className="card"><h2>Workers</h2><div className="kv"><span>Online</span><strong>{o.workers?.online??0}</strong><span>Registered</span><strong>{o.workers?.registered??0}</strong></div></div><div className="card"><h2>Privacy</h2><div className="muted small">이 화면은 집계값만 반환하는 DB 함수를 사용합니다. 관리자는 사용자 Ideas/Logs/Context의 원문을 기본적으로 조회할 수 없습니다.</div></div></div></AppShell>
}

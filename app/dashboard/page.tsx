import AppShell from '@/components/AppShell'
import { requireUser } from '@/lib/auth'

export default async function DashboardPage() {
  const { supabase, profile } = await requireUser()
  const [projects, ideas, logs, jobs, devices] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('ideas').select('*', { count: 'exact', head: true }),
    supabase.from('research_logs').select('*', { count: 'exact', head: true }),
    supabase.from('ai_jobs').select('*', { count: 'exact', head: true }).eq('status', 'queued'),
    supabase.from('worker_devices').select('id,name,last_seen_at,revoked_at').is('revoked_at', null),
  ])
  const online = (devices.data || []).filter(d => d.last_seen_at && Date.now() - new Date(d.last_seen_at).getTime() < 90000).length

  return (
    <AppShell role={profile?.role} email={profile?.email}>
      <div className="topbar"><div><h1 className="title">Dashboard</h1><p className="subtitle">내 연구 기록과 Claude worker 상태를 한눈에 봅니다.</p></div></div>
      <div className="grid grid-4">
        <div className="card"><div className="muted">Projects</div><div className="metric">{projects.count ?? 0}</div></div>
        <div className="card"><div className="muted">Ideas</div><div className="metric">{ideas.count ?? 0}</div></div>
        <div className="card"><div className="muted">Research Logs</div><div className="metric">{logs.count ?? 0}</div></div>
        <div className="card"><div className="muted">AI Queue</div><div className="metric">{jobs.count ?? 0}</div></div>
      </div>
      <div style={{height:16}} />
      <div className="card">
        <h2>Claude Code Worker</h2>
        <div className="row"><span className={`badge ${online ? 'good' : 'warn'}`}>{online ? `${online} ONLINE` : 'OFFLINE'}</span><span className="muted small">Settings에서 각 연구자 본인의 worker token을 발급할 수 있습니다.</span></div>
      </div>
    </AppShell>
  )
}

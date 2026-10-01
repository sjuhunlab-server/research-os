import AppShell from '@/components/AppShell'
import WorkerManager from './WorkerManager'
import AccountLinker from './AccountLinker'
import { requireUser } from '@/lib/auth'

export default async function SettingsPage(){
  const {supabase,profile,user}=await requireUser()
  const {data:devices}=await supabase.from('worker_devices').select('id,name,last_seen_at,revoked_at,created_at').order('created_at',{ascending:false})
  return <AppShell role={profile?.role} email={profile?.email}>
    <div className="topbar"><div><h1 className="title">Settings</h1><p className="subtitle">내 Claude Code worker와 계정 상태를 관리합니다.</p></div></div>
    <div className="grid grid-2">
      <div className="stack"><div className="card stack"><h2>Account</h2><div className="kv"><span className="muted">Email</span><span>{profile?.email}</span><span className="muted">Role</span><span>{profile?.role}</span></div><div className="small muted">Google/GitHub 로그인은 Supabase Auth에서 관리됩니다. 연구 데이터 접근 권한과는 별개입니다.</div></div><AccountLinker providers={(user.app_metadata?.providers || []) as string[]} /></div>
      <WorkerManager initialDevices={devices||[]} />
    </div>
  </AppShell>
}

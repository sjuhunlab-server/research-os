import AppShell from '@/components/AppShell'
import ResearchLogManager from './ResearchLogManager'
import { requireUser } from '@/lib/auth'

export default async function ResearchLogPage(){
 const {supabase,user,profile}=await requireUser(); const [{data:logs},{data:projects}]=await Promise.all([supabase.from('research_logs').select('*,projects(name)').order('created_at',{ascending:false}),supabase.from('projects').select('id,name').order('name')])
 return <AppShell role={profile?.role} email={profile?.email}><div className="topbar"><div><h1 className="title">Research Log</h1><p className="subtitle">오늘 한 실험, 해석, 실패와 다음 할 일을 기록합니다.</p></div></div><ResearchLogManager userId={user.id} initialLogs={logs||[]} projects={projects||[]} /></AppShell>
}

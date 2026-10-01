import AppShell from '@/components/AppShell'
import IdeaManager from './IdeaManager'
import { requireUser } from '@/lib/auth'

export default async function IdeasPage() {
  const { supabase, user, profile } = await requireUser()
  const [{ data: ideas }, { data: projects }] = await Promise.all([
    supabase.from('ideas').select('id,title,raw_text,status,project_id,created_at').order('created_at',{ascending:false}),
    supabase.from('projects').select('id,name').order('name'),
  ])
  return <AppShell role={profile?.role} email={profile?.email}>
    <div className="topbar"><div><h1 className="title">Ideas</h1><p className="subtitle">떠오른 생각을 원문 그대로 저장합니다. AI는 버튼을 누를 때만 동작합니다.</p></div></div>
    <IdeaManager userId={user.id} initialIdeas={ideas||[]} projects={projects||[]} />
  </AppShell>
}

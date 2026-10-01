import AppShell from '@/components/AppShell'
import ProjectManager from './ProjectManager'
import { requireUser } from '@/lib/auth'

export default async function ProjectsPage() {
  const { supabase, user, profile } = await requireUser()
  const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
  return (
    <AppShell role={profile?.role} email={profile?.email}>
      <div className="topbar"><div><h1 className="title">Projects</h1><p className="subtitle">연구 단위별로 아이디어와 Context를 묶습니다.</p></div></div>
      <ProjectManager userId={user.id} initialProjects={projects || []} />
    </AppShell>
  )
}

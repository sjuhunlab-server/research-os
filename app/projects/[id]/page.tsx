import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import ProjectContextEditor from './ProjectContextEditor'
import { requireUser } from '@/lib/auth'

export default async function ProjectDetailPage({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params
  const { supabase, user, profile } = await requireUser()
  const { data: project } = await supabase.from('projects').select('*').eq('id',id).single()
  if (!project) notFound()
  const { data: context } = await supabase.from('research_contexts').select('*').eq('project_id', id).maybeSingle()
  const { data: ideas } = await supabase.from('ideas').select('id,title,status,created_at').eq('project_id',id).order('created_at',{ascending:false}).limit(10)
  const { data: logs } = await supabase.from('research_logs').select('id,title,created_at').eq('project_id',id).order('created_at',{ascending:false}).limit(10)
  return <AppShell role={profile?.role} email={profile?.email}>
    <div className="topbar"><div><h1 className="title">{project.name}</h1><p className="subtitle">{project.description}</p></div></div>
    <div className="grid grid-2">
      <ProjectContextEditor userId={user.id} projectId={id} initialContent={context?.content || ''} />
      <div className="stack">
        <div className="card"><h2>최근 Ideas</h2><div className="list">{(ideas||[]).map(i=><a className="list-item" href={`/ideas/${i.id}`} key={i.id}>{i.title}</a>)}{!ideas?.length && <div className="muted">없음</div>}</div></div>
        <div className="card"><h2>최근 Research Logs</h2><div className="list">{(logs||[]).map(l=><div className="list-item" key={l.id}>{l.title}</div>)}{!logs?.length && <div className="muted">없음</div>}</div></div>
      </div>
    </div>
  </AppShell>
}

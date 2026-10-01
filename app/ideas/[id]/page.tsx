import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import AiPanel from './AiPanel'
import { requireUser } from '@/lib/auth'

export default async function IdeaDetailPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {supabase,user,profile}=await requireUser()
 const {data:idea}=await supabase.from('ideas').select('*,projects(name)').eq('id',id).single(); if(!idea)notFound()
 const {data:jobs}=await supabase.from('ai_jobs').select('*').eq('idea_id',id).order('created_at',{ascending:false})
 return <AppShell role={profile?.role} email={profile?.email}>
  <div className="topbar"><div><h1 className="title">{idea.title}</h1><p className="subtitle">{idea.projects?.name || '프로젝트 미지정'}</p></div></div>
  <div className="grid grid-2">
   <div className="card"><h2>Original Idea</h2><pre className="output">{idea.raw_text}</pre><div className="small muted">원문은 AI 결과로 덮어쓰지 않습니다.</div></div>
   <AiPanel userId={user.id} ideaId={id} initialJobs={jobs||[]} />
  </div>
 </AppShell>
}

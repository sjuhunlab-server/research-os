'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Job={id:string;job_type:string;status:string;result_md:string|null;error_message:string|null;created_at:string}
const actions=[['summarize','AI로 아이디어 정리'],['compare','현재 연구와 비교'],['develop','아이디어 발전'],['experiment_plan','실험 계획 생성'],['claude_prompt','Claude Code Prompt'],['codex_prompt','Codex Prompt']] as const

export default function AiPanel({userId,ideaId,initialJobs}:{userId:string;ideaId:string;initialJobs:Job[]}){
 const [jobs,setJobs]=useState(initialJobs); const [busy,setBusy]=useState(''); const supabase=useMemo(()=>createClient(),[])
 useEffect(()=>{ const ch=supabase.channel(`jobs-${ideaId}`).on('postgres_changes',{event:'*',schema:'public',table:'ai_jobs',filter:`idea_id=eq.${ideaId}`},()=>{ supabase.from('ai_jobs').select('*').eq('idea_id',ideaId).order('created_at',{ascending:false}).then(({data})=>{if(data)setJobs(data as Job[])}) }).subscribe(); return()=>{supabase.removeChannel(ch)} },[ideaId,supabase])
 async function run(type:string){ setBusy(type); const {error}=await supabase.from('ai_jobs').insert({owner_id:userId,idea_id:ideaId,job_type:type}); setBusy(''); if(error) alert(error.message) }
 return <div className="card stack"><div><h2>AI Analysis</h2><div className="muted small">버튼을 누르면 작업이 Queue에 들어가고, 내 Claude worker가 켜져 있을 때 처리됩니다.</div></div><div className="row">{actions.map(([type,label])=><button key={type} className="button secondary" disabled={!!busy} onClick={()=>run(type)}>{busy===type?'요청 중…':label}</button>)}</div><div className="divider"/><div className="list">{jobs.map(j=><div className="list-item" key={j.id}><div className="row"><strong>{actions.find(a=>a[0]===j.job_type)?.[1] || j.job_type}</strong><span className={`badge ${j.status==='completed'?'good':j.status==='failed'?'danger':j.status==='queued'?'warn':''}`}>{j.status}</span></div>{j.result_md&&<pre className="output">{j.result_md}</pre>}{j.error_message&&<div className="error">{j.error_message}</div>}</div>)}{!jobs.length&&<div className="muted">아직 AI 분석 요청이 없습니다.</div>}</div></div>
}

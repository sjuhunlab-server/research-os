'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProjectContextEditor({userId,projectId,initialContent}:{userId:string;projectId:string;initialContent:string}){
  const [content,setContent]=useState(initialContent); const [msg,setMsg]=useState('')
  async function save(){ const s=createClient(); const {error}=await s.from('research_contexts').upsert({owner_id:userId,project_id:projectId,content},{onConflict:'owner_id,project_id'}); setMsg(error?error.message:'저장됨') }
  return <div className="card stack"><h2>Research Context</h2><div className="muted small">목표, 현재 문제, 방법, 실험 상태 등 LLM이 알아야 할 핵심 맥락을 적습니다.</div><textarea className="textarea" style={{minHeight:360}} value={content} onChange={e=>setContent(e.target.value)} /><button className="button" onClick={save}>Context 저장</button>{msg&&<div className="small muted">{msg}</div>}</div>
}

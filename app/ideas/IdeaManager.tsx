'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Project={id:string;name:string}
type Idea={id:string;title:string;raw_text:string;status:string;project_id:string|null;created_at:string}

export default function IdeaManager({userId,initialIdeas,projects}:{userId:string;initialIdeas:Idea[];projects:Project[]}){
 const [title,setTitle]=useState(''); const [raw,setRaw]=useState(''); const [projectId,setProjectId]=useState(''); const [busy,setBusy]=useState(false); const router=useRouter()
 async function add(){ if(!raw.trim()) return; setBusy(true); const s=createClient(); const {error}=await s.from('ideas').insert({owner_id:userId,project_id:projectId||null,title:title.trim()||raw.trim().slice(0,60),raw_text:raw.trim()}); setBusy(false); if(error)return alert(error.message); setTitle('');setRaw('');router.refresh() }
 return <div className="grid grid-2">
  <div className="card stack"><h2>아이디어 빠른 저장</h2><select className="select" value={projectId} onChange={e=>setProjectId(e.target.value)}><option value="">프로젝트 미지정</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><input className="input" placeholder="제목 (비워도 됨)" value={title} onChange={e=>setTitle(e.target.value)} /><textarea className="textarea" style={{minHeight:220}} placeholder="생각난 내용을 그대로 적으세요." value={raw} onChange={e=>setRaw(e.target.value)} /><button className="button" disabled={busy} onClick={add}>저장</button></div>
  <div className="card"><h2>최근 아이디어</h2><div className="list">{initialIdeas.map(i=><Link key={i.id} href={`/ideas/${i.id}`} className="list-item"><strong>{i.title}</strong><div className="muted small">{i.raw_text.slice(0,120)}{i.raw_text.length>120?'…':''}</div><div style={{marginTop:8}}><span className="badge">{i.status}</span></div></Link>)}{!initialIdeas.length&&<div className="muted">아직 아이디어가 없습니다.</div>}</div></div>
 </div>
}

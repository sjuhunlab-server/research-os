'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Project = { id:string; name:string; description:string|null; status:string; created_at:string }

export default function ProjectManager({ userId, initialProjects }: { userId:string; initialProjects:Project[] }) {
  const [name,setName] = useState(''); const [description,setDescription] = useState(''); const [busy,setBusy]=useState(false); const router=useRouter()
  async function add() {
    if (!name.trim()) return
    setBusy(true)
    const supabase=createClient(); const { error }=await supabase.from('projects').insert({ owner_id:userId, name:name.trim(), description:description.trim() || null })
    setBusy(false); if(error) return alert(error.message); setName(''); setDescription(''); router.refresh()
  }
  return <div className="grid grid-2">
    <div className="card stack"><h2>새 프로젝트</h2><input className="input" placeholder="예: PTv3 Missile Surrogate" value={name} onChange={e=>setName(e.target.value)} /><textarea className="textarea" placeholder="프로젝트 설명" value={description} onChange={e=>setDescription(e.target.value)} /><button className="button" disabled={busy} onClick={add}>프로젝트 생성</button></div>
    <div className="card"><h2>내 프로젝트</h2><div className="list">{initialProjects.map(p=><Link className="list-item" key={p.id} href={`/projects/${p.id}`}><strong>{p.name}</strong><div className="muted small">{p.description || '설명 없음'}</div></Link>)}{!initialProjects.length && <div className="muted">아직 프로젝트가 없습니다.</div>}</div></div>
  </div>
}

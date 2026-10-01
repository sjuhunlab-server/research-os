'use client'
import { createClient } from '@/lib/supabase/client'

export default function AccountLinker({providers}:{providers:string[]}){
 const connected=new Set(providers)
 async function link(provider:'google'|'github'){
   const s=createClient()
   const {error}=await s.auth.linkIdentity({provider,options:{redirectTo:`${window.location.origin}/auth/callback?next=/settings`}})
   if(error) alert(error.message)
 }
 return <div className="card stack"><h2>Connected identities</h2><div className="row"><span>Google</span>{connected.has('google')?<span className="badge good">CONNECTED</span>:<button className="button secondary" onClick={()=>link('google')}>Google 연결</button>}</div><div className="row"><span>GitHub</span>{connected.has('github')?<span className="badge good">CONNECTED</span>:<button className="button secondary" onClick={()=>link('github')}>GitHub 연결</button>}</div><div className="small muted">이 연결은 로그인 identity입니다. Private repository 접근 권한은 추후 별도 Integration에서 명시적으로 승인하도록 분리합니다.</div></div>
}

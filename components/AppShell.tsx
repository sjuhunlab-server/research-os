import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function AppShell({
  children,
  role,
  email,
}: {
  children: React.ReactNode
  role?: string | null
  email?: string | null
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Research OS</div>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/ideas">Ideas</Link>
          <Link href="/research-log">Research Log</Link>
          <Link href="/settings">Settings</Link>
          {role === 'admin' && <Link href="/admin">Admin</Link>}
        </nav>
        <div style={{ marginTop: 28 }} className="small muted">
          {email}
        </div>
        <div style={{ marginTop: 10 }}><LogoutButton /></div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}

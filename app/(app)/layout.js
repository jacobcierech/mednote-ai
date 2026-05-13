'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const UserContext = createContext(null)
export const useUser = () => useContext(UserContext)

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
    </svg>
  )},
  { href: '/soap', label: 'Workspace', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 6h5M5.5 8h5M5.5 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { href: '/history', label: 'Note history', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { href: '/settings', label: 'Settings', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
]

export default function AppLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { router.push('/login'); return }
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => router.push('/login'))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} className="dot-pulse" style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--teal)', animationDelay: `${i*0.2}s`
            }}/>
          ))}
        </div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', padding: '14px', gap: '14px' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 236, flexShrink: 0, background: 'linear-gradient(180deg, #102033 0%, #132740 100%)',
          display: 'flex', flexDirection: 'column', height: 'calc(100vh - 28px)', overflow: 'hidden',
          borderRadius: 28, boxShadow: '0 24px 60px rgba(10, 20, 35, 0.24)', border: '1px solid rgba(255,255,255,0.06)',
        }} className="glass-panel">
          {/* Logo */}
          <div style={{
            padding: '1.35rem 1.35rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
            fontSize: 21, color: 'white', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', fontWeight: 700 }}>
              MedNote<span style={{ color: 'var(--teal-mid)', fontSize: 19 }}>AI</span>
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.48)', lineHeight: 1.5 }}>
              Fast documentation workspace for real clinic flow.
            </p>
          </div>

          {/* New note button */}
          <div style={{ padding: '0.75rem 0.6rem 0' }}>
            <Link href="/soap?reset=1" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 14px', borderRadius: 16,
              background: 'linear-gradient(135deg, #1db39f 0%, #127a75 100%)', color: 'white',
              fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
              boxShadow: '0 14px 30px rgba(18, 122, 117, 0.28)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New note
            </Link>
          </div>

          {/* Nav */}
          <p style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)', padding: '1.35rem 1.25rem 0.6rem',
          }}>Menu</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 0.6rem' }}>
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', borderRadius: 14,
                  fontSize: 13.5, textDecoration: 'none', fontWeight: active ? 600 : 500,
                  color: active ? 'white' : 'rgba(255,255,255,0.55)',
                  background: active ? 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                  border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                }}>
                  <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div style={{ marginTop: 'auto', padding: '1rem 0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 18, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #23b7a4 0%, #127a75 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 500, color: 'white', flexShrink: 0,
                }}>
                  {user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Pro plan</p>
                </div>
              </div>
              <button onClick={handleLogout} title="Sign out" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.3)', padding: 4, borderRadius: 6,
                transition: 'color 0.15s',
              }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2H2v12h4M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 28px)', overflow: 'hidden', borderRadius: 30 }} className="glass-panel">
          {/* Topbar */}
          <div style={{
            height: 64, flexShrink: 0, background: 'rgba(255,255,255,0.44)',
            borderBottom: '1px solid rgba(16, 32, 51, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.75rem',
            backdropFilter: 'blur(16px)'
          }}>
            <div>
              <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif' }}>
              {NAV.find(n => n.href === pathname)?.label || 'MedNote AI'}
              </span>
              <p style={{ fontSize: 11.5, color: 'var(--gray)', marginTop: 2 }}>Designed for fast documentation with clinician oversight.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: 'rgba(255,255,255,0.72)', color: 'var(--amber)',
                fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 999,
                border: '1px solid rgba(173,117,35,0.15)'
              }}>Pro plan</span>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 1.85rem 2rem' }} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </UserContext.Provider>
  )
}

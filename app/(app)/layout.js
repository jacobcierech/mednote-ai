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
  { href: '/soap', label: 'New client', icon: (
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
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 248, flexShrink: 0,
          background: 'linear-gradient(180deg, #102238 0%, #132a44 100%)',
          display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '18px 0 40px rgba(11, 24, 39, 0.12)',
        }}>
          {/* Logo */}
          <div style={{
            padding: '1.5rem 1.35rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: 'white',
          }}>
            MedNote<span style={{ color: '#7FE6D3', fontFamily: 'DM Sans, sans-serif', fontSize: 19 }}>AI</span>
          </div>

          {/* New note button */}
          <div style={{ padding: '1rem 0.85rem 0' }}>
            <Link href="/soap" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '14px 15px', borderRadius: 18,
              background: 'linear-gradient(135deg, #22b59d 0%, #157a6e 100%)', color: 'white',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
              boxShadow: '0 14px 30px rgba(21, 122, 110, 0.28)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New client
            </Link>
          </div>

          {/* Nav */}
          <p style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.34)', padding: '1.5rem 1.35rem 0.65rem',
          }}>Menu</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 0.85rem' }}>
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '13px 14px', borderRadius: 18,
                  fontSize: 14.5, textDecoration: 'none',
                  color: active ? 'white' : 'rgba(255,255,255,0.64)',
                  background: active ? 'linear-gradient(135deg, rgba(127,230,211,0.18) 0%, rgba(79,140,255,0.18) 100%)' : 'transparent',
                  border: active ? '1px solid rgba(127,230,211,0.18)' : '1px solid transparent',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}>
                  <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div style={{ marginTop: 'auto', padding: '1rem 0.85rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px', borderRadius: 18, background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #22b59d 0%, #4f8cff 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                }}>
                  {user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)' }}>Pro plan</p>
                </div>
              </div>
              <button onClick={handleLogout} title="Sign out" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.42)', padding: 6, borderRadius: 10,
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
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Topbar */}
          <div style={{
            height: 72, flexShrink: 0, background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(18px)',
            borderBottom: '1px solid rgba(17, 32, 52, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 2rem',
          }}>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif' }}>
              {NAV.find(n => n.href === pathname)?.label || 'MedNote AI'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: 'linear-gradient(135deg, #eef7ff 0%, #ffffff 100%)', color: '#24538f',
                fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 100,
                border: '1px solid #d6e7fb',
              }}>Pro plan</span>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </UserContext.Provider>
  )
}

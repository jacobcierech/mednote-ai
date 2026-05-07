'use client'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
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
  { href: '/soap', label: 'Pediatric workspace', icon: (
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

const NOTE_MENU_OPTIONS = [
  {
    href: '/soap?noteMenu=outpatient-eval',
    label: 'Outpatient eval',
    description: 'New pediatric eval, goals, and treatment plan',
  },
  {
    href: '/soap?noteMenu=progress',
    label: 'Progress note',
    description: 'Fast visit summary and skilled intervention note',
  },
  {
    href: '/soap?noteMenu=insurance',
    label: 'Insurance note',
    description: 'Medical necessity, plan of care, and payer support',
  },
  {
    href: '/soap?noteMenu=discharge',
    label: 'Discharge note',
    description: 'Status summary and next-step recommendations',
  },
]

export default function AppLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noteMenuOpen, setNoteMenuOpen] = useState(false)
  const noteMenuRef = useRef(null)

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (!noteMenuRef.current?.contains(event.target)) {
        setNoteMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          width: 220, flexShrink: 0, background: 'var(--sidebar)',
          display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{
            padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white',
          }}>
            MedNote<span style={{ color: 'var(--teal-mid)', fontFamily: 'DM Sans, sans-serif', fontSize: 18 }}>AI</span>
          </div>

          {/* New note button */}
          <div style={{ padding: '0.75rem 0.6rem 0', position: 'relative' }} ref={noteMenuRef}>
            <button
              onClick={() => setNoteMenuOpen((prev) => !prev)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--teal)',
                color: 'white',
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New pediatric note
              </span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.9 }}>
                <path d="M4 6l4 4 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {noteMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 10,
                right: 10,
                background: 'white',
                borderRadius: 14,
                border: '1px solid var(--border)',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
                padding: 8,
                zIndex: 30,
              }}>
                <p style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                  padding: '4px 8px 8px',
                }}>
                  Pediatric outpatient notes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {NOTE_MENU_OPTIONS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setNoteMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 10px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        color: 'var(--ink)',
                        background: 'white',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--gray)', lineHeight: 1.45 }}>
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <p style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', padding: '1.25rem 1.25rem 0.5rem',
          }}>Menu</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 0.6rem' }}>
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8,
                  fontSize: 13.5, textDecoration: 'none',
                  color: active ? 'white' : 'rgba(255,255,255,0.55)',
                  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                }}>
                  <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div style={{ marginTop: 'auto', padding: '1rem 0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)',
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
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Topbar */}
          <div style={{
            height: 56, flexShrink: 0, background: 'white',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.75rem',
          }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>
              {NAV.find(n => n.href === pathname)?.label || 'MedNote AI'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: 'var(--amber-light)', color: 'var(--amber)',
                fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100,
              }}>Pro plan</span>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </UserContext.Provider>
  )
}

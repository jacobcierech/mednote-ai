'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../layout'

const SPECIALTIES = ['Primary Care','Psychiatry / Therapy','Pediatrics','Orthopedics','Urgent Care']
const NOTE_TYPES = ['SOAP','Progress','Referral','Discharge']
const SECTIONS = ['Profile','Preferences','Password','Audit log']

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 100, cursor: 'pointer',
      background: checked ? 'var(--teal)' : 'var(--gray-light)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', width: 16, height: 16, borderRadius: '50%',
        background: 'white', top: 3, left: checked ? 21 : 3,
        transition: 'left 0.2s',
      }}/>
    </div>
  )
}

export default function SettingsPage() {
  const { user, setUser } = useUser()
  const [section, setSection] = useState('Profile')
  const [profile, setProfile] = useState({ name: '', specialty: 'Primary Care' })
  const [prefs, setPrefs] = useState({ defaultNoteType: 'SOAP', autoSave: true })
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [auditLogs, setAuditLogs] = useState([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', specialty: user.specialty || 'Primary Care' })
      setPrefs({ defaultNoteType: user.default_note_type || 'SOAP', autoSave: Boolean(user.auto_save) })
    }
  }, [user])

  useEffect(() => {
    if (section === 'Audit log') {
      fetch('/api/audit').then(r => r.ok ? r.json() : {logs:[]}).then(d => setAuditLogs(d.logs || []))
    }
  }, [section])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function saveProfile() {
    setSaving(true); setError('')
    const res = await fetch('/api/auth/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, ...prefs }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setUser(data.user)
    setSaving(false); showToast('Settings saved!')
  }

  async function savePassword() {
    setError('')
    if (pwd.newPassword !== pwd.confirm) { setError('New passwords do not match.'); return }
    if (pwd.newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSaving(true)
    const res = await fetch('/api/auth/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, specialty: profile.specialty, ...prefs, currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setPwd({ currentPassword: '', newPassword: '', confirm: '' })
    setSaving(false); showToast('Password updated!')
  }

  const ACTION_LABELS = {
    LOGIN: '🔐 Signed in',
    REGISTER: '✅ Account created',
    CREATE_NOTE: '📝 Note created',
    REGENERATE_NOTE: '🔄 Note regenerated',
    DELETE_NOTE: '🗑 Note deleted',
    UPDATE_SETTINGS: '⚙️ Settings updated',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Sidebar nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => { setSection(s); setError('') }} style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 13, textAlign: 'left', width: '100%',
            border: section===s ? '1px solid var(--border)' : '1px solid transparent',
            background: section===s ? 'white' : 'none', color: section===s ? 'var(--ink)' : 'var(--ink2)',
            fontWeight: section===s ? 500 : 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.15s',
          }}>{s}</button>
        ))}
      </div>

      {/* Panel */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
        {/* Plan banner */}
        <div style={{
          background: 'var(--teal-light)', border: '1px solid rgba(15,110,86,0.15)',
          borderRadius: 10, padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem',
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>Pro Plan</p>
            <p style={{ fontSize: 13, color: 'var(--teal)' }}>Unlimited notes · All specialties · Full history</p>
          </div>
          <button style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--teal)', color: 'white', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Manage plan
          </button>
        </div>

        {error && (
          <div style={{ background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13, marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {/* PROFILE */}
        {section === 'Profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Profile</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Full name</label>
                <input type="text" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))}/>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Email</label>
                <input type="text" value={user?.email || ''} disabled style={{ background: 'var(--bg)', color: 'var(--gray)' }}/>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Specialty</label>
                <select value={profile.specialty} onChange={e => setProfile(p => ({...p, specialty: e.target.value}))}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} style={{
              alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8,
              background: 'var(--ink)', color: 'white', border: 'none',
              fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        )}

        {/* PREFERENCES */}
        {section === 'Preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Preferences</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Default note type', desc: 'Pre-selected when you open Generate', content: (
                  <select style={{ width: 150 }} value={prefs.defaultNoteType} onChange={e => setPrefs(p => ({...p, defaultNoteType: e.target.value}))}>
                    {NOTE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                )},
                { label: 'Auto-save generated notes', desc: 'Save every note to history automatically', content: (
                  <Toggle checked={prefs.autoSave} onChange={v => setPrefs(p => ({...p, autoSave: v}))}/>
                )},
              ].map(({ label, desc, content }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--ink2)' }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{desc}</p>
                  </div>
                  {content}
                </div>
              ))}
            </div>
            <button onClick={saveProfile} disabled={saving} style={{
              alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8,
              background: 'var(--ink)', color: 'white', border: 'none',
              fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>{saving ? 'Saving…' : 'Save preferences'}</button>
          </div>
        )}

        {/* PASSWORD */}
        {section === 'Password' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Change password</p>
            <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Current password', key: 'currentPassword', placeholder: '••••••••' },
                { label: 'New password', key: 'newPassword', placeholder: 'At least 8 characters' },
                { label: 'Confirm new password', key: 'confirm', placeholder: '••••••••' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input type="password" placeholder={placeholder} value={pwd[key]} onChange={e => setPwd(p => ({...p, [key]: e.target.value}))}/>
                </div>
              ))}
            </div>
            <button onClick={savePassword} disabled={saving} style={{
              alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8,
              background: 'var(--ink)', color: 'white', border: 'none',
              fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>{saving ? 'Updating…' : 'Update password'}</button>
          </div>
        )}

        {/* AUDIT LOG */}
        {section === 'Audit log' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Audit log</p>
            <p style={{ fontSize: 13, color: 'var(--gray)' }}>Your last 100 account actions.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {auditLogs.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--gray)' }}>No activity recorded yet.</p>
              ) : auditLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink2)' }}>{ACTION_LABELS[log.action] || log.action}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray)' }}>
                    {new Date(log.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999,
          background: 'var(--ink)', color: 'white', padding: '10px 18px',
          borderRadius: 10, fontSize: 13, fontWeight: 500, animation: 'fadeIn 0.3s ease',
        }}>{toast}</div>
      )}
    </div>
  )
}

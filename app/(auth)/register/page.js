'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SPECIALTIES = ['Primary Care','Psychiatry / Therapy','Pediatrics','Orthopedics','Urgent Care']

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', specialty: 'Primary Care' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const F = (field) => ({
    value: form[field],
    onChange: e => setForm(f => ({ ...f, [field]: e.target.value })),
  })

  return (
    <div style={{ width: '100%', maxWidth: 470 }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(17,32,52,0.08)', marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #22b59d 0%, #4f8cff 100%)' }} />
          <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 600 }}>Built for modern clinical workflows</span>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', fontSize: 34, fontWeight: 800, color: 'var(--ink)' }}>
          MedNote<span style={{ color: 'var(--teal)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: 15, marginTop: 8, lineHeight: 1.7 }}>Create your account to start documenting evals, assessments, and SOAP notes in one workflow.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(17,32,52,0.08)', borderRadius: 28, padding: '2.25rem', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(18px)' }}>
        {error && (
          <div style={{ background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13, marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>Full name</label>
            <input type="text" required placeholder="Dr. Alex Reynolds" {...F('name')} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>Email</label>
            <input type="email" required placeholder="you@clinic.com" {...F('email')} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>Specialty</label>
            <select {...F('specialty')}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>Password</label>
            <input type="password" required placeholder="At least 8 characters" {...F('password')} />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, padding: '15px', borderRadius: 18, border: 'none',
              background: loading ? 'var(--gray-light)' : 'linear-gradient(135deg, #18314f 0%, #157a6e 100%)',
              color: 'white', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: loading ? 'none' : '0 16px 28px rgba(21,122,110,0.24)',
            }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 13, color: 'var(--gray)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
      </p>
    </div>
  )
}

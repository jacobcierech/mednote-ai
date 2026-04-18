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
    <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--ink)' }}>
          MedNote<span style={{ color: 'var(--teal)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 6 }}>Create your free account</p>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
        {error && (
          <div style={{ background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13, marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Full name</label>
            <input type="text" required placeholder="Dr. Alex Reynolds" {...F('name')} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Email</label>
            <input type="email" required placeholder="you@clinic.com" {...F('email')} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Specialty</label>
            <select {...F('specialty')}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Password</label>
            <input type="password" required placeholder="At least 8 characters" {...F('password')} />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 4, padding: '11px', borderRadius: 8, border: 'none',
              background: loading ? 'var(--gray-light)' : 'var(--ink)',
              color: 'white', fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
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

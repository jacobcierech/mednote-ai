'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
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

  return (
    <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-in">
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--ink)' }}>
          MedNote<span style={{ color: 'var(--teal)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
      </div>

      {/* Card */}
      <div style={{
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 16, padding: '2rem',
      }}>
        {error && (
          <div style={{
            background: '#FCEBEB', border: '1px solid #F7C1C1',
            borderRadius: 8, padding: '10px 14px',
            color: 'var(--red)', fontSize: 13, marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Email</label>
            <input
              type="email" required autoComplete="email"
              placeholder="you@clinic.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>Password</label>
            <input
              type="password" required autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 4, padding: '11px', borderRadius: 8, border: 'none',
              background: loading ? 'var(--gray-light)' : 'var(--ink)',
              color: 'white', fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 13, color: 'var(--gray)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>
          Create one free
        </Link>
      </p>
    </div>
  )
}

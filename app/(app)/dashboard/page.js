'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { hasStructuredClientNote, parseClientNote } from '../../../lib/noteSections'

const TAG = { SOAP:'#E1F5EE|#0F6E56', Progress:'#E6F1FB|#185FA5', Referral:'#FAEEDA|#BA7517', Discharge:'#FBEAF0|#993556' }
function NoteTag({ type }) {
  const [bg, color] = (TAG[type] || TAG.SOAP).split('|')
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.01em' }}>{type}</span>
}

function StatCard({ label, value, sub, subColor = 'var(--teal)' }) {
  return (
    <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(247,251,253,0.98) 100%)', border: '1px solid rgba(255,255,255,0.72)', borderRadius: 24, padding: '1.35rem 1.35rem 1.25rem', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -30, right: -24, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,140,255,0.14) 0%, rgba(79,140,255,0) 70%)' }} />
      <p style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif' }}>{value}</p>
      <p style={{ fontSize: 11, color: subColor, marginTop: 8, fontWeight: 600 }}>{sub}</p>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notes?limit=20')
      .then(r => r.ok ? r.json() : { notes: [] })
      .then(d => { setNotes(d.notes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = notes.length
  const timeSaved = total * 8
  const types = notes.reduce((acc, n) => { acc[n.note_type] = (acc[n.note_type] || 0) + 1; return acc }, {})
  const topType = Object.entries(types).sort((a, b) => b[1] - a[1])[0]

  async function copyNote(note) {
    await navigator.clipboard.writeText(note.generated_note)
    // flash handled inline
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(17,32,52,0.08)', marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #22b59d 0%, #4f8cff 100%)' }} />
            <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 700 }}>Clinical overview</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', letterSpacing: '-0.04em', color: 'var(--ink)' }}>Documentation Dashboard</h1>
          <p style={{ fontSize: 15, color: 'var(--gray)', marginTop: 8, lineHeight: 1.75, maxWidth: 760 }}>
            Review recent client records, track documentation output, and jump back into the OT workflow with less friction.
          </p>
        </div>
        <Link href="/soap" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 18px', borderRadius: 18,
          background: 'linear-gradient(135deg, #18314f 0%, #157a6e 100%)', color: 'white', fontSize: 14, fontWeight: 700,
          textDecoration: 'none', boxShadow: '0 18px 34px rgba(21,122,110,0.22)'
        }}>
          Start new client
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <StatCard label="Notes this month" value={total} sub={total === 0 ? 'Generate your first note!' : `${total} total notes`} />
        <StatCard label="Time saved (est.)" value={timeSaved >= 60 ? `${(timeSaved/60).toFixed(1)}h` : `${timeSaved}m`} sub="@ 8 min/note avg" />
        <StatCard label="Most used type" value={topType?.[0] || '—'} sub={topType ? `${topType[1]} of ${total} notes` : 'No notes yet'} />
        <StatCard label="Plan" value="Pro" sub="Unlimited notes" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        {/* Recent notes */}
        <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,251,253,0.98) 100%)', border: '1px solid rgba(255,255,255,0.76)', borderRadius: 28, padding: '1.45rem', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(18px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Recent client notes</span>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--teal)', textDecoration: 'none', fontWeight: 700 }}>View all →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--gray)', fontSize: 13, padding: '1rem 0' }}>Loading…</p>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: '1rem' }}>No notes yet. Generate your first!</p>
              <Link href="/soap" style={{
                display: 'inline-block', padding: '9px 20px', borderRadius: 8,
                background: 'var(--teal)', color: 'white', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              }}>Start a new client →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {notes.slice(0, 6).map(n => {
                const structured = hasStructuredClientNote(n.generated_note)
                const parsed = parseClientNote(n.generated_note)
                const preview = parsed.evaluationSummary || parsed.subjective || n.diagnosis || 'Saved client note'

                return (
                  <div
                    key={n.id}
                    onClick={() => router.push(`/history?open=${n.id}`)}
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(17,32,52,0.08)',
                      borderRadius: 22,
                      padding: '1.15rem 1.15rem',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,249,251,0.98) 100%)',
                      boxShadow: '0 12px 28px rgba(27,53,87,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{n.patient_label}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                          <NoteTag type={n.note_type} />
                          {structured ? (
                            <span style={{ background: '#EEF9F5', color: '#0F6E56', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                              Eval + Assessment + SOAP
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--gray)', whiteSpace: 'nowrap' }}>
                        {new Date(n.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: 13, color: 'var(--gray)', lineHeight: 1.7 }}>
                      {preview.length > 160 ? `${preview.slice(0, 160)}…` : preview}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--gray)' }}>{n.specialty}</span>
                      <span
                        onClick={e => { e.stopPropagation(); copyNote(n) }}
                        style={{ fontSize: 12, color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Copy
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,251,253,0.98) 100%)', border: '1px solid rgba(255,255,255,0.76)', borderRadius: 28, padding: '1.35rem', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(18px)' }}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: '1rem' }}>Breakdown</p>
          {Object.keys(types).length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--gray)' }}>Generate notes to see your breakdown.</p>
          ) : Object.entries(types).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <NoteTag type={type} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{count} note{count !== 1 ? 's' : ''}</span>
            </div>
          ))}
          <div style={{ height: 5, background: 'var(--gray-bg)', borderRadius: 100, marginTop: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, total * 5)}%`, background: 'var(--teal)', borderRadius: 100, transition: 'width 0.4s' }}/>
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 6 }}>{total} note{total !== 1 ? 's' : ''} total</p>
        </div>
      </div>
    </div>
  )
}

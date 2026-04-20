'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TAG = { SOAP:'#E1F5EE|#0F6E56', Progress:'#E6F1FB|#185FA5', Referral:'#FAEEDA|#BA7517', Discharge:'#FBEAF0|#993556' }
function NoteTag({ type }) {
  const [bg, color] = (TAG[type] || TAG.SOAP).split('|')
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100 }}>{type}</span>
}

function StatCard({ label, value, sub, subColor = 'var(--teal)' }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.1rem 1.25rem' }}>
      <p style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 500, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: subColor, marginTop: 4 }}>{sub}</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        <StatCard label="Notes this month" value={total} sub={total === 0 ? 'Generate your first note!' : `${total} total notes`} />
        <StatCard label="Time saved (est.)" value={timeSaved >= 60 ? `${(timeSaved/60).toFixed(1)}h` : `${timeSaved}m`} sub="@ 8 min/note avg" />
        <StatCard label="Most used type" value={topType?.[0] || '—'} sub={topType ? `${topType[1]} of ${total} notes` : 'No notes yet'} />
        <StatCard label="Plan" value="Pro" sub="Unlimited notes" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
        {/* Recent notes */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Recent notes</span>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--teal)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--gray)', fontSize: 13, padding: '1rem 0' }}>Loading…</p>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: '1rem' }}>No notes yet. Generate your first!</p>
              <Link href="/soap" style={{
                display: 'inline-block', padding: '9px 20px', borderRadius: 8,
                background: 'var(--teal)', color: 'white', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              }}>Start a SOAP note →</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Patient / visit','Type','Specialty','Date',''].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 10px 10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {notes.slice(0, 6).map(n => (
                  <tr key={n.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/history?open=${n.id}`)}>
                    <td style={{ padding: '11px 10px', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{n.patient_label}</td>
                    <td style={{ padding: '11px 10px', borderBottom: '1px solid var(--border)' }}><NoteTag type={n.note_type} /></td>
                    <td style={{ padding: '11px 10px', borderBottom: '1px solid var(--border)', color: 'var(--gray)', fontSize: 12 }}>{n.specialty}</td>
                    <td style={{ padding: '11px 10px', borderBottom: '1px solid var(--border)', color: 'var(--gray)', fontSize: 12 }}>{new Date(n.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
                    <td style={{ padding: '11px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span onClick={e => { e.stopPropagation(); copyNote(n) }} style={{ fontSize: 12, color: 'var(--teal)', cursor: 'pointer' }}>Copy</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Breakdown */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Breakdown</p>
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

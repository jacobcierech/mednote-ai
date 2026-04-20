'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const TAG_COLORS = {
  SOAP: ['#E1F5EE','#0F6E56'],
  Progress: ['#E6F1FB','#185FA5'],
  Referral: ['#FAEEDA','#BA7517'],
  Discharge: ['#FBEAF0','#993556'],
}

function NoteTag({ type }) {
  const [bg, color] = TAG_COLORS[type] || TAG_COLORS.SOAP
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100 }}>{type}</span>
}

function VersionBadge({ v }) {
  return <span style={{ background: '#F1EFE8', color: '#5F5E5A', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100 }}>v{v}</span>
}

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { loadNotes() }, [filter])

  useEffect(() => {
    const openId = searchParams.get('open')
    if (openId && notes.length > 0) {
      const n = notes.find(x => x.id === openId)
      if (n) openNoteDetail(n)
    }
  }, [notes])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadNotes() {
    setLoading(true)
    const url = filter === 'all' ? '/api/notes' : `/api/notes?type=${filter}`
    const res = await fetch(url)
    const data = res.ok ? await res.json() : { notes: [] }
    setNotes(data.notes || [])
    setLoading(false)
  }

  async function openNoteDetail(note) {
    const res = await fetch(`/api/notes/${note.id}`)
    const data = res.ok ? await res.json() : null
    setOpenNote(note)
    setVersions(data?.versions || [])
    setSelectedVersion(null)
  }

  async function handleDelete(noteId) {
    if (!confirm('Delete this note? This cannot be undone.')) return
    await fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
    setOpenNote(null)
    showToast('Note deleted.')
    loadNotes()
  }

  async function handleCopy(text) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const displayedNote = selectedVersion ? selectedVersion.generated_note : openNote?.generated_note
  const FILTERS = ['all','SOAP','Progress','Referral','Discharge']

  return (
    <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100vh - 56px - 3.5rem)' }}>

      {/* LEFT: Note list */}
      <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 13px', borderRadius: 100, fontSize: 12, fontWeight: 500,
              border: `1px solid ${filter===f ? 'var(--teal)' : 'var(--border)'}`,
              background: filter===f ? 'var(--teal)' : 'white',
              color: filter===f ? 'white' : 'var(--gray)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--gray)', fontSize: 13 }}>Loading…</p>
        ) : notes.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray)', fontSize: 13 }}>No notes found.</p>
          </div>
        ) : notes.map(n => (
          <div key={n.id} onClick={() => openNoteDetail(n)} style={{
            background: 'white',
            border: `1px solid ${openNote?.id===n.id ? 'var(--teal)' : 'var(--border)'}`,
            borderRadius: 12, padding: '1rem 1.15rem',
            cursor: 'pointer', transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <NoteTag type={n.note_type} />
                {n.current_version > 1 && <VersionBadge v={n.current_version} />}
              </div>
              <span style={{ fontSize: 11, color: 'var(--gray)' }}>
                {new Date(n.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
              </span>
            </div>
            <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 3 }}>{n.patient_label}</p>
            <p style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 5 }}>{n.specialty}</p>
            <p style={{
              fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{n.generated_note}</p>
          </div>
        ))}
      </div>

      {/* RIGHT: Note detail */}
      <div style={{ flex: 1, background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        {!openNote ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', flexDirection: 'column', gap: '1rem' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="4" width="28" height="32" rx="4" stroke="#D3D1C7" strokeWidth="2"/>
              <path d="M12 13h16M12 19h12M12 25h8" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 14 }}>Select a note to view it</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <NoteTag type={openNote.note_type} />
                  {openNote.current_version > 1 && <VersionBadge v={openNote.current_version} />}
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{openNote.patient_label}</h2>
                <p style={{ fontSize: 12, color: 'var(--gray)' }}>{openNote.specialty} · {new Date(openNote.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => router.push('/soap')} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'white', color: 'var(--ink)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>Open SOAP workspace</button>
                <button onClick={() => handleCopy(displayedNote)} style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none',
                  background: copied ? 'var(--teal)' : 'var(--ink)', color: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>{copied ? '✓ Copied!' : 'Copy'}</button>
                <button onClick={() => handleDelete(openNote.id)} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid #FCEBEB',
                  background: 'white', color: 'var(--red)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>Delete</button>
              </div>
            </div>

            {/* Version selector */}
            {versions.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>Version:</span>
                <button onClick={() => setSelectedVersion(null)} style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${!selectedVersion ? 'var(--teal)' : 'var(--border)'}`,
                  background: !selectedVersion ? 'var(--teal)' : 'white',
                  color: !selectedVersion ? 'white' : 'var(--gray)', cursor: 'pointer',
                }}>Latest</button>
                {versions.map(v => (
                  <button key={v.id} onClick={() => setSelectedVersion(v)} style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                    border: `1px solid ${selectedVersion?.id===v.id ? 'var(--teal)' : 'var(--border)'}`,
                    background: selectedVersion?.id===v.id ? 'var(--teal)' : 'white',
                    color: selectedVersion?.id===v.id ? 'white' : 'var(--gray)', cursor: 'pointer',
                  }}>v{v.version_number}</button>
                ))}
              </div>
            )}

            {/* Structured fields (collapsed) */}
            {openNote.diagnosis && (
              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1rem' }}>
                {[
                  ['Diagnosis', openNote.diagnosis],
                  ['Visit #', openNote.visit_number],
                  ['Assist level', openNote.assist_level],
                  ['Precautions', openNote.precautions],
                ].filter(([,v]) => v).map(([label, val]) => (
                  <div key={label}>
                    <span style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}: </span>
                    <span style={{ fontSize: 12, color: 'var(--ink2)' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Note text */}
            <div style={{
              flex: 1, background: 'var(--bg)', borderRadius: 8, padding: '1rem',
              fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink2)', whiteSpace: 'pre-wrap', overflowY: 'auto',
            }}>
              {displayedNote}
            </div>
          </>
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

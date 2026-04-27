'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { hasStructuredClientNote, parseClientNote } from '../../../lib/noteSections'

const TAG_COLORS = {
  SOAP: ['#E1F5EE','#0F6E56'],
  Progress: ['#E6F1FB','#185FA5'],
  Referral: ['#FAEEDA','#BA7517'],
  Discharge: ['#FBEAF0','#993556'],
}

function NoteTag({ type }) {
  const [bg, color] = TAG_COLORS[type] || TAG_COLORS.SOAP
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100 }}>{type}</span>
}

function VersionBadge({ v }) {
  return <span style={{ background: '#EFF4F8', color: '#4D6278', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100 }}>v{v}</span>
}

function SectionBlock({ title, tone = 'slate', children }) {
  const tones = {
    teal: { bg: '#EEF9F5', border: '#CBEBDD', title: '#0F6E56' },
    blue: { bg: '#EFF6FF', border: '#D7E8FF', title: '#185FA5' },
    amber: { bg: '#FFF8EB', border: '#F3E1B7', title: '#9A6700' },
    slate: { bg: '#F8FAFC', border: '#E2E8F0', title: '#334155' },
  }
  const colors = tones[tone] || tones.slate

  return (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 22, padding: '1.15rem 1.15rem', boxShadow: '0 10px 24px rgba(27,53,87,0.05)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.title, marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  )
}

function BulletList({ items }) {
  if (!items?.length) return <p style={{ fontSize: 13, color: 'var(--gray)' }}>No details saved.</p>

  return (
    <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--ink2)', fontSize: 13.5, lineHeight: 1.75 }}>
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  )
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
  const parsedNote = parseClientNote(displayedNote)
  const isStructured = hasStructuredClientNote(displayedNote)
  const FILTERS = ['all','SOAP','Progress','Referral','Discharge']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(17,32,52,0.08)', marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #22b59d 0%, #4f8cff 100%)' }} />
            <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 700 }}>Client archive</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', letterSpacing: '-0.04em', color: 'var(--ink)' }}>Note History</h1>
          <p style={{ fontSize: 15, color: 'var(--gray)', marginTop: 8, lineHeight: 1.75, maxWidth: 780 }}>
            Browse saved client records, open full eval-to-SOAP documentation, and copy polished notes from one place.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100vh - 56px - 10rem)' }}>

      {/* LEFT: Note list */}
      <div style={{ width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.95rem', overflowY: 'auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', padding: '0.2rem 0.2rem 0.3rem' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              border: `1px solid ${filter===f ? 'rgba(21,122,110,0.16)' : 'rgba(17,32,52,0.08)'}`,
              background: filter===f ? 'linear-gradient(135deg, #157a6e 0%, #20a991 100%)' : 'rgba(255,255,255,0.86)',
              color: filter===f ? 'white' : 'var(--gray)',
              cursor: 'pointer', transition: 'all 0.15s', boxShadow: filter===f ? '0 12px 26px rgba(21,122,110,0.2)' : 'none',
            }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--gray)', fontSize: 13 }}>Loading…</p>
        ) : notes.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.76)', borderRadius: 24, padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
            <p style={{ color: 'var(--gray)', fontSize: 13 }}>No notes found.</p>
          </div>
        ) : notes.map(n => (
          (() => {
            const structured = hasStructuredClientNote(n.generated_note)
            return (
          <div key={n.id} onClick={() => openNoteDetail(n)} style={{
            background: openNote?.id===n.id ? 'linear-gradient(180deg, rgba(239,252,248,0.98) 0%, rgba(255,255,255,0.98) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,251,253,0.98) 100%)',
            border: `1px solid ${openNote?.id===n.id ? 'rgba(21,122,110,0.28)' : 'rgba(17,32,52,0.08)'}`,
            borderRadius: 24, padding: '1.15rem 1.2rem',
            cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: openNote?.id===n.id ? '0 18px 34px rgba(21,122,110,0.14)' : '0 12px 26px rgba(27,53,87,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{n.patient_label}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <NoteTag type={n.note_type} />
                  {structured ? (
                    <span style={{ background: '#EEF9F5', color: '#0F6E56', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                      Eval + Assessment + SOAP
                    </span>
                  ) : null}
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--gray)', whiteSpace: 'nowrap' }}>
                {new Date(n.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--gray)', marginTop: 12, lineHeight: 1.65 }}>
              {n.diagnosis || n.specialty || 'Saved client note'}
            </p>
          </div>
            )
          })()
        ))}
      </div>

      {/* RIGHT: Note detail */}
      <div style={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,251,253,0.98) 100%)', border: '1px solid rgba(255,255,255,0.76)', borderRadius: 30, padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(18px)' }}>
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
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <NoteTag type={openNote.note_type} />
                  {openNote.current_version > 1 && <VersionBadge v={openNote.current_version} />}
                  {isStructured ? (
                    <span style={{ background: '#EFF6FF', color: '#185FA5', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                      Full client record
                    </span>
                  ) : null}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, DM Sans, sans-serif', marginBottom: 6 }}>{openNote.patient_label}</h2>
                <p style={{ fontSize: 12, color: 'var(--gray)' }}>{openNote.specialty} · {new Date(openNote.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => router.push('/soap')} style={{
                  padding: '10px 15px', borderRadius: 16, border: '1px solid rgba(17,32,52,0.08)',
                  background: 'rgba(255,255,255,0.88)', color: 'var(--ink)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>Open client workspace</button>
                <button onClick={() => handleCopy(displayedNote)} style={{
                  padding: '10px 15px', borderRadius: 16, border: 'none',
                  background: copied ? 'linear-gradient(135deg, #157a6e 0%, #20a991 100%)' : 'linear-gradient(135deg, #18314f 0%, #157a6e 100%)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 14px 24px rgba(21,122,110,0.18)',
                }}>{copied ? '✓ Copied!' : 'Copy'}</button>
                <button onClick={() => handleDelete(openNote.id)} style={{
                  padding: '10px 15px', borderRadius: 16, border: '1px solid #F9D8DB',
                  background: 'rgba(255,255,255,0.88)', color: 'var(--red)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>Delete</button>
              </div>
            </div>

            {/* Version selector */}
            {versions.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>Version:</span>
                <button onClick={() => setSelectedVersion(null)} style={{
                  padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  border: `1px solid ${!selectedVersion ? 'var(--teal)' : 'var(--border)'}`,
                  background: !selectedVersion ? 'var(--teal)' : 'white',
                  color: !selectedVersion ? 'white' : 'var(--gray)', cursor: 'pointer',
                }}>Latest</button>
                {versions.map(v => (
                  <button key={v.id} onClick={() => setSelectedVersion(v)} style={{
                    padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    border: `1px solid ${selectedVersion?.id===v.id ? 'var(--teal)' : 'var(--border)'}`,
                    background: selectedVersion?.id===v.id ? 'var(--teal)' : 'white',
                    color: selectedVersion?.id===v.id ? 'white' : 'var(--gray)', cursor: 'pointer',
                  }}>v{v.version_number}</button>
                ))}
              </div>
            )}

            {/* Structured fields (collapsed) */}
            {openNote.diagnosis && (
              <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(243,247,250,0.94) 100%)', border: '1px solid #E6ECF2', borderRadius: 20, padding: '1rem 1.1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                {[
                  ['Diagnosis', openNote.diagnosis],
                  ['Visit #', openNote.visit_number],
                  ['Precautions', openNote.precautions],
                ].filter(([,v]) => v).map(([label, val]) => (
                  <div key={label}>
                    <span style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}: </span>
                    <span style={{ fontSize: 12, color: 'var(--ink2)' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {isStructured ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <SectionBlock title="Eval" tone="teal">
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>
                    {parsedNote.evaluationSummary || 'No evaluation summary saved.'}
                  </p>
                </SectionBlock>

                <SectionBlock title="Assessment" tone="blue">
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>
                    {parsedNote.evalAssessment || 'No evaluation assessment saved.'}
                  </p>
                </SectionBlock>

                {(parsedNote.clinicalConnections.length > 0 || parsedNote.treatmentPriorities.length > 0) ? (
                  <div style={{ display: 'grid', gap: '0.9rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                    <SectionBlock title="Clinical Connections" tone="amber">
                      <BulletList items={parsedNote.clinicalConnections} />
                    </SectionBlock>
                    <SectionBlock title="Treatment Priorities" tone="slate">
                      <BulletList items={parsedNote.treatmentPriorities} />
                    </SectionBlock>
                  </div>
                ) : null}

                <SectionBlock title="SOAP Note" tone="slate">
                  <div style={{ display: 'grid', gap: '0.9rem' }}>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Subjective</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>
                        {parsedNote.subjective || 'No subjective section saved.'}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Objective</p>
                      <BulletList items={parsedNote.objective} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Assessment</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>
                        {parsedNote.soapAssessment || 'No SOAP assessment saved.'}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Plan</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>
                        {parsedNote.plan || 'No plan saved.'}
                      </p>
                    </div>
                  </div>
                </SectionBlock>
              </div>
            ) : (
              <div style={{
                flex: 1, background: 'var(--bg)', borderRadius: 14, padding: '1rem',
                fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink2)', whiteSpace: 'pre-wrap', overflowY: 'auto',
              }}>
                {displayedNote}
              </div>
            )}
          </>
        )}
      </div>

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

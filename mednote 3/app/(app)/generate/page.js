'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const NOTE_TYPES = ['SOAP','Progress','Referral','Discharge']
const SPECIALTIES = ['Primary Care','Psychiatry / Therapy','Pediatrics','Orthopedics','Urgent Care']
const ASSIST_LEVELS = ['','Independent','Min Assist (25%)','Mod Assist (50%)','Max Assist (75%)','Total Assist (100%)','Supervision','Contact Guard']

function Label({ children }) {
  return <label style={{ fontSize: 12, color: 'var(--gray)', display: 'block', marginBottom: 5 }}>{children}</label>
}
function Field({ label, children }) {
  return <div><Label>{label}</Label>{children}</div>
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({
    patientLabel: '', noteType: 'SOAP', specialty: 'Primary Care',
    diagnosis: '', visitNumber: '', precautions: '', interventions: '',
    deficits: '', assistLevel: '', response: '', plan: '', shorthandInput: '',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  // Load note for editing
  useEffect(() => {
    if (!editId) return
    fetch(`/api/notes/${editId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const n = data.note
        setForm({
          patientLabel: n.patient_label || '',
          noteType: n.note_type || 'SOAP',
          specialty: n.specialty || 'Primary Care',
          diagnosis: n.diagnosis || '',
          visitNumber: n.visit_number || '',
          precautions: n.precautions || '',
          interventions: n.interventions || '',
          deficits: n.deficits || '',
          assistLevel: n.assist_level || '',
          response: n.response || '',
          plan: n.plan || '',
          shorthandInput: n.shorthand_input || '',
        })
        setOutput(n.generated_note)
        setCurrentNoteId(n.id)
        setSaved(true)
      })
  }, [editId])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function handleGenerate() {
    if (!form.shorthandInput.trim() && !form.diagnosis.trim()) {
      setError('Please enter at least a diagnosis or visit notes.')
      return
    }
    setError('')
    setLoading(true)
    setOutput('')
    setSaved(false)

    try {
      const endpoint = currentNoteId ? `/api/notes/${currentNoteId}` : '/api/notes'
      const method = currentNoteId ? 'PUT' : 'POST'
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setOutput(data.generatedNote)
      setCurrentNoteId(data.note.id)
      setSaved(true)
      showToast(currentNoteId ? `New version saved!` : 'Note generated and saved!')
    } catch {
      setError('Failed to connect to server.')
    }
    setLoading(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleClear() {
    setForm({ patientLabel:'', noteType:'SOAP', specialty:'Primary Care', diagnosis:'', visitNumber:'', precautions:'', interventions:'', deficits:'', assistLevel:'', response:'', plan:'', shorthandInput:'' })
    setOutput('')
    setError('')
    setSaved(false)
    setCurrentNoteId(null)
  }

  const inputStyle = { marginBottom: 0 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', height: 'calc(100vh - 56px - 3.5rem)' }}>

      {/* LEFT: Inputs */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        <p style={{ fontSize: 15, fontWeight: 500 }}>Visit details</p>

        {/* Meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Field label="Note type">
            <select value={form.noteType} onChange={set('noteType')} style={inputStyle}>
              {NOTE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Specialty">
            <select value={form.specialty} onChange={set('specialty')} style={inputStyle}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Field label="Patient label (no real names)">
            <input type="text" placeholder="e.g. Patient A" value={form.patientLabel} onChange={set('patientLabel')} style={inputStyle}/>
          </Field>
          <Field label="Visit #">
            <input type="text" placeholder="e.g. 3" value={form.visitNumber} onChange={set('visitNumber')} style={inputStyle}/>
          </Field>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Structured fields</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Field label="Diagnosis / Primary condition">
              <input type="text" placeholder="e.g. L CVA with R hemiplegia" value={form.diagnosis} onChange={set('diagnosis')} style={inputStyle}/>
            </Field>
            <Field label="Precautions">
              <input type="text" placeholder="e.g. Fall risk, cardiac precautions" value={form.precautions} onChange={set('precautions')} style={inputStyle}/>
            </Field>
            <Field label="Deficits / Impairments">
              <textarea rows={2} placeholder="e.g. R UE weakness, impaired balance, decreased endurance" value={form.deficits} onChange={set('deficits')} style={{ ...inputStyle, minHeight: 'auto' }}/>
            </Field>
            <Field label="Assist level">
              <select value={form.assistLevel} onChange={set('assistLevel')} style={inputStyle}>
                {ASSIST_LEVELS.map(a => <option key={a} value={a}>{a || '— Select —'}</option>)}
              </select>
            </Field>
            <Field label="Interventions performed">
              <textarea rows={2} placeholder="e.g. Therapeutic exercise, gait training, ADL training" value={form.interventions} onChange={set('interventions')} style={{ ...inputStyle, minHeight: 'auto' }}/>
            </Field>
            <Field label="Patient response">
              <textarea rows={2} placeholder="e.g. Tolerated well, required 2 verbal cues, reported pain 3/10" value={form.response} onChange={set('response')} style={{ ...inputStyle, minHeight: 'auto' }}/>
            </Field>
            <Field label="Plan">
              <textarea rows={2} placeholder="e.g. Continue 3x/week, progress weight bearing, caregiver training" value={form.plan} onChange={set('plan')} style={{ ...inputStyle, minHeight: 'auto' }}/>
            </Field>
          </div>
        </div>

        {/* Free text */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Additional notes (optional)</p>
          <textarea
            value={form.shorthandInput}
            onChange={set('shorthandInput')}
            placeholder="Any extra shorthand, bullets, or context not covered above…"
            style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
          />
        </div>

        {error && (
          <div style={{ background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate} disabled={loading}
          style={{
            padding: 12, borderRadius: 8, border: 'none',
            background: loading ? 'var(--gray-light)' : 'var(--ink)',
            color: 'white', fontSize: 14, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Generating…' : currentNoteId ? 'Regenerate (new version) →' : 'Generate note →'}
        </button>
      </div>

      {/* RIGHT: Output */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 15, fontWeight: 500 }}>Generated note</p>
          {saved && (
            <span style={{ fontSize: 11, color: 'var(--teal)', background: 'var(--teal-light)', padding: '2px 8px', borderRadius: 100 }}>
              ✓ Saved to history
            </span>
          )}
        </div>

        <div style={{
          flex: 1, background: 'var(--bg)', borderRadius: 8, padding: '1rem',
          fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink2)',
          whiteSpace: 'pre-wrap', overflowY: 'auto', minHeight: 200,
        }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animationDelay: `${i*0.2}s` }}/>
              ))}
              <span style={{ fontSize: 13, color: 'var(--gray)', marginLeft: 4 }}>Generating note…</span>
            </div>
          ) : output ? output : (
            <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>
              Your completed clinical note will appear here after you click Generate.
            </span>
          )}
        </div>

        {output && !loading && (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={handleCopy} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: copied ? 'var(--teal)' : 'var(--ink)', color: 'white',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
              {copied ? '✓ Copied!' : 'Copy note'}
            </button>
            <button onClick={handleClear} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'white', color: 'var(--ink)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999,
          background: 'var(--ink)', color: 'white', padding: '10px 18px',
          borderRadius: 10, fontSize: 13, fontWeight: 500,
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

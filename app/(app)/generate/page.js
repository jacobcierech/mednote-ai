'use client';

import { useState } from 'react';

const VISIT_FOCUS_OPTIONS = [
  'General OT',
  'Hand Therapy',
  'Upper Extremity',
  'Neuro Rehab',
  'ADL Training',
];

const ASSIST_LEVEL_OPTIONS = [
  'Independent',
  'Modified Independent',
  'Supervision',
  'Standby Assist',
  'Contact Guard Assist',
  'Min Assist',
  'Mod Assist',
  'Max Assist',
];

const INITIAL_FORM = {
  noteType: 'SOAP',
  specialty: 'Hand Therapy',
  diagnosis: '',
  visitNumber: '',
  precautions: '',
  deficits: '',
  assistLevel: 'Min Assist',
  interventions: '',
  response: '',
  plan: '',
  shorthandInput: '',
};

const SAMPLE_FORM = {
  noteType: 'SOAP',
  specialty: 'Hand Therapy',
  diagnosis: 'Left distal radius fracture s/p ORIF',
  visitNumber: '5',
  precautions: 'NWB L UE, avoid heavy lifting, monitor pain and edema',
  deficits:
    'Decreased wrist ROM, reduced grip strength, pain with movement, mild edema, impaired fine motor coordination limiting dressing and meal prep',
  assistLevel: 'Min Assist',
  interventions:
    'AROM wrist flexion/extension, tendon glides, edema management education, scar desensitization, foam block grasp, fine motor buttoning task training',
  response:
    'Pain 3/10 at rest and 5/10 with activity. Required intermittent verbal cues for technique and pacing.',
  plan:
    'Continue OT 2x/week to address ROM, strength, edema, and functional hand use. Progress fine motor tasks and initiate HEP next session.',
  shorthandInput:
    'Patient reports difficulty opening containers, buttoning clothing, and completing meal prep due to L wrist pain and stiffness. Goal is return to independent ADLs and cooking.',
};

export default function GeneratePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [generatedNote, setGeneratedNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedNote('');
    setCopied(false);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteType: form.noteType,
          specialty: form.specialty,
          shorthandInput: form.shorthandInput,
          fields: {
            diagnosis: form.diagnosis,
            visitNumber: form.visitNumber,
            precautions: form.precautions,
            deficits: form.deficits,
            assistLevel: form.assistLevel,
            interventions: form.interventions,
            response: form.response,
            plan: form.plan,
          },
        }),
      });

      const data = await res.json();

      const extractedNote =
        (typeof data === 'string' && data) ||
        (typeof data.note === 'string' && data.note) ||
        (typeof data.generated_note === 'string' && data.generated_note) ||
        (data.note && typeof data.note === 'object' && data.note.generated_note) ||
        (data.data && typeof data.data === 'object' && data.data.generated_note) ||
        '';

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate note.');
      }

      setGeneratedNote(extractedNote || 'No note returned.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedNote) return;
    await navigator.clipboard.writeText(generatedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFillSample = () => {
    setForm(SAMPLE_FORM);
    setGeneratedNote('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <form onSubmit={handleGenerate} className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-5">
            <div className="mb-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              Outpatient Occupational Therapy
            </div>
            <h1 className="text-2xl font-bold text-slate-800">OT SOAP Note Generator</h1>
            <p className="mt-1 text-sm text-slate-500">
              Hand therapy and outpatient OT focused documentation.
            </p>
          </div>

          <div className="mb-4 flex gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Fill Sample
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Visit Focus</label>
              <select
                value={form.specialty}
                onChange={(e) => updateField('specialty', e.target.value)}
                className="input"
              >
                {VISIT_FOCUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Diagnosis</label>
              <input
                placeholder="e.g. Left distal radius fracture s/p ORIF"
                value={form.diagnosis}
                onChange={(e) => updateField('diagnosis', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Visit Number</label>
              <input
                placeholder="e.g. 5"
                value={form.visitNumber}
                onChange={(e) => updateField('visitNumber', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Precautions</label>
              <input
                placeholder="e.g. NWB L UE, avoid heavy lifting"
                value={form.precautions}
                onChange={(e) => updateField('precautions', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Deficits / Impairments</label>
              <textarea
                placeholder="e.g. Decreased wrist ROM, reduced grip strength, mild edema..."
                value={form.deficits}
                onChange={(e) => updateField('deficits', e.target.value)}
                className="input min-h-[90px]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Assist Level</label>
              <select
                value={form.assistLevel}
                onChange={(e) => updateField('assistLevel', e.target.value)}
                className="input"
              >
                {ASSIST_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Interventions</label>
              <textarea
                placeholder="e.g. AROM wrist flexion/extension, tendon glides..."
                value={form.interventions}
                onChange={(e) => updateField('interventions', e.target.value)}
                className="input min-h-[90px]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Patient Response</label>
              <textarea
                placeholder="e.g. Pain 3/10 at rest and 5/10 with activity..."
                value={form.response}
                onChange={(e) => updateField('response', e.target.value)}
                className="input min-h-[90px]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Plan</label>
              <textarea
                placeholder="e.g. Continue OT 2x/week..."
                value={form.plan}
                onChange={(e) => updateField('plan', e.target.value)}
                className="input min-h-[90px]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Additional Notes</label>
              <textarea
                placeholder="e.g. Difficulty opening containers and completing meal prep..."
                value={form.shorthandInput}
                onChange={(e) => updateField('shorthandInput', e.target.value)}
                className="input min-h-[110px]"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate SOAP Note'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">SOAP Note Preview</h2>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border px-3 py-1 text-sm"
              disabled={!generatedNote}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="min-h-[500px] rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
            {generatedNote || 'Your generated note will appear here.'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          background: white;
        }

        .input:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.12);
        }
      `}</style>
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';

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
    'Pain 3/10 at rest and 5/10 with activity. Required intermittent verbal cues for technique and pacing. Demonstrated good tolerance to session.',
  plan:
    'Continue OT 2x/week to address ROM, strength, edema, and functional hand use. Progress fine motor tasks and initiate/reinforce HEP next session.',
  shorthandInput:
    'Patient reports difficulty opening containers, buttoning clothing, and completing meal prep due to L wrist pain and stiffness. Goal is return to independent ADLs and cooking.',
};

export default function GeneratePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [generatedNote, setGeneratedNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const pageTitle = useMemo(() => {
    return `${form.specialty || 'Outpatient OT'} Note Generator`;
  }, [form.specialty]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setCopied(false);

    try {
      const payload = {
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
      };

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to generate note.');
      }

      const data = await res.json();
      setGeneratedNote(data.note || '');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedNote) return;
    try {
      await navigator.clipboard.writeText(generatedNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Unable to copy note.');
    }
  };

  const handleFillSample = () => {
    setForm(SAMPLE_FORM);
    setGeneratedNote('');
    setError('');
    setCopied(false);
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    setGeneratedNote('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              Outpatient Occupational Therapy
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Generate clinic-ready OT SOAP notes with a cleaner outpatient workflow,
              hand therapy support, and function-focused documentation.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Fill Sample
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleGenerate}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Session Input</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter visit details and generate a more natural outpatient OT note.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <Label>Note Type</Label>
                <select
                  value={form.noteType}
                  onChange={(e) => updateField('noteType', e.target.value)}
                  className={inputClass}
                >
                  <option value="SOAP">SOAP</option>
                </select>
              </Field>

              <Field>
                <Label>Visit Focus</Label>
                <select
                  value={form.specialty}
                  onChange={(e) => updateField('specialty', e.target.value)}
                  className={inputClass}
                >
                  {VISIT_FOCUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <Label>Diagnosis / Primary Condition</Label>
                <input
                  value={form.diagnosis}
                  onChange={(e) => updateField('diagnosis', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Left distal radius fracture s/p ORIF"
                />
              </Field>

              <Field>
                <Label>Visit Number</Label>
                <input
                  value={form.visitNumber}
                  onChange={(e) => updateField('visitNumber', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 5"
                />
              </Field>

              <Field className="md:col-span-2">
                <Label>Precautions</Label>
                <input
                  value={form.precautions}
                  onChange={(e) => updateField('precautions', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. NWB L UE, avoid heavy lifting"
                />
              </Field>

              <Field className="md:col-span-2">
                <Label>Deficits / Impairments</Label>
                <textarea
                  value={form.deficits}
                  onChange={(e) => updateField('deficits', e.target.value)}
                  className={textareaClass}
                  placeholder="e.g. Decreased wrist ROM, reduced grip strength, pain with movement, mild edema, impaired fine motor coordination limiting dressing and meal prep"
                />
              </Field>

              <Field>
                <Label>Assist Level</Label>
                <select
                  value={form.assistLevel}
                  onChange={(e) => updateField('assistLevel', e.target.value)}
                  className={inputClass}
                >
                  {ASSIST_LEVEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field className="md:col-span-2">
                <Label>Interventions Performed</Label>
                <textarea
                  value={form.interventions}
                  onChange={(e) => updateField('interventions', e.target.value)}
                  className={textareaClass}
                  placeholder="e.g. AROM wrist flexion/extension, tendon glides, edema management education, scar desensitization, foam block grasp, fine motor buttoning task training"
                />
              </Field>

              <Field className="md:col-span-2">
                <Label>Patient Response</Label>
                <textarea
                  value={form.response}
                  onChange={(e) => updateField('response', e.target.value)}
                  className={textareaClass}
                  placeholder="e.g. Pain 3/10 at rest and 5/10 with activity. Required intermittent verbal cues for technique and pacing."
                />
              </Field>

              <Field className="md:col-span-2">
                <Label>Plan / Next Steps</Label>
                <textarea
                  value={form.plan}
                  onChange={(e) => updateField('plan', e.target.value)}
                  className={textareaClass}
                  placeholder="e.g. Continue OT 2x/week to address ROM, strength, edema, and functional hand use. Progress fine motor tasks and initiate HEP next session."
                />
              </Field>

              <Field className="md:col-span-2">
                <Label>Additional Provider Notes</Label>
                <textarea
                  value={form.shorthandInput}
                  onChange={(e) => updateField('shorthandInput', e.target.value)}
                  className={textareaClass}
                  placeholder="e.g. Patient reports difficulty opening containers, buttoning clothing, and completing meal prep due to L wrist pain and stiffness. Goal is return to independent ADLs and cooking."
                />
              </Field>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Generating Note...' : 'Generate SOAP Note'}
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">SOAP Note Preview</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Clean, outpatient-style OT documentation ready to review and copy.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!generatedNote}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? 'Copied' : 'Copy Note'}
              </button>
            </div>

            <div className="min-h-[540px] rounded-2xl border border-slate-200 bg-slate-50 p-5">
              {generatedNote ? (
                <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-slate-800">
                  {generatedNote}
                </pre>
              ) : (
                <div className="flex h-full min-h-[500px] items-center justify-center text-center text-sm text-slate-500">
                  Your generated outpatient OT note will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

function Label({ children }) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100';

const textareaClass =
  'min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100';
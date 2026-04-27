'use client';

import { useEffect, useMemo, useState } from 'react';
import { createEmptyCase } from '../../../lib/caseTemplates';
import { getRecommendations } from '../../../lib/clinicalLogic';

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

const VISIT_FOCUS_OPTIONS = [
  'Outpatient Orthopedics',
  'Hand Therapy',
  'Upper Extremity',
  'Neuro Rehab',
  'ADL Training',
];

const DEFICIT_OPTIONS = [
  ['shoulder_rom', 'Shoulder ROM Limitation'],
  ['shoulder_strength', 'Shoulder Weakness'],
  ['wrist_elbow_rom', 'Wrist / Elbow ROM Limitation'],
  ['hand_weakness', 'Hand Weakness'],
  ['grip_pinch_weakness', 'Grip / Pinch Weakness'],
  ['fine_motor_coordination', 'Fine Motor Coordination Deficit'],
  ['decreased_dexterity', 'Decreased Dexterity'],
  ['pain', 'Pain'],
  ['edema', 'Edema'],
  ['impaired_scar_mobility', 'Impaired Scar Mobility'],
  ['tendon_gliding_limitation', 'Tendon Gliding Limitation'],
  ['reduced_activity_tolerance', 'Reduced Activity Tolerance'],
];

const LIMITATION_OPTIONS = [
  ['ub_dressing', 'Upper Body Dressing'],
  ['grooming', 'Grooming'],
  ['bathing', 'Bathing'],
  ['toileting', 'Toileting'],
  ['feeding', 'Feeding'],
  ['home_management', 'Home Management'],
  ['handwriting', 'Handwriting'],
  ['computer_use', 'Computer Use'],
  ['opening_containers', 'Opening Containers'],
  ['buttoning_zippers', 'Buttons / Zippers'],
  ['work_tasks', 'Work Tasks'],
  ['reaching_overhead', 'Reaching Overhead'],
];

const SETTING_OPTIONS = [
  ['outpatient_orthopedics', 'Outpatient Orthopedics'],
  ['hand_therapy', 'Hand Therapy'],
  ['acute', 'Acute Care'],
];

const SAMPLE_FORM = {
  patientName: 'Jamie Carter',
  visitFocus: 'Hand Therapy',
  diagnosis: 'Right distal radius fracture s/p ORIF',
  visitNumber: '6',
  precautions: 'No heavy lifting over 5 lb with R UE; monitor pain and swelling',
  caseContext:
    'Patient is returning to outpatient OT following right distal radius fracture with ongoing stiffness, weakness, and difficulty with fine motor hand use affecting dressing, meal prep, and work-related computer tasks.',
  subjectiveReport:
    'Patient reports continued stiffness in the right wrist in the morning and difficulty opening jars, fastening clothing, and typing for longer periods. States wrist feels better than last week but still sore after household tasks.',
  painToday: '2/10 at rest, 4/10 with wrist use',
  interventionsCompleted:
    'Completed moist heat for tissue prep followed by AROM wrist flexion/extension and forearm supination/pronation. Performed tendon glides, gentle wrist maze activity, pinch strengthening with foam blocks, and fine motor in-hand manipulation task using coins/buttons. Reviewed edema management and joint protection strategies during meal prep and dressing tasks.',
  patientResponse:
    'Required intermittent verbal and tactile cues to avoid compensatory shoulder movement during wrist ROM tasks. Demonstrated mild fatigue with pinch strengthening but completed session without increase in swelling. Continues to show functional limitation with sustained grasp and fine motor coordination.',
  assistLevel: 'Min Assist',
  homeProgram:
    'Reviewed home exercise program including tendon glides, wrist AROM, edema control, and pacing strategies for household tasks.',
  planNextVisit:
    'Progress wrist ROM and light strengthening, continue fine motor coordination training, and advance functional task simulation for dressing and kitchen activities.',
};

const SAMPLE_EVAL = {
  dominantSide: 'Right',
  postopStatus: '6 weeks s/p ORIF',
  chiefComplaint:
    'Right wrist stiffness, reduced grip, and pain limiting dressing, meal prep, and keyboard use.',
  occupationalProfile:
    'Works at a computer, prepares meals at home, and values independent self-care and household management.',
  patientGoals:
    'Return to independent meal prep, typing for full workday, and fastener management without pain escalation.',
  plof:
    'Independent with ADLs, meal prep, typing for full workday, and home management prior to injury.',
  clof:
    'Needs extra time for dressing fasteners, avoids jars and heavier kitchen tasks, and can only tolerate brief periods of typing.',
  pain: 'Reports soreness after repetitive hand use and prolonged gripping.',
  rom:
    'Reduced wrist flexion/extension and forearm supination limiting sustained functional hand positioning.',
  strength:
    'Decreased grip and pinch strength contributing to impaired container management and meal prep tasks.',
  standardizedAssessments:
    'QuickDASH 43.2. Grip strength and pinch testing below age-matched expectations.',
  functionalDeficits:
    'Difficulty with meal prep, jar opening, fastener management, and sustained keyboard use.',
  barriers:
    'Pain with repetitive use, stiffness after inactivity, and reduced sustained grasp endurance.',
  strengthsSummary:
    'Good insight, intact cognition, motivated return to work tasks, and consistent home program follow-through.',
  clinicalObservations:
    'Observed guarded wrist use, reduced in-hand manipulation efficiency, and compensatory proximal movement during fine motor tasks.',
  deficit: 'grip_pinch_weakness',
  limitation: 'opening_containers',
  setting: 'hand_therapy',
};

const INITIAL_FORM = {
  patientName: '',
  visitFocus: 'Outpatient Orthopedics',
  diagnosis: '',
  visitNumber: '',
  precautions: '',
  caseContext: '',
  subjectiveReport: '',
  painToday: '',
  interventionsCompleted: '',
  patientResponse: '',
  assistLevel: 'Min Assist',
  homeProgram: '',
  planNextVisit: '',
};

const INITIAL_EVAL = {
  dominantSide: '',
  postopStatus: '',
  chiefComplaint: '',
  occupationalProfile: '',
  patientGoals: '',
  plof: '',
  clof: '',
  pain: '',
  rom: '',
  strength: '',
  standardizedAssessments: '',
  functionalDeficits: '',
  barriers: '',
  strengthsSummary: '',
  clinicalObservations: '',
  deficit: 'grip_pinch_weakness',
  limitation: 'opening_containers',
  setting: 'outpatient_orthopedics',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/60 bg-white/85 p-7 shadow-[0_18px_44px_rgba(27,53,87,0.08)] backdrop-blur">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function formatSoapNote(soapNote) {
  return [
    'Subjective:',
    soapNote.subjective,
    '',
    'Objective:',
    ...soapNote.objective.map((item) => `- ${item}`),
    '',
    'SOAP Assessment:',
    soapNote.assessment,
    '',
    'Plan:',
    soapNote.plan,
  ].join('\n');
}

function formatEvalOutput(evalResult) {
  if (!evalResult) return '';

  return [
    'Evaluation Summary:',
    evalResult.evaluationSummary,
    '',
    'Evaluation Assessment:',
    evalResult.assessment,
    '',
    'Clinical Connections:',
    ...evalResult.clinicalConnections.map((item) => `- ${item}`),
    '',
    'Treatment Priorities:',
    ...evalResult.treatmentPriorities.map((item) => `- ${item}`),
  ].join('\n');
}

function formatFullClientNote({ evalResult, soapNote }) {
  return [formatEvalOutput(evalResult), formatSoapNote(soapNote)]
    .filter(Boolean)
    .join('\n\n');
}

function buildCasePayload(form, evalData, recommendations) {
  return {
    patientInfo: {
      name: form.patientName,
      diagnosis: form.diagnosis,
      dominantSide: evalData.dominantSide,
      setting: evalData.setting,
      precautions: form.precautions,
      postopStatus: evalData.postopStatus,
    },
    eval: {
      chiefComplaint: evalData.chiefComplaint,
      occupationalProfile: evalData.occupationalProfile,
      patientGoals: evalData.patientGoals,
      plof: evalData.plof,
      clof: evalData.clof,
      pain: evalData.pain,
      rom: evalData.rom,
      strength: evalData.strength,
      standardizedAssessments: evalData.standardizedAssessments,
      functionalDeficits: evalData.functionalDeficits,
      barriers: evalData.barriers,
      strengthsSummary: evalData.strengthsSummary,
      clinicalObservations: evalData.clinicalObservations,
      deficits: [evalData.deficit],
      functionalLimitations: [evalData.limitation],
      assessmentResults: recommendations.assessments,
    },
    planOfCare: {
      shortTermGoals: [recommendations.shortGoal],
      longTermGoals: [recommendations.longGoal],
      interventions: recommendations.interventions,
      frequency: '',
      duration: '',
    },
    visits: [],
    discharge: null,
  };
}

export default function SoapPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [evalData, setEvalData] = useState(INITIAL_EVAL);
  const [evalResult, setEvalResult] = useState(null);
  const [soapNote, setSoapNote] = useState(null);
  const [error, setError] = useState('');
  const [evalError, setEvalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvalLoading, setIsEvalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedEval, setCopiedEval] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [caseSaved, setCaseSaved] = useState(false);

  const recommendations = useMemo(
    () =>
      getRecommendations(
        evalData.deficit,
        evalData.limitation,
        form.assistLevel.toLowerCase(),
        evalData.setting
      ),
    [evalData.deficit, evalData.limitation, evalData.setting, form.assistLevel]
  );

  useEffect(() => {
    try {
      const savedCase = localStorage.getItem('mednote_active_case');
      if (!savedCase) return;

      const parsed = JSON.parse(savedCase);

      setForm((current) => ({
        ...current,
        patientName: parsed.patientInfo?.name || current.patientName,
        diagnosis: parsed.patientInfo?.diagnosis || current.diagnosis,
        precautions: parsed.patientInfo?.precautions || current.precautions,
        caseContext:
          parsed.eval?.occupationalProfile ||
          parsed.eval?.chiefComplaint ||
          current.caseContext,
      }));

      setEvalData((current) => ({
        ...current,
        dominantSide: parsed.patientInfo?.dominantSide || current.dominantSide,
        postopStatus: parsed.patientInfo?.postopStatus || current.postopStatus,
        chiefComplaint: parsed.eval?.chiefComplaint || current.chiefComplaint,
        occupationalProfile:
          parsed.eval?.occupationalProfile || current.occupationalProfile,
        patientGoals: parsed.eval?.patientGoals || current.patientGoals,
        plof: parsed.eval?.plof || current.plof,
        clof: parsed.eval?.clof || current.clof,
        pain: parsed.eval?.pain || current.pain,
        rom: parsed.eval?.rom || current.rom,
        strength: parsed.eval?.strength || current.strength,
        standardizedAssessments:
          parsed.eval?.standardizedAssessments ||
          current.standardizedAssessments,
        functionalDeficits:
          parsed.eval?.functionalDeficits || current.functionalDeficits,
        barriers: parsed.eval?.barriers || current.barriers,
        strengthsSummary:
          parsed.eval?.strengthsSummary || current.strengthsSummary,
        clinicalObservations:
          parsed.eval?.clinicalObservations || current.clinicalObservations,
        deficit: parsed.eval?.deficits?.[0] || current.deficit,
        limitation:
          parsed.eval?.functionalLimitations?.[0] || current.limitation,
        setting: parsed.patientInfo?.setting || current.setting,
      }));
    } catch (loadError) {
      console.error('Failed to load saved case context:', loadError);
    }
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setCaseSaved(false);
  };

  const updateEvalField = (key, value) => {
    setEvalData((prev) => ({ ...prev, [key]: value }));
    setCaseSaved(false);
  };

  const handleFillSample = () => {
    setForm(SAMPLE_FORM);
    setEvalData(SAMPLE_EVAL);
    setEvalResult(null);
    setSoapNote(null);
    setError('');
    setEvalError('');
    setCopied(false);
    setCopiedEval(false);
    setSaveMessage('');
    setCaseSaved(false);
  };

  const handleSaveCase = () => {
    const nextCase = buildCasePayload(form, evalData, recommendations);
    localStorage.setItem('mednote_active_case', JSON.stringify(nextCase));
    setCaseSaved(true);
  };

  const applyRecommendationsToVisit = () => {
    setForm((prev) => ({
      ...prev,
      caseContext:
        prev.caseContext ||
        [
          evalData.chiefComplaint,
          evalData.occupationalProfile,
          evalData.clof,
          evalData.clinicalObservations,
        ]
          .filter(Boolean)
          .join(' '),
      interventionsCompleted:
        prev.interventionsCompleted ||
        recommendations.interventions.slice(0, 2).join(' '),
      planNextVisit:
        prev.planNextVisit ||
        `${recommendations.shortGoal} ${recommendations.longGoal}`,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSoapNote(null);
    setCopied(false);
    setSaveMessage('');

    try {
      const response = await fetch('/api/ai/soap-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: form.patientName,
          visitFocus: form.visitFocus,
          diagnosis: form.diagnosis,
          visitNumber: form.visitNumber,
          precautions: form.precautions,
          caseContext: [
            form.caseContext,
            evalData.chiefComplaint,
            evalData.occupationalProfile,
            evalData.clof,
            evalData.patientGoals,
            evalData.rom,
            evalData.strength,
            evalData.standardizedAssessments,
            evalData.functionalDeficits,
            evalData.barriers,
            evalData.strengthsSummary,
            evalData.clinicalObservations,
          ]
            .filter(Boolean)
            .join('\n'),
          evaluationData: {
            setting: evalData.setting,
            patientGoals: evalData.patientGoals,
            pain: evalData.pain,
            rom: evalData.rom,
            strength: evalData.strength,
            standardizedAssessments: evalData.standardizedAssessments,
            functionalDeficits:
              evalData.functionalDeficits ||
              [evalData.clof, evalData.limitation].filter(Boolean).join('. '),
            barriers: evalData.barriers,
            strengths: evalData.strengthsSummary,
            clinicalObservations: evalData.clinicalObservations,
          },
          visitData: {
            subjectiveReport: form.subjectiveReport,
            painToday: form.painToday || evalData.pain,
            interventionsCompleted:
              form.interventionsCompleted ||
              recommendations.interventions.slice(0, 2).join(' '),
            patientResponse: form.patientResponse,
            assistLevel: form.assistLevel,
            homeProgram: form.homeProgram,
            planNextVisit:
              form.planNextVisit ||
              `${recommendations.shortGoal} ${recommendations.longGoal}`,
          },
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate SOAP note.');
      }

      const nextSoapNote = data?.soapNote;

      if (
        !nextSoapNote ||
        typeof nextSoapNote.subjective !== 'string' ||
        !Array.isArray(nextSoapNote.objective) ||
        typeof nextSoapNote.assessment !== 'string' ||
        typeof nextSoapNote.plan !== 'string'
      ) {
        throw new Error('The AI response was not in the expected SOAP format.');
      }

      setSoapNote(nextSoapNote);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEval = async () => {
    setIsEvalLoading(true);
    setEvalError('');
    setEvalResult(null);
    setCopiedEval(false);

    try {
      const response = await fetch('/api/ai/eval-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: form.patientName,
          diagnosis: form.diagnosis,
          setting: evalData.setting,
          patientGoals: evalData.patientGoals,
          pain: evalData.pain,
          rom: evalData.rom,
          strength: evalData.strength,
          standardizedAssessments: evalData.standardizedAssessments,
          functionalDeficits:
            evalData.functionalDeficits ||
            [evalData.clof, evalData.limitation].filter(Boolean).join('. '),
          barriers: evalData.barriers,
          strengths: evalData.strengthsSummary,
          clinicalObservations: evalData.clinicalObservations,
          occupationalProfile: evalData.occupationalProfile,
          plof: evalData.plof,
          clof: evalData.clof,
          precautions: form.precautions,
          postopStatus: evalData.postopStatus,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate evaluation output.');
      }

      const nextEval = data?.evalResult;
      if (
        !nextEval ||
        typeof nextEval.evaluationSummary !== 'string' ||
        typeof nextEval.assessment !== 'string' ||
        !Array.isArray(nextEval.clinicalConnections) ||
        !Array.isArray(nextEval.treatmentPriorities)
      ) {
        throw new Error('The AI response was not in the expected eval format.');
      }

      setEvalResult(nextEval);
    } catch (nextError) {
      setEvalError(nextError.message || 'Something went wrong.');
    } finally {
      setIsEvalLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!soapNote) return;

    try {
      await navigator.clipboard.writeText(
        formatFullClientNote({ evalResult, soapNote })
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Unable to copy client note.');
    }
  };

  const handleSaveToHistory = async () => {
    if (!soapNote) return;

    setIsSaving(true);
    setError('');
    setSaveMessage('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientLabel: form.patientName || 'Unnamed Patient',
          noteType: 'SOAP',
          specialty: form.visitFocus,
          shorthandInput: [
            form.subjectiveReport,
            form.caseContext,
            evalData.chiefComplaint,
            evalData.occupationalProfile,
            evalData.patientGoals,
            evalData.rom,
            evalData.strength,
            evalData.standardizedAssessments,
            evalData.functionalDeficits,
            evalData.barriers,
            evalData.strengthsSummary,
            evalData.clinicalObservations,
          ]
            .filter(Boolean)
            .join('\n\n'),
          diagnosis: form.diagnosis,
          visitNumber: form.visitNumber,
          precautions: form.precautions,
          interventions:
            form.interventionsCompleted ||
            recommendations.interventions.slice(0, 2).join(' '),
          deficits: `${evalData.deficit}; ${evalData.limitation}`,
          assistLevel: form.assistLevel,
          response: form.patientResponse,
          plan: form.planNextVisit || recommendations.longGoal,
          generatedNote: formatFullClientNote({ evalResult, soapNote }),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save note to history.');
      }

      setSaveMessage('Client note saved to History.');
    } catch (saveError) {
      setError(saveError.message || 'Failed to save SOAP note.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyEval = async () => {
    if (!evalResult) return;

    try {
      await navigator.clipboard.writeText(formatEvalOutput(evalResult));
      setCopiedEval(true);
      setTimeout(() => setCopiedEval(false), 1800);
    } catch {
      setEvalError('Unable to copy evaluation output.');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1500px] px-7 py-10">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
              OT Workflow
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              New Client Workspace
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
              Fast outpatient OT workflow for evaluation intake, clinical
              reasoning, treatment planning, and visit documentation in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Fill Sample
            </button>
            <button
              type="button"
              onClick={handleSaveCase}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(17,32,52,0.16)] transition hover:bg-slate-800"
            >
              Save Eval Context
            </button>
          </div>
        </div>

        {caseSaved ? (
          <div className="mb-6 rounded-3xl border border-teal-200 bg-teal-50/90 px-5 py-4 text-sm text-teal-700 shadow-sm">
            Evaluation context saved to active case.
          </div>
        ) : null}

        <div className="grid gap-7 xl:grid-cols-[1.32fr_0.92fr]">
          <div className="space-y-6">
            <SectionCard
              title="Evaluation Intake"
              description="Enter the high-yield eval findings once so the app can generate stronger OT-specific assessment language and support later visit notes."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Patient Name">
                  <input
                    value={form.patientName}
                    onChange={(e) => updateField('patientName', e.target.value)}
                    className={inputClass}
                    placeholder="Client name"
                  />
                </Field>

                <Field label="Diagnosis">
                  <input
                    value={form.diagnosis}
                    onChange={(e) => updateField('diagnosis', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Distal radius fracture s/p ORIF"
                  />
                </Field>

                <Field label="Dominant Side">
                  <input
                    value={evalData.dominantSide}
                    onChange={(e) =>
                      updateEvalField('dominantSide', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Right or left"
                  />
                </Field>

                <Field label="Post-op Status">
                  <input
                    value={evalData.postopStatus}
                    onChange={(e) =>
                      updateEvalField('postopStatus', e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. 6 weeks s/p ORIF"
                  />
                </Field>

                <Field label="Precautions">
                  <input
                    value={form.precautions}
                    onChange={(e) => updateField('precautions', e.target.value)}
                    className={inputClass}
                    placeholder="Movement or weight-bearing precautions"
                  />
                </Field>

                <Field label="Care Setting">
                  <select
                    value={evalData.setting}
                    onChange={(e) => updateEvalField('setting', e.target.value)}
                    className={inputClass}
                  >
                    {SETTING_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4 grid gap-4">
                <Field label="Patient Goals">
                  <textarea
                    value={evalData.patientGoals}
                    onChange={(e) =>
                      updateEvalField('patientGoals', e.target.value)
                    }
                    className={`${inputClass} min-h-[72px]`}
                    placeholder="Return to typing full workday, independent dressing fasteners, meal prep without pain, safe shower transfers"
                  />
                </Field>

                <Field label="Chief Complaint">
                  <textarea
                    value={evalData.chiefComplaint}
                    onChange={(e) =>
                      updateEvalField('chiefComplaint', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Pain/stiffness/weakness plus the main occupational complaint: difficulty opening containers, grooming, dressing, keyboarding, meal prep"
                  />
                </Field>

                <Field label="Occupational Profile">
                  <textarea
                    value={evalData.occupationalProfile}
                    onChange={(e) =>
                      updateEvalField('occupationalProfile', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Work role, home demands, meaningful routines, hand dominance, caregiver role, school tasks, hobbies"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Prior Level Of Function">
                    <textarea
                      value={evalData.plof}
                      onChange={(e) => updateEvalField('plof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Independent with all ADLs/IADLs, full-time typing, cooking, lifting laundry basket, driving"
                    />
                  </Field>

                  <Field label="Current Level Of Function">
                    <textarea
                      value={evalData.clof}
                      onChange={(e) => updateEvalField('clof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Needs extra time for buttons, avoids jars, limited sustained grasp for meal prep, reduced keyboard tolerance"
                    />
                  </Field>
                </div>

                <Field label="Pain / Symptom Summary">
                  <textarea
                    value={evalData.pain}
                    onChange={(e) => updateEvalField('pain', e.target.value)}
                    className={`${inputClass} min-h-[72px]`}
                    placeholder="Pain location/intensity, symptom irritability, morning stiffness, edema, numbness, symptom provocation with task use"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="ROM Findings">
                    <textarea
                      value={evalData.rom}
                      onChange={(e) => updateEvalField('rom', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="AROM/PROM loss, end-range pain, compensatory movement, limited supination, overhead reach restrictions"
                    />
                  </Field>

                  <Field label="Strength Findings">
                    <textarea
                      value={evalData.strength}
                      onChange={(e) =>
                        updateEvalField('strength', e.target.value)
                      }
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="MMT, grip/pinch weakness, decreased endurance, poor distal control, reduced proximal stability"
                    />
                  </Field>
                </div>

                <Field label="Standardized Assessments">
                  <textarea
                    value={evalData.standardizedAssessments}
                    onChange={(e) =>
                      updateEvalField('standardizedAssessments', e.target.value)
                    }
                    className={`${inputClass} min-h-[72px]`}
                    placeholder="QuickDASH 43.2, COPM scores, 9-Hole Peg, grip/pinch values, Box and Block, AMPAC"
                  />
                </Field>

                <Field label="Functional Deficits">
                  <textarea
                    value={evalData.functionalDeficits || ''}
                    onChange={(e) =>
                      updateEvalField('functionalDeficits', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Specific ADL/IADL/work deficits: fastening bra, opening medication bottles, typing, meal prep, grooming, handwriting"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Barriers">
                    <textarea
                      value={evalData.barriers}
                      onChange={(e) => updateEvalField('barriers', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Pain with repetition, edema, fear avoidance, fatigue, low frustration tolerance, limited support, poor pacing"
                    />
                  </Field>

                  <Field label="Strengths">
                    <textarea
                      value={evalData.strengthsSummary}
                      onChange={(e) =>
                        updateEvalField('strengthsSummary', e.target.value)
                      }
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Motivated, good insight, strong family support, intact cognition, good HEP carryover, prior independence"
                    />
                  </Field>
                </div>

                <Field label="Clinical Observations">
                  <textarea
                    value={evalData.clinicalObservations}
                    onChange={(e) =>
                      updateEvalField('clinicalObservations', e.target.value)
                    }
                    className={`${inputClass} min-h-[96px]`}
                    placeholder="Observed guarding, compensatory shoulder hike, reduced in-hand manipulation, dropping items, slowed bilateral coordination, poor pacing"
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Recommendation Builder"
              description="Use one primary deficit and one main occupational limitation to quickly build targeted OT language."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Primary Deficit">
                  <select
                    value={evalData.deficit}
                    onChange={(e) => updateEvalField('deficit', e.target.value)}
                    className={inputClass}
                  >
                    {DEFICIT_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Functional Limitation">
                  <select
                    value={evalData.limitation}
                    onChange={(e) =>
                      updateEvalField('limitation', e.target.value)
                    }
                    className={inputClass}
                  >
                    {LIMITATION_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Assist Level">
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
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={applyRecommendationsToVisit}
                  className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(21,122,110,0.2)] transition hover:opacity-95"
                >
                  Apply To Visit Note
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_14px_28px_rgba(27,53,87,0.05)]">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Assessment Recommendations
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {recommendations.assessments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white to-teal-50/50 p-5 shadow-[0_14px_28px_rgba(27,53,87,0.05)]">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Intervention Recommendations
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {recommendations.interventions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white to-sky-50/50 p-5 shadow-[0_14px_28px_rgba(27,53,87,0.05)]">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Suggested Goals
                  </h3>
                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">Short-term:</span>{' '}
                    {recommendations.shortGoal}
                  </p>
                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">Long-term:</span>{' '}
                    {recommendations.longGoal}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white to-amber-50/60 p-5 shadow-[0_14px_28px_rgba(27,53,87,0.05)]">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Clinical Reasoning
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {recommendations.reasoning}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="AI Evaluation + Assessment"
              description="Generate efficient OT eval language that connects impairments, occupational deficits, and skilled need."
            >
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateEval}
                  disabled={isEvalLoading}
                  className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(17,32,52,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isEvalLoading
                    ? 'Generating Evaluation...'
                    : 'Generate OT Eval + Assessment'}
                </button>

                {evalResult ? (
                  <button
                    type="button"
                    onClick={handleCopyEval}
                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {copiedEval ? 'Copied' : 'Copy Eval Output'}
                  </button>
                ) : null}
              </div>

              {evalError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {evalError}
                </div>
              ) : null}

              {!evalResult && !isEvalLoading && !evalError ? (
                <p className="mt-4 text-sm text-slate-500">
                  Generate OT-specific eval and assessment wording from the
                  intake findings above.
                </p>
              ) : null}

              {evalResult ? (
                <div className="mt-5 space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Evaluation Summary
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {evalResult.evaluationSummary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Assessment
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {evalResult.assessment}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Clinical Connections
                    </h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {evalResult.clinicalConnections.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Treatment Priorities
                    </h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {evalResult.treatmentPriorities.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Visit SOAP Input"
              description="Use the same client context to write a fast, clinically specific OT visit note."
            >
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Visit Focus">
                    <select
                      value={form.visitFocus}
                      onChange={(e) => updateField('visitFocus', e.target.value)}
                      className={inputClass}
                    >
                      {VISIT_FOCUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Visit Number">
                    <input
                      value={form.visitNumber}
                      onChange={(e) => updateField('visitNumber', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 6"
                    />
                  </Field>
                </div>

                <div className="mt-4 grid gap-4">
                  <Field label="Case Context">
                    <textarea
                      value={form.caseContext}
                      onChange={(e) => updateField('caseContext', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Brief clinical setup: diagnosis history, current phase, key OT rationale, meaningful task context"
                    />
                  </Field>

                <Field label="Subjective Report">
                  <textarea
                    value={form.subjectiveReport}
                    onChange={(e) =>
                      updateField('subjectiveReport', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Patient-reported symptoms and functional complaints today: stiffness with buttons, pain after typing, difficulty opening jars"
                  />
                </Field>

                  <Field label="Pain Today">
                    <input
                      value={form.painToday}
                      onChange={(e) => updateField('painToday', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 2/10 at rest, 4/10 with activity"
                    />
                  </Field>

                <Field label="Interventions Completed">
                  <textarea
                    value={form.interventionsCompleted}
                    onChange={(e) =>
                      updateField('interventionsCompleted', e.target.value)
                    }
                    className={`${inputClass} min-h-[100px]`}
                    placeholder="Skilled OT provided: ROM, tendon glides, task-specific ADL retraining, ergonomic education, edema management, fine motor task practice"
                  />
                </Field>

                <Field label="Patient Response / Assessment Cues">
                  <textarea
                    value={form.patientResponse}
                    onChange={(e) =>
                      updateField('patientResponse', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Cueing, compensations, symptom response, fatigue, movement quality, task tolerance, functional carryover"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Home Program / Education">
                      <textarea
                        value={form.homeProgram}
                        onChange={(e) => updateField('homeProgram', e.target.value)}
                        className={`${inputClass} min-h-[88px]`}
                        placeholder="HEP progression, joint protection, pacing, edema control, splint use, caregiver education"
                      />
                  </Field>

                  <Field label="Plan For Next Visit">
                      <textarea
                        value={form.planNextVisit}
                        onChange={(e) =>
                          updateField('planNextVisit', e.target.value)
                        }
                        className={`${inputClass} min-h-[88px]`}
                        placeholder="Progress ROM/strength, advance fine motor demand, increase sustained grasp tolerance, simulate work or home tasks"
                      />
                  </Field>
                </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-2xl bg-gradient-to-r from-slate-900 to-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(17,32,52,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isLoading ? 'Generating Visit Note...' : 'Generate OT SOAP Note'}
                  </button>

                  {isLoading ? (
                    <p className="text-sm text-slate-500">
                      Building structured OT documentation with clinical reasoning...
                    </p>
                  ) : null}
                </div>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
              </form>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Workflow"
              description="Built for fast OT documentation with stronger clinical specificity."
            >
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Capture evaluation context and occupational profile.</li>
                <li>Generate the eval summary and assessment from the intake.</li>
                <li>Review assessment and intervention recommendations.</li>
                <li>Apply recommendations into the SOAP visit inputs.</li>
                <li>Generate, copy, and save the structured SOAP note.</li>
              </ul>
            </SectionCard>

            <SectionCard
              title="Generated Client Note"
              description="Your saved client record can include the evaluation summary, assessment, and SOAP note together."
            >
              {!soapNote && !isLoading && !error ? (
                <p className="text-slate-500">
                  Your generated client note will appear here after submission.
                </p>
              ) : null}

              {isLoading ? (
                <p className="text-slate-500">
                  Waiting for AI response and validating structured output...
                </p>
              ) : null}

              {soapNote ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                    >
                      {copied ? 'Copied' : 'Copy Full Note'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToHistory}
                      disabled={isSaving}
                      className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(21,122,110,0.2)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-teal-300"
                    >
                      {isSaving ? 'Saving...' : 'Save Client To History'}
                    </button>
                  </div>

                  {saveMessage ? (
                    <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
                      {saveMessage}
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Subjective
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {soapNote.subjective}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Objective
                    </h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {soapNote.objective.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Assessment
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {soapNote.assessment}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Plan
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {soapNote.plan}
                    </p>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/92 px-5 py-4 text-sm text-slate-900 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100';

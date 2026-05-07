'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

const PEDIATRIC_VISIT_FOCUS_OPTIONS = [
  'Pediatric OT',
  'Autism Support',
  'ADHD / Executive Function',
  'Sensory Integration',
  'School-Based Therapy',
  'Pediatric Neuro Rehab',
];

const OUTPATIENT_VISIT_FOCUS_OPTIONS = [
  'Outpatient OT',
  'Hand Therapy',
  'Upper Extremity Rehab',
  'Neuro Rehab',
  'ADL / IADL Training',
  'General Outpatient Rehab',
];

const DEFICIT_OPTIONS = [
  ['sensory_modulation', 'Sensory Modulation / Regulation'],
  ['executive_function', 'Executive Functioning'],
  ['fine_motor_visual_motor', 'Fine Motor / Visual-Motor Skills'],
  ['motor_planning', 'Motor Planning / Praxis'],
  ['emotional_regulation', 'Emotional Regulation'],
  ['attention_participation', 'Attention / Task Participation'],
  ['self_care_skills', 'Self-Care Skill Development'],
  ['feeding_participation', 'Feeding / Mealtime Participation'],
  ['communication_participation', 'Communication Participation'],
  ['gross_motor_coordination', 'Gross Motor Coordination'],
];

const LIMITATION_OPTIONS = [
  ['classroom_transitions', 'Classroom / Daily Transitions'],
  ['school_participation', 'School Participation'],
  ['handwriting', 'Handwriting / Written Output'],
  ['morning_routine', 'Morning Routine'],
  ['self_care_routines', 'Dressing / Hygiene / Self-Care'],
  ['mealtime_participation', 'Mealtime Participation'],
  ['play_participation', 'Play Participation'],
  ['peer_interaction', 'Peer Interaction'],
  ['caregiver_carryover', 'Caregiver Carryover'],
];

const SETTING_OPTIONS = [
  ['pediatric_outpatient', 'Pediatric Outpatient Clinic'],
  ['school_based', 'School-Based Therapy'],
  ['autism_clinic', 'Autism / ADHD-Focused Clinic'],
  ['early_intervention', 'Early Intervention'],
];

const NOTE_MENU_OPTIONS = {
  'outpatient-eval': {
    badge: 'Pediatric eval mode',
    title: 'Pediatric outpatient eval and plan of care',
    description:
      'Best for new evaluations, updated goals, treatment planning, and insurance-ready pediatric outpatient documentation.',
    track: 'pediatric',
  },
  progress: {
    badge: 'Pediatric progress mode',
    title: 'Pediatric outpatient progress note',
    description:
      'Best for fast visit capture, skilled intervention summaries, and same-day progress documentation.',
    track: 'pediatric',
  },
  'outpatient-note': {
    badge: 'Outpatient OT mode',
    title: 'General outpatient documentation workspace',
    description:
      'Best for standard outpatient OT documentation, functional rehab visits, and non-pediatric daily workflow needs.',
    track: 'outpatient',
  },
  insurance: {
    badge: 'Insurance mode',
    title: 'Insurance and medical necessity note',
    description:
      'Best for plan-of-care wording, payer support language, frequency, duration, and continued skilled need.',
    track: 'outpatient',
  },
  discharge: {
    badge: 'Discharge mode',
    title: 'Pediatric outpatient discharge summary',
    description:
      'Best for discharge status, caregiver carryover, next-step recommendations, and service wrap-up.',
    track: 'outpatient',
  },
};

const SAMPLE_FORM = {
  patientName: 'Demo Child',
  visitFocus: 'Sensory Integration',
  diagnosis: 'Autism spectrum disorder; ADHD',
  visitNumber: '8',
  precautions: 'Use child-specific sensory preferences; monitor signs of overwhelm and offer breaks as needed',
  caseContext:
    'Child receives pediatric OT to support sensory regulation, transitions, fine motor participation, self-care routines, and caregiver carryover across home and school routines.',
  subjectiveReport:
    'Caregiver reports mornings remain difficult, especially transitioning away from preferred play to dressing and leaving for school. Teacher reports child benefits from visual schedule and movement breaks before seated work.',
  painToday: 'No pain reported',
  interventionsCompleted:
    'Provided proprioceptive heavy-work activities and obstacle course for sensory regulation and body awareness. Used visual schedule and first-then language to transition into handwriting and shoe-tying practice. Practiced task initiation, sequencing, and flexible transition from preferred activity using structured choices. Reviewed caregiver strategies for morning routine carryover.',
  patientResponse:
    'Child benefited from predictable routine, structured choices, and brief movement break before seated work. Required moderate verbal and visual cues for transition from preferred activity and intermittent support for sequencing shoe-tying steps.',
  assistLevel: 'Min Assist',
  homeProgram:
    'Reviewed visual schedule, transition warning, first-then language, and heavy-work options before dressing and school departure.',
  planNextVisit:
    'Continue sensory regulation supports, transition practice, executive functioning strategies, and self-care sequencing with caregiver education.',
  roughNotes:
    'Child came in dysregulated after school. Needed heavy work and obstacle course before seated tasks. Used visual schedule and first-then to move into handwriting and shoe-tying. Teacher wants more transition support ideas. Caregiver needs home routine carryover for mornings.',
};

const SAMPLE_EVAL = {
  dominantSide: 'Right',
  postopStatus: '',
  chiefComplaint:
    'Caregiver reports difficulty with transitions, morning routine participation, handwriting endurance, and self-care sequencing.',
  occupationalProfile:
    'Child enjoys movement-based play, building toys, and pretend play. Family priorities include smoother morning routines, dressing participation, school readiness, and reduced distress during transitions.',
  plof:
    'Previously participated in familiar routines with fewer adult cues when schedule was predictable and sensory needs were supported.',
  clof:
    'Currently requires frequent adult support for transitions, task initiation, dressing sequence, and sustained participation in handwriting or seated school tasks.',
  pain: 'No pain concerns reported.',
  deficit: 'sensory_modulation',
  limitation: 'morning_routine',
  setting: 'pediatric_outpatient',
};

const INITIAL_FORM = {
  patientName: '',
  visitFocus: 'Pediatric OT',
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
  roughNotes: '',
};

const INITIAL_EVAL = {
  dominantSide: '',
  postopStatus: '',
  chiefComplaint: '',
  occupationalProfile: '',
  plof: '',
  clof: '',
  pain: '',
  deficit: 'sensory_modulation',
  limitation: 'classroom_transitions',
  setting: 'pediatric_outpatient',
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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
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
    'Assessment:',
    soapNote.assessment,
    '',
    'Plan:',
    soapNote.plan,
  ].join('\n');
}

function buildPlanOfCareText(toolkitResult) {
  if (!toolkitResult) return '';

  const parts = [
    toolkitResult.planOfCareSummary,
    toolkitResult.medicalNecessityRationale
      ? `Medical necessity: ${toolkitResult.medicalNecessityRationale}`
      : '',
    toolkitResult.recommendedFrequency
      ? `Recommended frequency: ${toolkitResult.recommendedFrequency}`
      : '',
    toolkitResult.recommendedDuration
      ? `Recommended duration: ${toolkitResult.recommendedDuration}`
      : '',
    toolkitResult.recommendedTreatmentPlan?.length
      ? ['Treatment plan focus:', ...toolkitResult.recommendedTreatmentPlan.map((item) => `- ${item}`)].join('\n')
      : '',
    toolkitResult.recommendedGoals?.length
      ? ['Functional goals:', ...toolkitResult.recommendedGoals.map((item) => `- ${item}`)].join('\n')
      : '',
  ].filter(Boolean);

  return parts.join('\n\n');
}

function buildToolkitNotePayloads(form, evalData, recommendations, toolkitResult) {
  if (!toolkitResult) return [];

  const shorthandInput = [
    form.roughNotes,
    form.subjectiveReport,
    form.caseContext,
    evalData.chiefComplaint,
    evalData.occupationalProfile,
    evalData.clof,
  ]
    .filter(Boolean)
    .join('\n\n');

  const plan = buildPlanOfCareText(toolkitResult) || form.planNextVisit || recommendations.longGoal;

  const shared = {
    patientLabel: form.patientName || 'Unnamed Patient',
    specialty: form.visitFocus,
    shorthandInput,
    diagnosis: form.diagnosis,
    visitNumber: form.visitNumber,
    precautions: form.precautions,
    interventions:
      form.interventionsCompleted || recommendations.interventions.slice(0, 2).join(' '),
    deficits: `${evalData.deficit}; ${evalData.limitation}`,
    assistLevel: form.assistLevel,
    response: form.patientResponse,
    plan,
  };

  return [
    {
      ...shared,
      noteType: 'Progress',
      generatedNote: toolkitResult.progressNote,
    },
    {
      ...shared,
      noteType: 'Referral',
      generatedNote: toolkitResult.referralNote,
    },
    {
      ...shared,
      noteType: 'Discharge',
      generatedNote: toolkitResult.dischargeNote,
    },
    {
      ...shared,
      noteType: 'Insurance',
      generatedNote: [
        toolkitResult.insuranceSupportNote,
        '',
        'Medical Necessity Rationale:',
        toolkitResult.medicalNecessityRationale,
        '',
        'Recommended Frequency:',
        toolkitResult.recommendedFrequency,
        '',
        'Recommended Duration:',
        toolkitResult.recommendedDuration,
        '',
        'Plan Of Care:',
        buildPlanOfCareText(toolkitResult),
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function ToolkitCard({ title, body, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {body ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {body}
        </p>
      ) : null}
      {items?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
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
      plof: evalData.plof,
      clof: evalData.clof,
      pain: evalData.pain,
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
  const searchParams = useSearchParams();
  const selectedNoteMenu = searchParams.get('noteMenu') || 'outpatient-eval';
  const noteMenuMeta = NOTE_MENU_OPTIONS[selectedNoteMenu] || NOTE_MENU_OPTIONS['outpatient-eval'];
  const [form, setForm] = useState(INITIAL_FORM);
  const [evalData, setEvalData] = useState(INITIAL_EVAL);
  const [soapNote, setSoapNote] = useState(null);
  const [toolkitResult, setToolkitResult] = useState(null);
  const [error, setError] = useState('');
  const [toolkitError, setToolkitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isToolkitLoading, setIsToolkitLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedToolkit, setCopiedToolkit] = useState('');
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

  const visitFocusOptions =
    noteMenuMeta.track === 'outpatient'
      ? OUTPATIENT_VISIT_FOCUS_OPTIONS
      : PEDIATRIC_VISIT_FOCUS_OPTIONS;

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
        plof: parsed.eval?.plof || current.plof,
        clof: parsed.eval?.clof || current.clof,
        pain: parsed.eval?.pain || current.pain,
        deficit: parsed.eval?.deficits?.[0] || current.deficit,
        limitation:
          parsed.eval?.functionalLimitations?.[0] || current.limitation,
        setting: parsed.patientInfo?.setting || current.setting,
      }));
    } catch (loadError) {
      console.error('Failed to load saved case context:', loadError);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('demo') !== '1') return;

    const hasAnyContent =
      form.patientName ||
      form.diagnosis ||
      form.subjectiveReport ||
      evalData.chiefComplaint;

    if (hasAnyContent) return;

    setForm(SAMPLE_FORM);
    setEvalData(SAMPLE_EVAL);
  }, [searchParams, form.patientName, form.diagnosis, form.subjectiveReport, evalData.chiefComplaint]);

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
    setSoapNote(null);
    setToolkitResult(null);
    setError('');
    setToolkitError('');
    setCopied(false);
    setCopiedToolkit('');
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
          ]
            .filter(Boolean)
            .join('\n'),
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

  const handleGenerateToolkit = async () => {
    setIsToolkitLoading(true);
    setToolkitError('');
    setToolkitResult(null);
    setCopiedToolkit('');

    try {
      const response = await fetch('/api/ai/clinic-toolkit', {
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
          caseContext: form.caseContext,
          roughNotes: form.roughNotes,
          visitData: {
            subjectiveReport: form.subjectiveReport,
            painToday: form.painToday || evalData.pain,
            interventionsCompleted:
              form.interventionsCompleted ||
              recommendations.interventions.slice(0, 2).join(' '),
            patientResponse: form.patientResponse,
            assistLevel: form.assistLevel,
            homeProgram: form.homeProgram,
            planNextVisit: form.planNextVisit || recommendations.longGoal,
          },
          evalData,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate clinic toolkit.');
      }

      const toolkit = data?.toolkit;

      if (
        !toolkit ||
        typeof toolkit.progressNote !== 'string' ||
        typeof toolkit.referralNote !== 'string' ||
        typeof toolkit.dischargeNote !== 'string' ||
        typeof toolkit.insuranceSupportNote !== 'string' ||
        typeof toolkit.planOfCareSummary !== 'string' ||
        typeof toolkit.recommendedFrequency !== 'string' ||
        typeof toolkit.recommendedDuration !== 'string' ||
        typeof toolkit.medicalNecessityRationale !== 'string' ||
        !Array.isArray(toolkit.recommendedAssessments) ||
        !Array.isArray(toolkit.recommendedTreatmentPlan) ||
        !Array.isArray(toolkit.recommendedGoals)
      ) {
        throw new Error('The AI response was not in the expected toolkit format.');
      }

      setToolkitResult(toolkit);
    } catch (toolkitRequestError) {
      setToolkitError(toolkitRequestError.message || 'Failed to generate clinic toolkit.');
    } finally {
      setIsToolkitLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!soapNote) return;

    try {
      await navigator.clipboard.writeText(formatSoapNote(soapNote));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Unable to copy SOAP note.');
    }
  };

  const handleCopyToolkit = async () => {
    if (!toolkitResult) return;

    const text = [
      'Progress Note:',
      toolkitResult.progressNote,
      '',
      'Referral Note:',
      toolkitResult.referralNote,
      '',
      'Discharge Note:',
      toolkitResult.dischargeNote,
      '',
      'Insurance Support Note:',
      toolkitResult.insuranceSupportNote,
      '',
      'Plan Of Care Summary:',
      toolkitResult.planOfCareSummary,
      '',
      'Medical Necessity Rationale:',
      toolkitResult.medicalNecessityRationale,
      '',
      'Recommended Frequency:',
      toolkitResult.recommendedFrequency,
      '',
      'Recommended Duration:',
      toolkitResult.recommendedDuration,
      '',
      'Recommended Assessments:',
      ...toolkitResult.recommendedAssessments.map((item) => `- ${item}`),
      '',
      'Recommended Treatment Plan:',
      ...toolkitResult.recommendedTreatmentPlan.map((item) => `- ${item}`),
      '',
      'Recommended Goals:',
      ...toolkitResult.recommendedGoals.map((item) => `- ${item}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedToolkit('copied');
      setTimeout(() => setCopiedToolkit(''), 1800);
    } catch {
      setToolkitError('Unable to copy clinic toolkit.');
    }
  };

  const handleSaveToolkitToHistory = async () => {
    if (!toolkitResult) return;

    setIsSaving(true);
    setToolkitError('');
    setSaveMessage('');

    try {
      const payloads = buildToolkitNotePayloads(
        form,
        evalData,
        recommendations,
        toolkitResult
      );

      for (const payload of payloads) {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || `Failed to save ${payload.noteType} note.`);
        }
      }

      setSaveMessage('Progress, referral, discharge, and insurance notes saved to History.');
    } catch (saveToolkitError) {
      setToolkitError(saveToolkitError.message || 'Failed to save clinic toolkit.');
    } finally {
      setIsSaving(false);
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
          generatedNote: formatSoapNote(soapNote),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save note to history.');
      }

      setSaveMessage('SOAP note saved to History.');
    } catch (saveError) {
      setError(saveError.message || 'Failed to save SOAP note.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
              {noteMenuMeta.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {noteMenuMeta.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              {noteMenuMeta.description} Capture rough notes quickly, generate
              payer-ready documentation, and move on. This workspace is built
              for lean teams, private-pay clinics, and neurodiversity-affirming
              pediatric care.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Fill Sample
            </button>
            <button
              type="button"
              onClick={handleSaveCase}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Save Eval Context
            </button>
          </div>
        </div>

        {searchParams.get('demo') === '1' ? (
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
            Demo mode is active. A sample pediatric neurodiverse therapy case has
            been loaded so you can explore the workflow quickly.
          </div>
        ) : null}

        {caseSaved ? (
          <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
            Evaluation context saved to active case.
          </div>
        ) : null}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Workspace mode
              </p>
              <p className="mt-1 text-sm text-slate-600">
                The sidebar dropdown does not open separate pages. It keeps you in this same workspace and switches the note mode between pediatric and general outpatient documentation flows.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              Active mode: {noteMenuMeta.badge}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <SectionCard
              title="Fast Capture + AI Assist"
              description="Use this first when the clinic is moving fast. Drop in rough notes once, then generate progress, discharge, insurance, assessment, and treatment planning support."
            >
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Session note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Build a fast progress note from rough session details.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Discharge draft
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Get a concise discharge summary when caseloads shift quickly.
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                    Insurance support
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Generate skilled-need language for medical necessity review.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Plan next steps
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Pull assessment ideas, goals, and treatment recommendations.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <Field label="Rough Session Notes">
                  <textarea
                    value={form.roughNotes}
                    onChange={(e) => updateField('roughNotes', e.target.value)}
                    className={`${inputClass} min-h-[180px]`}
                    placeholder="Paste quick notes here: regulation on arrival, caregiver concerns, what you tried, cues needed, participation, behavior, transitions, school/caregiver issues, medical necessity details."
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateToolkit}
                  disabled={isToolkitLoading}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
                >
                  {isToolkitLoading ? 'Generating Clinic Tools...' : 'Generate Progress + Discharge + Insurance Tools'}
                </button>

                {isToolkitLoading ? (
                  <p className="text-sm text-slate-500">
                    Building fast clinic-ready outputs...
                  </p>
                ) : null}
              </div>

              {toolkitError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {toolkitError}
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Child And Family Context"
              description="Keep this lean but high-yield: strengths, routines, barriers, and caregiver priorities that should shape documentation across visits."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Child Label">
                  <input
                    value={form.patientName}
                    onChange={(e) => updateField('patientName', e.target.value)}
                    className={inputClass}
                    placeholder="Child initials or demo label"
                  />
                </Field>

                <Field label="Diagnosis">
                  <input
                    value={form.diagnosis}
                    onChange={(e) => updateField('diagnosis', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Autism spectrum disorder, ADHD, developmental delay"
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

                <Field label="Developmental / Care Context">
                  <input
                    value={evalData.postopStatus}
                    onChange={(e) =>
                      updateEvalField('postopStatus', e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. IEP support, early intervention, outpatient OT"
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

                <Field label="Therapy Setting">
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
                <Field label="Chief Complaint">
                  <textarea
                    value={evalData.chiefComplaint}
                    onChange={(e) =>
                      updateEvalField('chiefComplaint', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Primary caregiver, school, or participation concerns"
                  />
                </Field>

                <Field label="Strengths And Routines">
                  <textarea
                    value={evalData.occupationalProfile}
                    onChange={(e) =>
                      updateEvalField('occupationalProfile', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Interests, sensory preferences, family routines, school demands"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Baseline Participation">
                    <textarea
                      value={evalData.plof}
                      onChange={(e) => updateEvalField('plof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="What routines or supports were working previously?"
                    />
                  </Field>

                  <Field label="Current Participation">
                    <textarea
                      value={evalData.clof}
                      onChange={(e) => updateEvalField('clof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Current support needs across home, school, or community"
                    />
                  </Field>
                </div>

                <Field label="Regulation / Safety / Symptom Summary">
                  <textarea
                    value={evalData.pain}
                    onChange={(e) => updateEvalField('pain', e.target.value)}
                    className={`${inputClass} min-h-[72px]`}
                    placeholder="Regulation patterns, distress signs, pain if relevant, sensory triggers, safety needs"
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Pediatric Recommendation Builder"
              description="Use support need and participation context to quickly pull pediatric assessment, intervention, and goal ideas."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Primary Support Need">
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

                <Field label="Participation Area">
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
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  Apply To SOAP Inputs
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Assessment Recommendations
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {recommendations.assessments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Intervention Recommendations
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {recommendations.interventions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
              title="Visit SOAP Input"
              description="Use this when you need a clean structured SOAP draft after fast session capture."
            >
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Visit Focus">
                    <select
                      value={form.visitFocus}
                      onChange={(e) => updateField('visitFocus', e.target.value)}
                      className={inputClass}
                    >
                      {visitFocusOptions.map((option) => (
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
                      placeholder="Evaluation summary, occupational context, or skilled rationale"
                    />
                  </Field>

                <Field label="Subjective Report">
                  <textarea
                    value={form.subjectiveReport}
                    onChange={(e) =>
                      updateField('subjectiveReport', e.target.value)
                    }
                    className={`${inputClass} min-h-[110px]`}
                    placeholder="Caregiver, teacher, or child report for today"
                  />
                </Field>

                  <Field label="Pain / Regulation Today">
                    <input
                      value={form.painToday}
                      onChange={(e) => updateField('painToday', e.target.value)}
                      className={inputClass}
                    placeholder="e.g. no pain reported; covered ears during loud group task"
                    />
                  </Field>

                <Field label="Interventions Completed">
                  <textarea
                    value={form.interventionsCompleted}
                    onChange={(e) =>
                      updateField('interventionsCompleted', e.target.value)
                    }
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Play-based treatment, sensory regulation, self-care training, executive functioning support, caregiver coaching, school-readiness tasks"
                  />
                </Field>

                <Field label="Child Response / Clinical Observations">
                  <textarea
                    value={form.patientResponse}
                    onChange={(e) =>
                      updateField('patientResponse', e.target.value)
                    }
                    className={`${inputClass} min-h-[110px]`}
                    placeholder="Participation, regulation, cueing, flexibility, motor planning, communication, carryover"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Home Program / Education">
                    <textarea
                      value={form.homeProgram}
                      onChange={(e) => updateField('homeProgram', e.target.value)}
                      className={`${inputClass} min-h-[110px]`}
                      placeholder="Caregiver coaching, home carryover, school coordination, environmental supports"
                    />
                  </Field>

                  <Field label="Plan For Next Visit">
                    <textarea
                      value={form.planNextVisit}
                      onChange={(e) =>
                        updateField('planNextVisit', e.target.value)
                      }
                      className={`${inputClass} min-h-[110px]`}
                      placeholder="What should be progressed, reassessed, or targeted next session"
                    />
                  </Field>
                </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isLoading ? 'Generating SOAP Note...' : 'Generate SOAP Note'}
                  </button>

                  {isLoading ? (
                    <p className="text-sm text-slate-500">
                      Building structured OT documentation...
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
              description="Designed for small teams who need documentation support without adding friction."
            >
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Paste rough notes once and generate multiple note types fast.</li>
                <li>Review assessment, treatment plan, and goal suggestions before finalizing care decisions.</li>
                <li>Use the SOAP section only when you need a structured session draft.</li>
                <li>Keep clinician oversight while reducing after-hours documentation burden.</li>
              </ul>
            </SectionCard>

            <SectionCard
              title="AI Clinic Toolkit"
              description="Fast outputs for progress notes, discharge planning, insurance support, and next-step clinical planning."
            >
              {!toolkitResult && !isToolkitLoading && !toolkitError ? (
                <p className="text-slate-500">
                  Generate the clinic toolkit from rough notes to get fast documentation support beyond SOAP.
                </p>
              ) : null}

              {isToolkitLoading ? (
                <p className="text-slate-500">
                  Generating fast clinic documentation outputs...
                </p>
              ) : null}

              {toolkitResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCopyToolkit}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      {copiedToolkit ? 'Copied' : 'Copy Toolkit'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToolkitToHistory}
                      disabled={isSaving}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
                    >
                      {isSaving ? 'Saving...' : 'Save Toolkit To History'}
                    </button>
                  </div>

                  {saveMessage ? (
                    <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
                      {saveMessage}
                    </div>
                  ) : null}

                  <ToolkitCard
                    title="Progress Note"
                    body={toolkitResult.progressNote}
                  />
                  <ToolkitCard
                    title="Referral Note"
                    body={toolkitResult.referralNote}
                  />
                  <ToolkitCard
                    title="Discharge Note Draft"
                    body={toolkitResult.dischargeNote}
                  />
                  <ToolkitCard
                    title="Insurance Support Note"
                    body={toolkitResult.insuranceSupportNote}
                  />
                  <ToolkitCard
                    title="Medical Necessity Rationale"
                    body={toolkitResult.medicalNecessityRationale}
                  />
                  <ToolkitCard
                    title="Plan Of Care Summary"
                    body={toolkitResult.planOfCareSummary}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <ToolkitCard
                      title="Recommended Frequency"
                      body={toolkitResult.recommendedFrequency}
                    />
                    <ToolkitCard
                      title="Recommended Duration"
                      body={toolkitResult.recommendedDuration}
                    />
                  </div>
                  <ToolkitCard
                    title="Recommended Assessments"
                    items={toolkitResult.recommendedAssessments}
                  />
                  <ToolkitCard
                    title="Recommended Treatment Plan"
                    items={toolkitResult.recommendedTreatmentPlan}
                  />
                  <ToolkitCard
                    title="Recommended Goals"
                    items={toolkitResult.recommendedGoals}
                  />
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Generated SOAP Note"
              description="Structured AI output is rendered section-by-section to avoid object rendering errors."
            >
              {!soapNote && !isLoading && !error ? (
                <p className="text-slate-500">
                  Your generated SOAP note will appear here after submission.
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
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      {copied ? 'Copied' : 'Copy SOAP Note'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToHistory}
                      disabled={isSaving}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
                    >
                      {isSaving ? 'Saving...' : 'Save To History'}
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
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

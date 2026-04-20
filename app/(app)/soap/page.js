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

const SUBJECTIVE_PRESETS = [
  'Reports morning stiffness limiting dressing fasteners and meal prep.',
  'Reports increased pain after household tasks requiring sustained grasp.',
  'States typing tolerance remains limited due to wrist soreness and fatigue.',
  'Reports difficulty opening containers, cutting food, and carrying cookware.',
  'Reports shoulder pain with overhead reaching during grooming and dressing.',
];

const RESPONSE_PRESETS = [
  'Required intermittent verbal cues for pacing and movement quality.',
  'Required tactile cues to reduce compensatory shoulder elevation during task performance.',
  'Demonstrated mild fatigue with repetitive grasp and pinch activity.',
  'Completed session without increased edema or adverse response.',
  'Continues to demonstrate limited sustained grasp affecting functional hand use.',
];

const HOME_PROGRAM_PRESETS = [
  'Reviewed tendon glides, wrist AROM, and edema control strategies for home program.',
  'Reinforced joint protection, activity pacing, and task modification for kitchen tasks.',
  'Reviewed scapular positioning, ROM home exercises, and symptom-monitoring strategies.',
  'Provided education on body mechanics, rest breaks, and carryover into ADL performance.',
];

const PLAN_PRESETS = [
  'Progress ROM and graded strengthening during next session.',
  'Continue task-specific ADL retraining focused on dressing and grooming performance.',
  'Advance fine motor coordination and sustained grasp demands during functional hand tasks.',
  'Reassess tolerance for work-related computer use and ergonomic carryover.',
  'Continue skilled OT to address pain, weakness, and occupational performance deficits.',
];

const INTERVENTION_PRESETS = {
  HandTherapy: [
    'Performed tendon glides, wrist AROM, and fine motor in-hand manipulation training.',
    'Completed edema management education, scar mobilization, and pinch strengthening tasks.',
    'Facilitated grasp-release and dexterity tasks using buttons, coins, and resistance blocks.',
  ],
  UpperExtremity: [
    'Completed shoulder AROM, scapular stabilization, and graded reaching activity.',
    'Facilitated overhead task simulation for grooming, dressing, and cabinet access.',
    'Provided proximal strengthening and movement re-education for shoulder mechanics.',
  ],
  NeuroRehab: [
    'Facilitated bilateral coordination, sequencing, and task-specific motor retraining.',
    'Completed neuromuscular re-education targeting motor control during self-care tasks.',
    'Implemented functional reach and grasp activity emphasizing pacing and movement quality.',
  ],
  ADLTraining: [
    'Completed dressing retraining using graded fastener management and task sequencing.',
    'Facilitated meal-prep simulation with pacing, setup, and safety strategies.',
    'Provided task-specific ADL retraining focused on efficiency and compensatory technique.',
  ],
  General: [
    'Completed therapeutic exercise and activity to address ROM, strength, and task performance.',
    'Provided education in pacing, symptom management, and task modification.',
    'Facilitated occupation-based activity targeting functional upper extremity use.',
  ],
};

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
  plof:
    'Independent with ADLs, meal prep, typing for full workday, and home management prior to injury.',
  clof:
    'Needs extra time for dressing fasteners, avoids jars and heavier kitchen tasks, and can only tolerate brief periods of typing.',
  pain: 'Reports soreness after repetitive hand use and prolonged gripping.',
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
  plof: '',
  clof: '',
  pain: '',
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

function PresetRow({ label, options, onSelect }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;
          if (!value) return;
          onSelect(value);
          event.target.value = '';
        }}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 outline-none focus:border-teal-500"
      >
        <option value="">Choose preset...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
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
  const [form, setForm] = useState(INITIAL_FORM);
  const [evalData, setEvalData] = useState(INITIAL_EVAL);
  const [soapNote, setSoapNote] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setCaseSaved(false);
  };

  const appendToField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] ? `${prev[key]} ${value}` : value,
    }));
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
    setError('');
    setCopied(false);
    setSaveMessage('');
    setCaseSaved(false);
  };

  const interventionPresetOptions =
    INTERVENTION_PRESETS[form.visitFocus.replace(/\s+/g, '')] ||
    INTERVENTION_PRESETS.General;

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
            <div className="mb-2 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              OT Workflow
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              SOAP Note Workspace
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              One SOAP-first OT workflow with evaluation intake, assessment
              recommendations, intervention ideas, and structured note generation.
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

        {caseSaved ? (
          <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
            Evaluation context saved to active case.
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <SectionCard
              title="Evaluation Intake"
              description="Capture the initial OT picture that should inform plan recommendations and future SOAP notes."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Patient Name">
                  <input
                    value={form.patientName}
                    onChange={(e) => updateField('patientName', e.target.value)}
                    className={inputClass}
                    placeholder="Patient label"
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
                <Field label="Chief Complaint">
                  <textarea
                    value={evalData.chiefComplaint}
                    onChange={(e) =>
                      updateEvalField('chiefComplaint', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Primary symptoms and occupational concerns"
                  />
                </Field>

                <Field label="Occupational Profile">
                  <textarea
                    value={evalData.occupationalProfile}
                    onChange={(e) =>
                      updateEvalField('occupationalProfile', e.target.value)
                    }
                    className={`${inputClass} min-h-[88px]`}
                    placeholder="Roles, routines, meaningful activities, work, home demands"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Prior Level Of Function">
                    <textarea
                      value={evalData.plof}
                      onChange={(e) => updateEvalField('plof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="What was independent before injury or decline?"
                    />
                  </Field>

                  <Field label="Current Level Of Function">
                    <textarea
                      value={evalData.clof}
                      onChange={(e) => updateEvalField('clof', e.target.value)}
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Current functional limitations"
                    />
                  </Field>
                </div>

                <Field label="Pain / Symptom Summary">
                  <textarea
                    value={evalData.pain}
                    onChange={(e) => updateEvalField('pain', e.target.value)}
                    className={`${inputClass} min-h-[72px]`}
                    placeholder="Pain pattern, symptom irritability, edema, stiffness, etc."
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Recommendation Builder"
              description="Use your deficit and occupational limitation to generate OT-specific assessment and intervention ideas."
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
              description="Document the current visit and generate the final structured SOAP note."
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
                      placeholder="Evaluation summary, occupational context, or skilled rationale"
                    />
                  </Field>

                <Field label="Subjective Report">
                  <>
                    <textarea
                      value={form.subjectiveReport}
                      onChange={(e) =>
                        updateField('subjectiveReport', e.target.value)
                      }
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="What the patient reported today"
                    />
                    <PresetRow
                      label="Quick add"
                      options={SUBJECTIVE_PRESETS}
                      onSelect={(value) => appendToField('subjectiveReport', value)}
                    />
                  </>
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
                  <>
                    <textarea
                      value={form.interventionsCompleted}
                      onChange={(e) =>
                        updateField('interventionsCompleted', e.target.value)
                      }
                      className={`${inputClass} min-h-[100px]`}
                      placeholder="Therapeutic exercise, ADL training, education, task practice"
                    />
                    <PresetRow
                      label="Quick add"
                      options={interventionPresetOptions}
                      onSelect={(value) =>
                        appendToField('interventionsCompleted', value)
                      }
                    />
                  </>
                </Field>

                <Field label="Patient Response / Assessment Cues">
                  <>
                    <textarea
                      value={form.patientResponse}
                      onChange={(e) =>
                        updateField('patientResponse', e.target.value)
                      }
                      className={`${inputClass} min-h-[88px]`}
                      placeholder="Tolerance, barriers, cues, carryover, fatigue, quality of movement"
                    />
                    <PresetRow
                      label="Quick add"
                      options={RESPONSE_PRESETS}
                      onSelect={(value) => appendToField('patientResponse', value)}
                    />
                  </>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Home Program / Education">
                      <>
                        <textarea
                          value={form.homeProgram}
                          onChange={(e) => updateField('homeProgram', e.target.value)}
                          className={`${inputClass} min-h-[88px]`}
                          placeholder="HEP review, precautions, caregiver education"
                        />
                        <PresetRow
                          label="Quick add"
                          options={HOME_PROGRAM_PRESETS}
                          onSelect={(value) => appendToField('homeProgram', value)}
                        />
                      </>
                  </Field>

                  <Field label="Plan For Next Visit">
                      <>
                        <textarea
                          value={form.planNextVisit}
                          onChange={(e) =>
                            updateField('planNextVisit', e.target.value)
                          }
                          className={`${inputClass} min-h-[88px]`}
                          placeholder="What OT should continue or progress next session"
                        />
                        <PresetRow
                          label="Quick add"
                          options={PLAN_PRESETS}
                          onSelect={(value) => appendToField('planNextVisit', value)}
                        />
                      </>
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
              description="This is now the primary OT note workflow."
            >
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Capture evaluation context and occupational profile.</li>
                <li>Review assessment and intervention recommendations.</li>
                <li>Apply recommendations into the SOAP visit inputs.</li>
                <li>Generate, copy, and save the structured SOAP note.</li>
              </ul>
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
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

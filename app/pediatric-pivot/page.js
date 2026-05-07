'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const painPoints = [
  {
    id: 'functional',
    label: 'Functional gains',
    title: 'Show progress without forcing "normal"',
    body: 'Captures play, shared engagement, self-care participation, classroom access, and family routines as skilled functional outcomes.',
  },
  {
    id: 'intensity',
    label: 'High-intensity sessions',
    title: 'Document after a session that never slowed down',
    body: 'Turns memory fragments into a structured note when point-of-care charting was impossible because the child needed support, safety monitoring, or co-regulation.',
  },
  {
    id: 'data',
    label: 'Fluctuating capacity',
    title: 'Explain why performance changed today',
    body: 'Documents sensory context, task demand, supports used, and "just-right" challenge instead of reducing progress to a simple pass/fail skill.',
  },
  {
    id: 'sensory',
    label: 'Behavior as communication',
    title: 'Replace deficit language with clinical clarity',
    body: 'Reframes "noncompliance" as observable regulation, interoception, sensory, communication, or transition support needs.',
  },
];

const noteTypes = ['SOAP note', 'Caregiver summary', 'Insurance rationale', 'OON claim packet'];

const samples = {
  functional:
    'Child chose obstacle course, crashed into crash pad 8x, then joined shoe tying for 4 minutes. Smiled and looked to therapist during silly turn-taking. Parent says mornings still hard but child put on socks 2 days this week with visual schedule.',
  intensity:
    'Very active session. Needed close guarding on swing and lots of co-regulation. Could not chart during visit. Did heavy work, tunnel, transition to table with first-then board, 3 handwriting trials, then meltdown when cleanup started.',
  data:
    'Last week used scissors 6 snips. Today avoided scissors and covered ears after loud hallway. Used loop scissors after quiet break and deep pressure. Did 3 snips with hand over hand. Not sure how to write progress.',
  sensory:
    'Teacher says "refused group." In session child hid under table when music started. Accepted headphones and visual choice card, then sat near group for 2 minutes and passed beanbag once.',
};

const generatedNotes = {
  functional: {
    soap: [
      ['Subjective', 'Caregiver reports morning routine participation remains variable, with recent success using a visual schedule for sock donning on 2 days this week.'],
      ['Objective', 'Child participated in child-led obstacle course and proprioceptive input, then transitioned to shoe-tying practice for approximately 4 minutes. Shared affect and social engagement were observed during turn-taking play.'],
      ['Assessment', 'Child demonstrated functional gains in routine participation, shared engagement, and transition readiness when interests, movement input, and visual supports were used. Skilled OT remains indicated to grade the challenge level and support carryover into self-care routines.'],
      ['Plan', 'Continue sensory-informed self-care practice, visual routine supports, and caregiver coaching for morning routine participation.'],
    ],
    caregiver:
      'Today we used movement play to help your child feel organized before practicing shoe tying. They showed connection and shared enjoyment during turn-taking, then stayed with shoe-tying practice for several minutes. Keep using the visual schedule for socks and morning steps because it is supporting participation.',
    rationale:
      'Skilled OT is needed to analyze sensory regulation, motor planning, visual supports, and caregiver routines so the child can increase participation in age-expected self-care without relying only on adult prompting.',
    oon:
      'OON packet draft: attach superbill with provider NPI, Tax ID, diagnosis code, date of service, CPT/service line, itemized charge, and paid receipt. Include this note as progress evidence showing functional self-care gains, caregiver carryover, skilled grading of challenge, and medical necessity for pediatric OT.',
  },
  intensity: {
    soap: [
      ['Subjective', 'Session required continuous therapist support due to high movement needs, safety monitoring, and co-regulation demands.'],
      ['Objective', 'Therapist provided close guarding during vestibular input, proprioceptive heavy-work activities, first-then visual support, transition coaching, and graded handwriting trials. Child required frequent co-regulation during cleanup transition.'],
      ['Assessment', 'Child benefited from sensory preparation and visual structure to access seated fine motor work after high-intensity movement. Difficulty during cleanup appeared related to transition demand and regulation needs rather than lack of willingness.'],
      ['Plan', 'Continue high-support transition practice with visual countdowns, cleanup routines, and sensory regulation strategies before seated school-readiness tasks.'],
    ],
    caregiver:
      'The session had a lot of movement and your child needed close adult support to stay safe and regulated. The first-then board helped them get to handwriting after heavy work. We will keep practicing cleanup transitions with predictable warnings and regulation supports.',
    rationale:
      'Point-of-care documentation was not feasible because the therapist was actively providing safety monitoring, sensory regulation, and co-regulation. Skilled intervention included grading sensory input, transition supports, and task demands.',
    oon:
      'OON packet draft: attach superbill and paid receipt. Flag skilled OT necessity due to continuous safety monitoring, co-regulation, transition support, sensory modulation intervention, and inability to complete point-of-care documentation during high-intensity care.',
  },
  data: {
    soap: [
      ['Subjective', 'Performance with scissors was lower than the previous session after exposure to a loud hallway environment.'],
      ['Objective', 'Child initially avoided scissors and covered ears. Therapist modified the environment with quiet break and deep pressure input, then introduced loop scissors with hand-over-hand support. Child completed 3 snips with support.'],
      ['Assessment', 'Reduced cutting performance today appeared influenced by auditory sensory load and regulation state, not solely fine motor capacity. Child accessed the task after environmental modification, sensory support, adaptive tool use, and graded assistance.'],
      ['Plan', 'Continue cutting practice while tracking sensory context, tool adaptation, regulation state, and level of assistance needed across sessions.'],
    ],
    caregiver:
      'Cutting was harder today after the loud hallway. After a quiet break and deep pressure, your child was able to try loop scissors with help. This gives us useful information: the environment and regulation state changed access to the motor task.',
    rationale:
      'Skilled OT is required to differentiate fine motor skill limitations from sensory modulation factors and to select adaptive tools, environmental changes, and assistance levels that support participation.',
    oon:
      'OON packet draft: attach superbill, evaluation, and progress note. Emphasize that skilled OT differentiated fine motor capacity from sensory processing barriers, modified the environment, selected adaptive equipment, and documented response to intervention.',
  },
  sensory: {
    soap: [
      ['Subjective', 'Teacher reported difficulty participating in group activity.'],
      ['Objective', 'During music-based group demand, child moved under table. Therapist offered headphones and visual choice card. Child then moved near the group for approximately 2 minutes and participated by passing beanbag once.'],
      ['Assessment', 'Behavior appeared to communicate auditory sensitivity and need for regulation support. With environmental accommodation and communication support, child increased proximity to group and completed one participation turn.'],
      ['Plan', 'Continue group participation supports using headphones, visual choices, graded proximity, and regulation breaks while collaborating with school team.'],
    ],
    caregiver:
      'Today we saw that loud music made group participation hard. When headphones and a visual choice were available, your child was able to come near the group and take one turn. This is meaningful participation progress.',
    rationale:
      'Documentation should avoid labeling the child as noncompliant. Skilled OT identified sensory and communication needs, modified the environment, and graded group participation to support access.',
    oon:
      'OON packet draft: attach superbill and note. Use medical necessity language showing sensory and communication support needs, environmental modification, graded participation, and functional access to school/group routines.',
  },
};

const superbillItems = [
  'Clinic/provider name and physical address',
  'Treating clinician license number and credentials',
  'National Provider Identifier (NPI)',
  'Tax ID / EIN',
  'Child full name and date of birth',
  'Exact date of service',
  'ICD-10 diagnosis code(s)',
  'CPT / procedure code(s) and service description',
  'Itemized charge for each service',
  'Proof of payment or paid receipt',
];

const necessityItems = [
  'Initial evaluation signed and dated by clinician',
  'Treatment plan with SMART goals tied to function',
  'Progress notes showing response to intervention',
  'Physician referral or prescription when required by plan',
  'Letter of medical necessity when payer requests more support',
  'Documentation of functional impairment and skilled OT rationale',
];

const claimLogItems = [
  'No in-network provider call log',
  'Insurance correspondence folder',
  'EOB and denial tracking',
  'Representative names, dates, and call summaries',
  'Signed consent and release documents',
  'Appeal packet status and deadlines',
];

const oonWorkflow = [
  {
    step: '1',
    title: 'Generate note',
    body: 'Create a SOAP/progress note that links neurodiverse support needs to functional participation, skilled intervention, and measurable response.',
  },
  {
    step: '2',
    title: 'Build superbill',
    body: 'Check every required claim field before the family submits for out-of-network reimbursement.',
  },
  {
    step: '3',
    title: 'Attach necessity evidence',
    body: 'Bundle evaluation, treatment plan, SMART goals, physician referral, progress notes, and payer-ready rationale.',
  },
  {
    step: '4',
    title: 'Track follow-up',
    body: 'Keep EOBs, denial reasons, representative calls, appeal deadlines, and no-network-exception logs in one place.',
  },
];

const evalInputs = [
  ['Child profile', 'Age, diagnosis, referral reason, caregiver priorities, school context'],
  ['Strengths and interests', 'Preferred play, motivators, communication style, sensory preferences'],
  ['Functional concerns', 'Morning routine, dressing, feeding, handwriting, transitions, peer play'],
  ['Regulation profile', 'Interoception, sensory triggers, co-regulation needs, recovery supports'],
  ['Participation settings', 'Home, outpatient clinic, classroom, playground, community routines'],
  ['Current supports', 'Visual schedules, AAC, headphones, movement breaks, caregiver strategies'],
];

const pediatricAssessments = [
  {
    name: 'Sensory Profile 2 / SPM-2',
    use: 'Sensory modulation, praxis, school/home sensory patterns',
  },
  {
    name: 'COPM',
    use: 'Caregiver priorities and participation-centered outcomes',
  },
  {
    name: 'PDMS-3 / BOT-2',
    use: 'Motor coordination, fine motor, gross motor, and praxis support',
  },
  {
    name: 'Beery VMI',
    use: 'Visual-motor integration and handwriting participation',
  },
  {
    name: 'PEDI-CAT',
    use: 'Daily activities, mobility, social-cognitive participation',
  },
  {
    name: 'School routine observation',
    use: 'IEP-aligned access, transitions, group participation, classroom supports',
  },
];

const planOfCareGoals = [
  'Child will participate in morning dressing routine with visual schedule and caregiver support in 4 of 5 opportunities within 8 weeks.',
  'Child will transition from preferred to non-preferred activity using individualized sensory and visual supports with reduced adult prompting within 8 weeks.',
  'Child will complete a school-readiness fine motor task for 5 minutes with regulation supports and adaptive tools as needed within 6 weeks.',
  'Caregiver will demonstrate two co-regulation or sensory preparation strategies during targeted home routines within 4 weeks.',
];

const generatedClinicalOutputs = [
  {
    title: 'SOAP note generator',
    body: 'Uses eval context, assessment findings, rough session notes, supports used, and child response to create a reviewable pediatric SOAP draft.',
  },
  {
    title: 'Insurance statement',
    body: 'Explains medical necessity using functional impairment, skilled clinical reasoning, response to intervention, and payer-ready OT language.',
  },
  {
    title: 'Plan of care',
    body: 'Creates SMART goals, recommended frequency/duration placeholders, caregiver carryover, and reassessment focus for pediatric neurodiverse OT.',
  },
];

export default function PediatricPivotPage() {
  const [activePain, setActivePain] = useState('functional');
  const [noteType, setNoteType] = useState('SOAP note');
  const [roughNotes, setRoughNotes] = useState(samples.functional);

  const active = painPoints.find((item) => item.id === activePain) || painPoints[0];
  const generated = generatedNotes[activePain];

  const output = useMemo(() => {
    if (noteType === 'Caregiver summary') return generated.caregiver;
    if (noteType === 'Insurance rationale') return generated.rationale;
    if (noteType === 'OON claim packet') return generated.oon;
    return generated.soap;
  }, [generated, noteType]);

  function selectPainPoint(id) {
    setActivePain(id);
    setRoughNotes(samples[id]);
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#24312d]">
      <header className="border-b border-[#e6ded1] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="font-serif text-2xl text-[#24312d] no-underline">
            MedNote<span className="font-sans text-xl font-medium text-[#2d7c68]">AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-[#edf7f2] px-3 py-1 text-sm font-medium text-[#2d7c68] sm:inline-flex">
              Local prototype
            </span>
            <Link
              href="/"
              className="rounded-lg border border-[#d9d0c1] bg-white px-4 py-2 text-sm font-medium text-[#4f5f59] no-underline transition hover:bg-[#f7f3ea]"
            >
              Back to app
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#f6efe1]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-16">
          <div className="flex flex-col justify-center">
            <p className="w-fit rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#2d7c68] shadow-sm">
              Pediatric neurodiverse OT documentation
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#24312d] md:text-6xl">
              Note-taking that captures the full child, not just the checkbox.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5c6965]">
              A fabricated pediatric OT assistant for autism, ADHD, sensory
              processing, executive functioning, interoception, play, school
              participation, and caregiver routines. Built for the messy reality
              of sessions where documentation happens after the child is safe,
              regulated, and supported.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Metric value="8 min" label="estimated draft time saved" />
              <Metric value="4 modes" label="SOAP, caregiver, payer, OON" />
              <Metric value="0 PHI" label="demo uses fictional cases" />
            </div>
          </div>

          <div className="rounded-lg border border-[#e3d8c8] bg-white p-4 shadow-sm">
            <div className="rounded-lg bg-[#f7fbf7] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9e8e0] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                    Live note assistant mockup
                  </p>
                  <p className="mt-1 text-sm text-[#5c6965]">
                    Rough memory fragments into reviewable documentation
                  </p>
                </div>
                <span className="rounded-full bg-[#ffe8d6] px-3 py-1 text-xs font-semibold text-[#9b5b28]">
                  Clinician review required
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {noteTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNoteType(type)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        noteType === type
                          ? 'border-[#2d7c68] bg-[#2d7c68] text-white'
                          : 'border-[#d9e1dc] bg-white text-[#4f5f59] hover:bg-[#f2f7f4]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-semibold uppercase text-[#71817b]">
                  Rough session notes
                </label>
                <textarea
                  value={roughNotes}
                  onChange={(event) => setRoughNotes(event.target.value)}
                  className="min-h-[130px] rounded-lg border border-[#d9e1dc] bg-white p-4 text-sm leading-6 text-[#33413d] outline-none focus:border-[#2d7c68]"
                />

                <div className="rounded-lg border border-[#d9e8e0] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                      Generated preview
                    </p>
                    <p className="text-xs text-[#71817b]">{active.label}</p>
                  </div>
                  {Array.isArray(output) ? (
                    <div className="space-y-3">
                      {output.map(([section, text]) => (
                        <p key={section} className="text-sm leading-6 text-[#33413d]">
                          <strong>{section}:</strong> {text}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-[#33413d]">{output}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e6ded1] bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#2d7c68]">
                MedNote-style clinical workspace
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#24312d]">
                Eval input, pediatric assessments, SOAP, insurance, and plan of care
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#5c6965]">
              This is the same core structure as the existing SOAP workspace, but
              specialized for outpatient pediatric neurodiverse OT clinics that
              need both clinical quality and reimbursement-ready documentation.
            </p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[0.95fr_1.05fr_0.9fr]">
            <section className="rounded-lg border border-[#e3d8c8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                    Evaluation intake
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#24312d]">
                    Child and family profile
                  </h3>
                </div>
                <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#2d7c68]">
                  Eval
                </span>
              </div>
              <div className="space-y-3">
                {evalInputs.map(([label, placeholder]) => (
                  <label key={label} className="block">
                    <span className="text-xs font-semibold uppercase text-[#71817b]">
                      {label}
                    </span>
                    <div className="mt-1 rounded-lg border border-[#d9e1dc] bg-[#fbfaf7] px-3 py-2 text-sm leading-6 text-[#5c6965]">
                      {placeholder}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#e3d8c8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                    Assessment builder
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#24312d]">
                    Pediatric-focused recommendations
                  </h3>
                </div>
                <span className="rounded-full bg-[#fff3df] px-3 py-1 text-xs font-semibold text-[#9b6b2e]">
                  OT
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {pediatricAssessments.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-lg border border-[#e6ded1] bg-[#fffdf8] p-4"
                  >
                    <h4 className="text-sm font-semibold text-[#24312d]">
                      {item.name}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#5c6965]">{item.use}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-[#cfe6dc] bg-[#f2faf6] p-4">
                <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                  Clinical reasoning prompt
                </p>
                <p className="mt-2 text-sm leading-6 text-[#33413d]">
                  Distinguish skill capacity from sensory context, regulation
                  state, interoception, task demand, environmental fit, and
                  support level before labeling progress.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-[#e3d8c8] bg-white p-5 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                  Generated outputs
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#24312d]">
                  Reviewable documentation bundle
                </h3>
              </div>
              <div className="space-y-3">
                {generatedClinicalOutputs.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-lg border border-[#d9e8e0] bg-[#f7fbf7] p-4"
                  >
                    <h4 className="text-sm font-semibold text-[#24312d]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#5c6965]">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-lg border border-[#e3d8c8] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                Sample plan of care goals
              </p>
              <div className="mt-4 space-y-3">
                {planOfCareGoals.map((goal) => (
                  <p
                    key={goal}
                    className="rounded-lg bg-[#fbfaf7] p-3 text-sm leading-6 text-[#33413d]"
                  >
                    {goal}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#cfe6dc] bg-[#f2faf6] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                Insurance statement preview
              </p>
              <p className="mt-4 text-sm leading-7 text-[#33413d]">
                Skilled outpatient pediatric OT is medically necessary to evaluate
                and treat sensory modulation, motor planning, interoception,
                executive functioning, and self-care participation needs that
                interfere with daily routines. Treatment requires skilled clinical
                reasoning to grade challenge, modify environment and task demands,
                coach caregivers, monitor response to intervention, and support
                functional participation across home and school contexts.
              </p>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2d7c68]">
              Field-specific documentation strain
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#24312d]">
              Designed around the notes pediatric neurodiverse OT actually has to write
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#5c6965]">
            These cards become the product logic: they tell the assistant what the
            therapist is trying to prove, protect, or explain in the note.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {painPoints.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPainPoint(item.id)}
              className={`rounded-lg border p-5 text-left transition ${
                activePain === item.id
                  ? 'border-[#2d7c68] bg-[#edf7f2] shadow-sm'
                  : 'border-[#e3d8c8] bg-white hover:bg-[#fffaf1]'
              }`}
            >
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2d7c68]">
                {item.label}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#24312d]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5c6965]">{item.body}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e6ded1] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-[#2d7c68]">
                Out-of-network reimbursement support
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#24312d]">
                Turn each visit into a claim-ready documentation packet.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5c6965]">
                For OON pediatric neurodiverse OT clinics, the app should help
                families submit complete superbills while helping clinicians prove
                medical necessity with functional, affirming, payer-ready
                documentation. This is not billing advice; it is a documentation
                readiness workflow that clinics can customize by payer and state.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {oonWorkflow.map((item) => (
                <article
                  key={item.step}
                  className="rounded-lg border border-[#e3d8c8] bg-[#fffdf8] p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2d7c68] text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#24312d]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c6965]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <ChecklistCard
              title="Superbill readiness"
              description="Every session should be easy for a family to submit."
              items={superbillItems}
            />
            <ChecklistCard
              title="Medical necessity packet"
              description="Support the claim with functional evidence."
              items={necessityItems}
            />
            <ChecklistCard
              title="Claim follow-up log"
              description="Help families track payer friction and appeals."
              items={claimLogItems}
            />
          </div>

          <div className="mt-8 rounded-lg border border-[#cfe6dc] bg-[#f2faf6] p-5">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-[#2d7c68]">
                  Example payer-facing language
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#24312d]">
                  Medical necessity without deficit-only wording
                </h3>
              </div>
              <p className="text-sm leading-7 text-[#33413d]">
                Skilled pediatric OT remains medically necessary to assess and treat
                sensory modulation, motor planning, interoception, executive
                functioning, and self-care participation needs that interfere with
                the child&apos;s daily routines. Intervention requires clinical
                reasoning to grade sensory input, modify task demands, coach
                caregivers, and document response to supports across sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6ded1] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2d7c68]">
              Neurodiversity-affirming charting
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#24312d]">
              Behavior is documented as communication, not character.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5c6965]">
              The assistant prompts clinicians to document sensory context,
              interoception, regulation state, task demand, support level, and the
              just-right challenge. That helps the note stay affirming while still
              supporting medical necessity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LanguageCard
              label="Instead of"
              text="Child refused group and was noncompliant."
              tone="warm"
            />
            <LanguageCard
              label="Try"
              text="Child moved away during loud music demand. With headphones and visual choice support, child returned near group and completed one participation turn."
              tone="green"
            />
            <LanguageCard
              label="Instead of"
              text="No progress with scissors today."
              tone="warm"
            />
            <LanguageCard
              label="Try"
              text="Cutting participation decreased after auditory overload. Child accessed task after quiet break, deep pressure, adaptive scissors, and graded assistance."
              tone="green"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-lg bg-[#26332f] p-6 text-white md:p-8">
          <div className="grid gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-[#aee1d0]">
                MVP direction
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Start as a pediatric OT documentation co-pilot.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Do not start by replacing the whole app. Ship a local demo with
                fictional cases, four note modes, pediatric templates, and a
                strengths-based language layer. Then promote it into the main app
                once the workflow feels useful.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Rough notes to SOAP',
                'Caregiver summary',
                'Behavior observation',
                'Insurance rationale',
                'Superbill readiness',
                'OON claim packet',
                'IEP-aligned language',
                'Goal bank suggestions',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-lg border border-[#e3d8c8] bg-white/75 p-4">
      <p className="text-2xl font-semibold text-[#24312d]">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase leading-5 text-[#71817b]">
        {label}
      </p>
    </div>
  );
}

function LanguageCard({ label, text, tone }) {
  const classes =
    tone === 'green'
      ? 'border-[#cfe6dc] bg-[#f2faf6] text-[#33413d]'
      : 'border-[#efd8bd] bg-[#fff8ec] text-[#5f5140]';

  return (
    <div className={`rounded-lg border p-5 ${classes}`}>
      <p className="text-xs font-semibold uppercase text-[#2d7c68]">{label}</p>
      <p className="mt-3 text-sm leading-7">{text}</p>
    </div>
  );
}

function ChecklistCard({ title, description, items }) {
  return (
    <article className="rounded-lg border border-[#e3d8c8] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-[#24312d]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5c6965]">{description}</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg bg-[#fbfaf7] p-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf7f2] text-xs font-bold text-[#2d7c68]">
              ok
            </span>
            <p className="text-sm leading-5 text-[#33413d]">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

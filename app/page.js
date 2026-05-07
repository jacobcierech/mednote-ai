import Link from 'next/link';

const featureCards = [
  {
    eyebrow: 'Pediatric SOAP',
    title: 'Documentation tuned for neurodiverse pediatric therapy',
    body:
      'Generate clinician-reviewed SOAP drafts for pediatric OT, SLP, PT, ABA, and school-based services with language that reflects sensory regulation, participation, caregiver carryover, and executive functioning support.',
  },
  {
    eyebrow: 'Caregiver + School',
    title: 'Support family communication and IEP-aligned workflows',
    body:
      'Draft parent-friendly summaries, school participation updates, and therapist-facing documentation that stays aligned with classroom supports, routines, and function-first goals.',
  },
  {
    eyebrow: 'Burnout Relief',
    title: 'Turn rough notes into polished clinical documentation',
    body:
      'Paste shorthand notes, observations, and intervention details, then generate a cleaner first draft so clinicians spend less time formatting and more time supporting children and families.',
  },
];

const workflowSteps = [
  'Paste rough notes from a sensory integration, executive functioning, or school-based session.',
  'Choose a pediatric therapy workflow such as autism support, ADHD/executive function, or school participation.',
  'Generate a structured draft with neurodiversity-affirming clinical language for review and editing.',
];

const featureList = [
  'Autism and ADHD-specific SOAP note templates',
  'Sensory integration and regulation session documentation',
  'Executive functioning goal generation',
  'Behavioral observation and participation summaries',
  'Parent / caregiver summary generator',
  'School and IEP-aligned documentation support',
  'Goal bank for pediatric OT, SLP, PT, and neuro rehab',
  'Progress note comparison and carryover tracking',
];

const trustItems = [
  'Clinician oversight remains central. Drafts are designed to support, not replace, clinical judgment.',
  'HIPAA/privacy messaging can be expanded as infrastructure hardens, BAA coverage is clarified, and storage architecture is finalized.',
  'Designed around neurodiversity-affirming care language rather than deficit-heavy generic medical phrasing.',
];

const futureModules = [
  'Developmental milestone tracking',
  'Progress comparison over time',
  'Goal bank by discipline and age range',
  'Demo mode for sales conversations and clinic pilots',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,233,242,0.42),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(255,220,209,0.34),_transparent_24%),linear-gradient(180deg,_#fcfeff_0%,_#f4faf8_100%)] text-slate-900">
      <section className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-sky-400 to-cyan-300 text-lg font-semibold text-white shadow-sm">
              M
            </div>
            <div>
              <p className="font-semibold tracking-tight text-slate-900">MedNote AI</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Pediatric + Outpatient Therapy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clinician login
            </Link>
            <Link
              href="/soap?demo=1"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Open demo workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
              AI Documentation Assistant for Pediatric and Outpatient Therapy
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Reduce documentation burnout and spend more time supporting children
              and families.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              MedNote AI helps pediatric therapists turn rough session notes into
              clearer clinical documentation for pediatric neurodiverse care and
              standard outpatient therapy workflows, including OT, SLP, PT, ABA,
              school-based therapy, and general rehab visits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/soap?demo=1"
                className="rounded-full bg-gradient-to-r from-teal-600 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200/80 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-teal-200"
              >
                Try demo mode
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Start clinician account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>Designed for clinician oversight</span>
              <span>Warm, pediatric-centered documentation support</span>
              <span>Practical for small clinics and independent therapists</span>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric value="8-15 min" label="Potential time saved per note" />
              <Metric value="1 draft" label="From rough notes to polished structure" />
              <Metric value="5+" label="Pediatric therapy use cases supported" />
            </div>

            <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-teal-200/90">
                    Session workflow
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Paste rough notes, keep clinical oversight
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-medium text-white/80">
                  Demo mode
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-[24px] bg-white/5 p-4">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-teal-300/20 text-sm font-semibold text-teal-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[28px] border border-slate-200/70 bg-white/85 p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                {card.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-sky-50 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
              Before / after
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Show the time-saving story clearly
            </h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-[24px] border border-rose-100 bg-white/90 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Before
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  “Kid dysregulated in loud group. Needed heavy work first. Did
                  shoe tying, writing, lots of cues, teacher wants more ideas for
                  transitions.”
                </p>
              </div>
              <div className="rounded-[24px] border border-teal-100 bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                  After
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-100">
                  “Child benefited from proprioceptive preparatory input prior to
                  seated fine motor tasks. Required visual and verbal cueing for
                  sequencing during shoe-tying and written output activities.
                  Teacher collaboration focused on transition supports, movement
                  breaks, and classroom carryover.”
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              High-value product scope
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Focus the MVP on the workflows that small pediatric clinics feel
              every day
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {featureList.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Trust + positioning
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Warm, clinician-centered, neurodiversity-affirming
            </h2>
            <div className="mt-6 space-y-4">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-slate-800">
                Testimonials section placeholder
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Add quotes from pediatric OT, SLP, PT, and school-based clinicians
                once clinic pilots begin. Keep this visible so the homepage feels
                sales-ready without overclaiming before launch.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-teal-900 via-slate-900 to-sky-950 p-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
              Future platform
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Build a niche wedge now, expand into workflow later
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Start with documentation relief for pediatric neurodiverse therapy
              clinics. Then layer in progress tracking, caregiver communication,
              and clinic workflow tools once documentation value is proven.
            </p>
            <div className="mt-6 space-y-3">
              {futureModules.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/soap?demo=1"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore demo mode
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View product app
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-4">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

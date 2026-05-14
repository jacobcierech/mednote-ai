import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

const coreSections = [
  {
    eyebrow: 'Built for OT documentation',
    title: 'Structured drafts for real occupational therapy workflow',
    body:
      'Generate SOAP notes, progress notes, discharge drafts, insurance-support language, and plan-of-care summaries from rough OT session notes without forcing clinicians into a generic AI workflow.',
  },
  {
    eyebrow: 'De-identified workflow',
    title: 'Safety prompts built around de-identification',
    body:
      'The workspace warns users not to enter names, DOBs, contact details, MRNs, insurance identifiers, school names, or other PHI, and it adds an explicit de-identification confirmation before generation.',
  },
  {
    eyebrow: 'Clinician-reviewed outputs',
    title: 'AI drafts stay under clinician control',
    body:
      'Outputs are positioned as draft documentation only. Clinicians stay responsible for review, editing, final wording, and whether a note should be used in the chart.',
  },
  {
    eyebrow: 'Copy / export workflow',
    title: 'Move drafts out quickly when the clinic is busy',
    body:
      'Copy, download, clear, regenerate, and save drafts so the tool feels practical for beta testing in real outpatient OT workflow.',
  },
];

const betaChecklist = [
  'Paste rough OT notes instead of formatting from scratch.',
  'Keep inputs de-identified before generation.',
  'Review AI output before copying into your own documentation workflow.',
  'Use copy/export controls for a faster end-of-day workflow.',
];

const trustItems = [
  'HIPAA-conscious positioning without claiming HIPAA compliance.',
  'De-identified workflow prompts based on common HHS de-identification guidance concepts.',
  'Clear clinician-review disclaimers around every generated draft.',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_100%)] text-slate-900">
      <section className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-sky-400 to-cyan-300 text-lg font-semibold text-white shadow-sm">
              M
            </div>
            <div>
              <p className="font-semibold tracking-tight text-slate-900">MedNote AI</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Occupational Therapy Documentation
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
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-teal-200 bg-white/85 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
              AI Documentation Assistant for Occupational Therapy
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Generate structured OT documentation drafts faster while keeping clinician review and judgment in control.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              MedNote AI helps occupational therapists turn rough visit notes into organized draft documentation for
              outpatient, pediatric, neurodiverse, and general rehab workflows without overclaiming what AI should do.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/soap?demo=1"
                className="rounded-full bg-gradient-to-r from-teal-600 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200/80 transition hover:translate-y-[-1px]"
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
              <span>OT-first positioning</span>
              <span>De-identified workflow</span>
              <span>Clinician-reviewed drafts only</span>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric value="SOAP +" label="Progress, discharge, insurance" />
              <Metric value="Beta-safe" label="De-identification prompts" />
              <Metric value="Copy/export" label="Ready-to-use draft workflow" />
            </div>

            <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
                Beta workflow
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Calm, professional, and practical
              </h2>
              <div className="mt-5 space-y-3 rounded-[24px] bg-white/5 p-4">
                {betaChecklist.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-teal-300/20 text-sm font-semibold text-teal-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {coreSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[28px] border border-slate-200/70 bg-white/90 p-7 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                {section.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {section.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              OT documentation
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Built for the note types OT clinicians actually use
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'SOAP note drafts',
                'Progress notes',
                'Discharge note drafts',
                'Insurance-support language',
                'Plan-of-care summaries',
                'Copy and export workflow',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-teal-900 via-slate-900 to-sky-950 p-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
              Trust language
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Professional, careful beta positioning
            </h2>
            <div className="mt-6 space-y-3">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
              MedNote AI does not claim HIPAA compliance on this beta landing page. The current positioning is
              de-identified workflow support with clinician oversight.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Ready for beta testing
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Start with a safer OT drafting workflow
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Use the demo to review the de-identified workflow, output controls, and clinician-review messaging
                before inviting more beta users in.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/soap?demo=1"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open demo workspace
              </Link>
              <Link
                href="/privacy"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Review privacy page
              </Link>
            </div>
          </div>
        </div>

        <SiteFooter light />
      </section>
    </main>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-4">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}


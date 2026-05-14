import SiteFooter from '../../components/SiteFooter';

export const metadata = {
  title: 'Terms of Use | MedNote AI',
};

function TermsSection({ title, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-7 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
            Terms of Use
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Drafting assistant only
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            MedNote AI is an AI-assisted drafting tool for clinicians. It is not a substitute for professional review,
            diagnosis, treatment planning, legal advice, or billing certainty.
          </p>
        </div>

        <div className="space-y-6">
          <TermsSection title="Clinical review is required">
            <p>
              Every AI-generated output must be reviewed, edited, and approved by a licensed clinician before use in a
              medical record, patient communication, school document, insurance submission, or clinical workflow.
            </p>
          </TermsSection>

          <TermsSection title="No medical advice">
            <p>
              MedNote AI does not provide medical advice, diagnosis, treatment decisions, or independent clinical
              judgment. The tool assists with drafting only.
            </p>
          </TermsSection>

          <TermsSection title="No billing or coding guarantees">
            <p>
              MedNote AI does not guarantee billing outcomes, coding accuracy, payer acceptance, coverage decisions, or
              reimbursement.
            </p>
          </TermsSection>

          <TermsSection title="De-identified workflow during beta testing">
            <p>
              Users should not enter PHI into the app during beta testing. Unless a future signed agreement and
              supporting infrastructure explicitly allow otherwise, the tool should be used only with de-identified
              documentation drafts.
            </p>
          </TermsSection>

          <TermsSection title="User responsibility">
            <p>
              The user is responsible for final documentation content, regulatory compliance, professional judgment, and
              whether any generated draft is appropriate for actual use.
            </p>
          </TermsSection>
        </div>

        <SiteFooter light />
      </div>
    </main>
  );
}


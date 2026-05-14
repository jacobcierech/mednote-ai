import SiteFooter from '../../components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy | MedNote AI',
};

function PolicySection({ title, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/92 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-8">
      <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_100%)]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 rounded-[32px] border border-slate-200/70 bg-white/94 p-7 shadow-[0_18px_56px_rgba(15,23,42,0.05)] sm:p-9">
          <div className="inline-flex rounded-full border border-teal-200 bg-white/90 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
            Privacy Policy
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Last Updated: May 2026
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            De-identified workflow first
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            MedNote AI is intended for de-identified documentation drafts only. Users should not enter patient names,
            dates of birth, contact details, medical record numbers, insurance identifiers, school names, or other
            identifying information.
          </p>
        </div>

        <div className="space-y-6">
          <PolicySection title="How the app should be used">
            <p>
              MedNote AI is designed to help clinicians create draft documentation from de-identified information. It is
              not intended to receive or store directly identifying patient data during beta testing.
            </p>
            <p>
              Users are responsible for removing identifiers before entering text into the app and for reviewing all
              outputs before any use in a medical record or clinical workflow.
            </p>
          </PolicySection>

          <PolicySection title="What users should not enter">
            <p>
              Do not enter names, dates of birth, street addresses, phone numbers, email addresses, medical record
              numbers, insurance information, school names, account numbers, or other identifiers.
            </p>
            <p>
              This aligns with HHS de-identification guidance, which focuses on removing identifiers such as names,
              dates directly related to an individual, contact information, medical record numbers, and other unique
              identifying details.
            </p>
          </PolicySection>

          <PolicySection title="Clinician responsibility">
            <p>
              The clinician remains responsible for the final note, final documentation, and final decision to use or
              discard any generated draft. MedNote AI does not replace clinical judgment.
            </p>
            <p>
              MedNote AI is not intended for emergency use, real-time clinical decision-making, or urgent medical
              communication.
            </p>
          </PolicySection>

          <PolicySection title="What data may be collected or stored">
            <p>During beta testing, the app may collect or store the following:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Basic account information such as email address and optional professional profile information may be
                collected for authentication and platform access.
              </li>
              <li>De-identified note inputs entered into the workspace.</li>
              <li>Generated draft outputs and saved note history.</li>
              <li>Basic usage records needed for authentication, troubleshooting, and product improvement.</li>
            </ul>
            <p>
              Reasonable administrative and technical safeguards are used to help protect stored account and application
              data during beta testing.
            </p>
            <p>
              Users should assume saved notes are part of the product record and should keep all note content
              de-identified.
            </p>
            {/* TODO: Legal review should confirm whether this data collection summary needs more specificity before broader beta distribution. */}
          </PolicySection>

          <PolicySection title="Contact">
            <p>
              For privacy questions, contact:{' '}
              <a className="font-medium text-teal-700 transition-colors hover:text-teal-800" href="mailto:privacy@mednoteai.example">
                privacy@mednoteai.example
              </a>
            </p>
            {/* TODO: Legal review should confirm the final privacy contact channel and escalation workflow. */}
          </PolicySection>
        </div>

        <SiteFooter light />
      </div>
    </main>
  );
}


import SiteFooter from '../../components/SiteFooter';

export const metadata = {
  title: 'Contact | MedNote AI',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fbfd_0%,_#eef4f8_100%)]">
      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
          <div className="inline-flex rounded-full border border-teal-200 bg-white/90 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
            Contact
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Get in touch
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Questions about the beta, privacy expectations, or clinic use cases can go to the placeholder contact
            below until a dedicated support workflow is in place.
          </p>

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
            <a
              href="mailto:hello@mednoteai.example"
              className="mt-3 inline-block text-lg font-semibold text-teal-700 transition hover:text-teal-800"
            >
              hello@mednoteai.example
            </a>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Please do not send patient information or PHI by email.
            </p>
          </div>
        </div>

        <SiteFooter light />
      </div>
    </main>
  );
}


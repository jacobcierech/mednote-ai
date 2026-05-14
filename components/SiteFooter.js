import Link from 'next/link';

export default function SiteFooter({ light = false }) {
  return (
    <footer
      className={`mt-12 border-t ${
        light ? 'border-slate-200/80' : 'border-slate-200/60'
      } pt-6`}
    >
      <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl leading-6 text-slate-500">
          MedNote AI is designed to support clinician-reviewed, de-identified documentation drafting workflows.
        </p>
        <div className="flex flex-wrap items-center gap-5 text-slate-500">
          <Link href="/privacy" className="transition-colors duration-150 hover:text-slate-800">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors duration-150 hover:text-slate-800">
            Terms of Use
          </Link>
          <Link href="/contact" className="transition-colors duration-150 hover:text-slate-800">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

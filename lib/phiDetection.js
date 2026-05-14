const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN =
  /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/;
const DATE_PATTERN =
  /\b(?:(?:0?[1-9]|1[0-2])[\/-](?:0?[1-9]|[12]\d|3[01])[\/-](?:\d{2}|\d{4})|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4})\b/i;
const MRN_LABEL_PATTERN =
  /\b(?:mrn|medical record|record number|member id|policy number|account number|subscriber id|insurance id)[:#\s-]*[A-Z0-9-]{4,}\b/i;
const LONG_ID_PATTERN = /\b\d{7,}\b/;
const FULL_NAME_PATTERN = /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/;

export const PHI_WARNING_TEXT =
  'Do not enter patient names, DOBs, addresses, MRNs, phone numbers, emails, insurance info, school names, or other identifying information. Use de-identified text only.';

export const REVIEW_DISCLAIMER_TEXT =
  'AI-generated draft. Clinician must review, edit, and approve before use in the medical record. This tool does not provide medical advice, diagnosis, billing guarantees, or independent clinical judgment.';

const DETECTION_RULES = [
  {
    type: 'Email address',
    pattern: EMAIL_PATTERN,
    message: 'An email-like value was detected.',
  },
  {
    type: 'Phone number',
    pattern: PHONE_PATTERN,
    message: 'A phone-number-like value was detected.',
  },
  {
    type: 'Date / DOB',
    pattern: DATE_PATTERN,
    message: 'A date-like value was detected.',
  },
  {
    type: 'MRN / policy / record number',
    pattern: MRN_LABEL_PATTERN,
    message: 'A medical-record-number-like or policy-number-like value was detected.',
  },
  {
    type: 'Unique identifier',
    pattern: LONG_ID_PATTERN,
    message: 'A long numeric identifier was detected.',
  },
  {
    type: 'Possible full name',
    pattern: FULL_NAME_PATTERN,
    message: 'A full-name-like phrase was detected.',
  },
];

export function detectPhiCandidates(values) {
  const findings = [];
  const normalizedValues = Array.isArray(values) ? values : [];

  normalizedValues.forEach(({ label, value }) => {
    if (!value || typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed) return;

    DETECTION_RULES.forEach((rule) => {
      const match = trimmed.match(rule.pattern);
      if (!match) return;

      findings.push({
        field: label,
        type: rule.type,
        message: rule.message,
        sample: match[0],
      });
    });
  });

  const deduped = [];
  const seen = new Set();

  findings.forEach((finding) => {
    const key = `${finding.field}-${finding.type}-${finding.sample}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(finding);
  });

  return deduped;
}

export function buildPhiSignature(values) {
  const normalizedValues = Array.isArray(values) ? values : [];
  return normalizedValues
    .map(({ label, value }) => `${label}:${String(value || '').trim()}`)
    .join('||');
}


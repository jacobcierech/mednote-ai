import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const toolkitSchema = {
  type: 'object',
  properties: {
    progressNote: { type: 'string' },
    referralNote: { type: 'string' },
    dischargeNote: { type: 'string' },
    insuranceSupportNote: { type: 'string' },
    planOfCareSummary: { type: 'string' },
    recommendedFrequency: { type: 'string' },
    recommendedDuration: { type: 'string' },
    medicalNecessityRationale: { type: 'string' },
    recommendedAssessments: {
      type: 'array',
      items: { type: 'string' },
    },
    recommendedTreatmentPlan: {
      type: 'array',
      items: { type: 'string' },
    },
    recommendedGoals: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'progressNote',
    'referralNote',
    'dischargeNote',
    'insuranceSupportNote',
    'planOfCareSummary',
    'recommendedFrequency',
    'recommendedDuration',
    'medicalNecessityRationale',
    'recommendedAssessments',
    'recommendedTreatmentPlan',
    'recommendedGoals',
  ],
  additionalProperties: false,
};

function isValidToolkit(value) {
  return Boolean(
    value &&
      typeof value.progressNote === 'string' &&
      typeof value.referralNote === 'string' &&
      typeof value.dischargeNote === 'string' &&
      typeof value.insuranceSupportNote === 'string' &&
      typeof value.planOfCareSummary === 'string' &&
      typeof value.recommendedFrequency === 'string' &&
      typeof value.recommendedDuration === 'string' &&
      typeof value.medicalNecessityRationale === 'string' &&
      Array.isArray(value.recommendedAssessments) &&
      value.recommendedAssessments.every((item) => typeof item === 'string') &&
      Array.isArray(value.recommendedTreatmentPlan) &&
      value.recommendedTreatmentPlan.every((item) => typeof item === 'string') &&
      Array.isArray(value.recommendedGoals) &&
      value.recommendedGoals.every((item) => typeof item === 'string')
  );
}

function extractToolkit(response) {
  if (isValidToolkit(response?.output_parsed)) {
    return response.output_parsed;
  }

  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    try {
      const parsed = JSON.parse(response.output_text);
      if (isValidToolkit(parsed)) {
        return parsed;
      }
    } catch {}
  }

  const contentItems = response?.output?.flatMap((entry) => entry?.content || []) || [];

  for (const item of contentItems) {
    const parsedCandidate = item?.parsed || item?.json || null;
    if (isValidToolkit(parsedCandidate)) {
      return parsedCandidate;
    }

    const textCandidate =
      typeof item?.text === 'string'
        ? item.text
        : typeof item?.value === 'string'
          ? item.value
          : '';

    if (!textCandidate.trim()) continue;

    try {
      const parsed = JSON.parse(textCandidate);
      if (isValidToolkit(parsed)) {
        return parsed;
      }
    } catch {}
  }

  return null;
}

function buildPrompt({
  patientName,
  visitFocus,
  diagnosis,
  precautions,
  visitNumber,
  caseContext,
  visitData,
  evalData,
  roughNotes,
}) {
  return [
    patientName && `Child: ${patientName}`,
    visitFocus && `Visit focus: ${visitFocus}`,
    diagnosis && `Diagnosis: ${diagnosis}`,
    visitNumber && `Visit number: ${visitNumber}`,
    precautions && `Precautions: ${precautions}`,
    caseContext && `Case context: ${caseContext}`,
    evalData?.chiefComplaint && `Chief complaint: ${evalData.chiefComplaint}`,
    evalData?.occupationalProfile && `Strengths and routines: ${evalData.occupationalProfile}`,
    evalData?.plof && `Baseline participation: ${evalData.plof}`,
    evalData?.clof && `Current participation: ${evalData.clof}`,
    evalData?.pain && `Regulation / safety / symptom summary: ${evalData.pain}`,
    evalData?.deficit && `Primary support need: ${evalData.deficit}`,
    evalData?.limitation && `Participation area: ${evalData.limitation}`,
    evalData?.setting && `Therapy setting: ${evalData.setting}`,
    visitData?.subjectiveReport && `Subjective report: ${visitData.subjectiveReport}`,
    visitData?.painToday && `Pain / regulation today: ${visitData.painToday}`,
    visitData?.interventionsCompleted &&
      `Interventions completed: ${visitData.interventionsCompleted}`,
    visitData?.patientResponse && `Child response and clinical observations: ${visitData.patientResponse}`,
    visitData?.assistLevel && `Assist level: ${visitData.assistLevel}`,
    visitData?.homeProgram && `Home program / caregiver education: ${visitData.homeProgram}`,
    visitData?.planNextVisit && `Next visit plan: ${visitData.planNextVisit}`,
    roughNotes && `Rough notes: ${roughNotes}`,
  ]
    .filter(Boolean)
    .join('\n');
}

const SYSTEM_PROMPT = `You are an experienced pediatric neurodiverse therapy documentation assistant supporting clinicians in busy, short-staffed outpatient, school-based, and private-pay settings.

Return valid JSON matching the schema exactly.

Your outputs must help a clinician move quickly while keeping full oversight.

Write:
- a concise progress note
- a concise referral / collaboration note
- a concise discharge note draft
- a concise insurance support / medical necessity note
- a concise plan of care summary written in accurate insurance-friendly wording
- a recommended treatment frequency
- a recommended duration of care
- a brief medical necessity rationale
- recommended assessments
- recommended treatment plan items
- recommended goals

Clinical style requirements:
- use warm, neurodiversity-affirming, participation-focused pediatric therapy language
- describe sensory, executive functioning, regulation, communication, motor, self-care, play, school, and caregiver carryover needs when supported
- sound efficient and documentation-ready, not verbose or generic
- make the skilled nature of therapy easy to understand for a clinician or payer
- for plan of care language, be precise about skilled therapy need, functional participation impact, caregiver coaching, and measurable treatment focus
- avoid stigmatizing language
- avoid filler and avoid inventing measurements, diagnoses, IEP details, or progress not present in the input

Section guidance:
- progressNote: short payer-ready clinical summary of current session focus, support needs, skilled intervention, and ongoing need
- referralNote: short referral or collaboration note draft that explains why coordination with another provider, specialist, school team, or caregiver support pathway may be clinically useful when supported by the input; if no outside referral is clearly indicated, write a concise note about continued coordination needs instead of inventing a referral
- dischargeNote: short discharge summary draft explaining current status, supports, functional needs, and recommended next steps if discharge were being considered
- insuranceSupportNote: short medical necessity summary emphasizing why skilled therapy remains indicated, what participation areas are affected, and why caregiver/home/school supports alone are not enough when supported
- planOfCareSummary: concise insurance-friendly plan of care paragraph with accurate, specific pediatric therapy wording describing skilled intervention focus, caregiver education, functional participation targets, and why continued treatment is warranted
- recommendedFrequency: short recommendation such as "1x/week" or "2x/week" only when supportable from the input; when the input is limited, provide a cautious documentation-ready recommendation instead of inventing intensity
- recommendedDuration: short recommendation such as "12 weeks" or "8-12 weeks" only when supportable from the input; when uncertain, provide a cautious clinically reasonable range
- medicalNecessityRationale: concise payer-facing rationale describing why continued skilled pediatric therapy is warranted at this time
- recommendedAssessments: short list of practical pediatric assessments, observations, caregiver interviews, or participation reviews that fit the case
- recommendedTreatmentPlan: short list of specific treatment focus items using precise clinical phrasing suitable for a plan of care
- recommendedGoals: short list of functional pediatric goals tied to participation, routines, regulation, school, self-care, play, or caregiver carryover

Output only the structured JSON.`;

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is missing. Add it to .env.local.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      patientName = '',
      visitFocus = 'Pediatric OT',
      diagnosis = '',
      precautions = '',
      visitNumber = '',
      caseContext = '',
      visitData = {},
      evalData = {},
      roughNotes = '',
    } = body || {};

    const prompt = buildPrompt({
      patientName,
      visitFocus,
      diagnosis,
      precautions,
      visitNumber,
      caseContext,
      visitData,
      evalData,
      roughNotes,
    });

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: 'Please enter child context or rough notes before generating clinic tools.' },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: prompt }],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'clinic_toolkit',
          strict: true,
          schema: toolkitSchema,
        },
      },
    });

    const toolkit = extractToolkit(response);

    if (!toolkit) {
      throw new Error('No structured clinic toolkit was returned.');
    }

    return NextResponse.json({ toolkit });
  } catch (error) {
    console.error('Clinic toolkit route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate clinic toolkit output.' },
      { status: 500 }
    );
  }
}

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const soapNoteSchema = {
  type: 'object',
  properties: {
    subjective: { type: 'string' },
    objective: {
      type: 'array',
      items: { type: 'string' },
    },
    assessment: { type: 'string' },
    plan: { type: 'string' },
  },
  required: ['subjective', 'objective', 'assessment', 'plan'],
  additionalProperties: false,
};

function isValidSoapNote(value) {
  return Boolean(
    value &&
      typeof value.subjective === 'string' &&
      Array.isArray(value.objective) &&
      value.objective.every((item) => typeof item === 'string') &&
      typeof value.assessment === 'string' &&
      typeof value.plan === 'string'
  );
}

function extractSoapNote(response) {
  if (isValidSoapNote(response?.output_parsed)) {
    return response.output_parsed;
  }

  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    try {
      const parsed = JSON.parse(response.output_text);
      if (isValidSoapNote(parsed)) {
        return parsed;
      }
    } catch {}
  }

  const contentItems = response?.output?.flatMap((entry) => entry?.content || []) || [];

  for (const item of contentItems) {
    const parsedCandidate = item?.parsed || item?.json || null;
    if (isValidSoapNote(parsedCandidate)) {
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
      if (isValidSoapNote(parsed)) {
        return parsed;
      }
    } catch {}
  }

  return null;
}

function buildPrompt({ patientName, visitFocus, diagnosis, precautions, visitNumber, caseContext, visitData }) {
  const contextLines = [
    patientName && `Patient: ${patientName}`,
    visitFocus && `Visit focus: ${visitFocus}`,
    diagnosis && `Diagnosis: ${diagnosis}`,
    visitNumber && `Visit number: ${visitNumber}`,
    precautions && `Precautions: ${precautions}`,
    caseContext && `Case context: ${caseContext}`,
    visitData.subjectiveReport && `Subjective report: ${visitData.subjectiveReport}`,
    visitData.painToday && `Pain today: ${visitData.painToday}`,
    visitData.interventionsCompleted &&
      `Interventions completed: ${visitData.interventionsCompleted}`,
    visitData.patientResponse && `Patient response: ${visitData.patientResponse}`,
    visitData.assistLevel && `Assist level: ${visitData.assistLevel}`,
    visitData.homeProgram && `Home program / education: ${visitData.homeProgram}`,
    visitData.planNextVisit && `Next visit plan: ${visitData.planNextVisit}`,
  ].filter(Boolean);

  return contextLines.join('\n');
}

const SYSTEM_PROMPT = `You are an experienced pediatric occupational therapist and documentation assistant for clinicians working with neurodiverse children.

Write a concise, clinically specific pediatric therapy SOAP note using only the provided details.

Requirements:
- Return valid JSON matching the schema exactly.
- The objective field must be an array of short clinical statements.
- Use pediatric therapy language that links support needs to participation in home, school, play, self-care, communication, and family routines.
- Use neurodiversity-affirming wording that describes observable support needs, regulation, access, communication, and participation.
- Be specific about skilled interventions, sensory supports, visual supports, executive functioning supports, caregiver education, school carryover, cues, task demands, and child response when provided.
- Favor concrete phrases like "used visual schedule and first-then language during transition from preferred activity" over vague summaries.
- Preserve useful clinical specifics such as sensory preparation, proprioceptive input, vestibular input, co-regulation, visual schedule, task chunking, transition support, handwriting, shoe tying, self-care routines, classroom participation, IEP support, caregiver education, and developmental milestones when supported by the input.

Avoid:
- generic filler
- motivational language
- "tolerated session well" unless explicitly supported
- "making progress" unless clearly supported
- deficit-focused or stigmatizing language such as "noncompliant," "bad behavior," "tantrum," "refused," "manipulative," or "attention seeking"; describe what was observed and what support was needed instead
- restating the same sentence across sections
- inventing measurements, milestones, IEP details, diagnoses, goals, frequency, duration, or progress not present in the input

Section guidance:
- Subjective: summarize caregiver, child, teacher, or clinician-reported concerns and routine impacts only.
- Objective: list skilled therapy interventions, caregiver or school education, supports used, cues, and observed participation.
- Assessment: interpret how regulation, sensory, motor, executive functioning, communication, or developmental support needs affect participation and why skilled therapy remains indicated.
- Plan: state the next clinical focus with specific pediatric therapy priorities and carryover needs.`;

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
      visitFocus = 'Outpatient OT',
      diagnosis = '',
      precautions = '',
      visitNumber = '',
      caseContext = '',
      visitData = {},
    } = body || {};

    const prompt = buildPrompt({
      patientName,
      visitFocus,
      diagnosis,
      precautions,
      visitNumber,
      caseContext,
      visitData: {
        subjectiveReport: visitData.subjectiveReport || '',
        interventionsCompleted: visitData.interventionsCompleted || '',
        patientResponse: visitData.patientResponse || '',
        assistLevel: visitData.assistLevel || '',
        painToday: visitData.painToday || '',
        homeProgram: visitData.homeProgram || '',
        planNextVisit: visitData.planNextVisit || '',
      },
    });

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: 'Please enter visit details before generating a SOAP note.' },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'soap_note',
          strict: true,
          schema: soapNoteSchema,
        },
      },
    });

    const soapNote = extractSoapNote(response);

    if (!soapNote) {
      throw new Error('No structured SOAP note was returned.');
    }

    return NextResponse.json({ soapNote });
  } catch (error) {
    console.error('SOAP route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SOAP note.' },
      { status: 500 }
    );
  }
}

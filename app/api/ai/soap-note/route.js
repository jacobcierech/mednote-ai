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

function buildEvaluationPrompt(evaluationData = {}) {
  const lines = [
    evaluationData.setting && `Evaluation setting: ${evaluationData.setting}`,
    evaluationData.patientGoals && `Patient goals: ${evaluationData.patientGoals}`,
    evaluationData.pain && `Evaluation pain findings: ${evaluationData.pain}`,
    evaluationData.rom && `ROM findings: ${evaluationData.rom}`,
    evaluationData.strength && `Strength findings: ${evaluationData.strength}`,
    evaluationData.standardizedAssessments &&
      `Standardized assessments: ${evaluationData.standardizedAssessments}`,
    evaluationData.functionalDeficits &&
      `Functional deficits: ${evaluationData.functionalDeficits}`,
    evaluationData.barriers && `Barriers: ${evaluationData.barriers}`,
    evaluationData.strengths && `Strengths: ${evaluationData.strengths}`,
    evaluationData.clinicalObservations &&
      `Clinical observations: ${evaluationData.clinicalObservations}`,
  ].filter(Boolean);

  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are an experienced outpatient occupational therapist writing a real visit note.

Write a concise but clinically rich SOAP note using only the provided details.

Requirements:
- Return valid JSON matching the schema exactly.
- The objective field must be an array of short clinical statements.
- Use OT-specific language that connects observed impairments to occupational performance.
- Document skilled OT interventions, patient response, cueing, movement quality, symptom behavior, task demands, and functional carryover when provided.
- Preserve concrete clinical details such as tendon glides, edema management, scar management, fine motor coordination, in-hand manipulation, bilateral hand use, proximal compensation, pacing, ergonomic modification, dressing fasteners, jar opening, keyboarding, grooming reach, and meal prep when supported by the input.
- If evaluation findings are provided, carry them forward into the note so the assessment sounds grounded in the broader plan of care.
- Show clinical reasoning. Explain why the current presentation still requires skilled OT.

Language expectations:
- favor specific wording like "required intermittent verbal cues to reduce compensatory shoulder elevation during reaching task" over generic wording like "patient needed cues"
- use documentation-style language that sounds efficient and defensible
- emphasize occupational performance, task quality, symptom provocation, endurance, dexterity, grasp/pinch demands, coordination, motor control, and functional participation when appropriate

Avoid:
- generic filler
- motivational language
- "tolerated session well" unless explicitly supported
- "making progress" unless clearly supported
- repeating the same phrase across multiple sections
- inventing measurements, goals, frequency, duration, or progress not present in the input

Section guidance:
- Subjective: summarize patient-reported symptoms, functional complaints, and symptom behavior only.
- Objective: list skilled OT interventions, education, cueing, and observable task performance in short statements.
- Assessment: interpret how current deficits affect occupational performance and why skilled OT remains indicated at this stage.
- Plan: state the next OT focus with specific treatment priorities, progression targets, or task areas.`;

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
      evaluationData = {},
    } = body || {};

    const evaluationPrompt = buildEvaluationPrompt(evaluationData);
    const prompt = buildPrompt({
      patientName,
      visitFocus,
      diagnosis,
      precautions,
      visitNumber,
      caseContext: [caseContext, evaluationPrompt].filter(Boolean).join('\n'),
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

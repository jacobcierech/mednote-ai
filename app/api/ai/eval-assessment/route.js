import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const evalSchema = {
  type: 'object',
  properties: {
    evaluationSummary: { type: 'string' },
    assessment: { type: 'string' },
    clinicalConnections: {
      type: 'array',
      items: { type: 'string' },
    },
    treatmentPriorities: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'evaluationSummary',
    'assessment',
    'clinicalConnections',
    'treatmentPriorities',
  ],
  additionalProperties: false,
};

function isValidEvalResult(value) {
  return Boolean(
    value &&
      typeof value.evaluationSummary === 'string' &&
      typeof value.assessment === 'string' &&
      Array.isArray(value.clinicalConnections) &&
      value.clinicalConnections.every((item) => typeof item === 'string') &&
      Array.isArray(value.treatmentPriorities) &&
      value.treatmentPriorities.every((item) => typeof item === 'string')
  );
}

function extractEvalResult(response) {
  if (isValidEvalResult(response?.output_parsed)) return response.output_parsed;

  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    try {
      const parsed = JSON.parse(response.output_text);
      if (isValidEvalResult(parsed)) return parsed;
    } catch {}
  }

  const contentItems = response?.output?.flatMap((entry) => entry?.content || []) || [];

  for (const item of contentItems) {
    const parsedCandidate = item?.parsed || item?.json || null;
    if (isValidEvalResult(parsedCandidate)) return parsedCandidate;

    const textCandidate =
      typeof item?.text === 'string'
        ? item.text
        : typeof item?.value === 'string'
          ? item.value
          : '';

    if (!textCandidate.trim()) continue;

    try {
      const parsed = JSON.parse(textCandidate);
      if (isValidEvalResult(parsed)) return parsed;
    } catch {}
  }

  return null;
}

function buildPrompt(data) {
  return [
    data.patientName && `Patient: ${data.patientName}`,
    data.diagnosis && `Diagnosis: ${data.diagnosis}`,
    data.setting && `Setting: ${data.setting}`,
    data.patientGoals && `Patient goals: ${data.patientGoals}`,
    data.pain && `Pain: ${data.pain}`,
    data.rom && `ROM: ${data.rom}`,
    data.strength && `Strength: ${data.strength}`,
    data.standardizedAssessments &&
      `Standardized assessments: ${data.standardizedAssessments}`,
    data.functionalDeficits && `Functional deficits: ${data.functionalDeficits}`,
    data.barriers && `Barriers: ${data.barriers}`,
    data.strengths && `Strengths: ${data.strengths}`,
    data.clinicalObservations &&
      `Clinical observations: ${data.clinicalObservations}`,
    data.occupationalProfile &&
      `Occupational profile: ${data.occupationalProfile}`,
    data.plof && `Prior level of function: ${data.plof}`,
    data.clof && `Current level of function: ${data.clof}`,
    data.precautions && `Precautions: ${data.precautions}`,
    data.postopStatus && `Post-op status: ${data.postopStatus}`,
  ]
    .filter(Boolean)
    .join('\n');
}

const SYSTEM_PROMPT = `You are an experienced outpatient occupational therapist documenting a real evaluation.

Return valid JSON matching the schema exactly.

Write like a skilled OT in an outpatient orthopedic, hand therapy, or neuro rehab clinic:
- concise
- clinically specific
- functionally grounded
- efficient enough for real documentation

Your job:
- write an evaluation summary that organizes the main occupational profile, symptom picture, objective findings, and functional impact
- write an assessment paragraph that clearly explains why skilled OT is indicated
- provide short clinical connection bullets that link body structure impairments to occupational performance limits
- provide short treatment priorities that sound like an actual plan of care focus

Clinical reasoning expectations:
- explicitly connect pain, ROM, strength, standardized assessment findings, task observations, and current functional status
- explain how impairments are affecting ADLs, IADLs, work, school, community participation, or meaningful routines
- identify why skilled OT is needed beyond a home program alone when supported by the input
- highlight compensatory movement, reduced task efficiency, symptom provocation, motor control issues, endurance limits, dexterity deficits, or safety concerns when supported

Language expectations:
- use OT-specific wording such as occupational performance, task demands, functional reach, grasp/pinch, in-hand manipulation, bilateral coordination, distal control, proximal stability, pacing, joint protection, activity tolerance, movement quality, symptom management, and task-specific training when appropriate
- prefer concrete phrasing over generic statements
- sound like documentation, not marketing copy

Avoid:
- filler such as "patient would benefit from skilled therapy" without saying why
- vague statements like "deficits impact function" without naming the function
- repeating the same point across sections
- inventing measurements, diagnoses, goals, history, frequency, or prognosis not provided`;

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is missing. Add it to .env.local.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const prompt = buildPrompt(body || {});

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: 'Please enter evaluation findings before generating output.' },
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
          name: 'eval_assessment',
          strict: true,
          schema: evalSchema,
        },
      },
    });

    const evalResult = extractEvalResult(response);
    if (!evalResult) {
      throw new Error('No structured evaluation result was returned.');
    }

    return NextResponse.json({ evalResult });
  } catch (error) {
    console.error('Eval assessment route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate evaluation output.' },
      { status: 500 }
    );
  }
}

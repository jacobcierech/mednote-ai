const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateClinicalNote({ noteType, specialty, fields, shorthandInput }) {
  const {
    diagnosis = '',
    visitNumber = '',
    precautions = '',
    interventions = '',
    deficits = '',
    assistLevel = '',
    response: patientResponse = '',
    plan = '',
  } = fields || {};

  const structuredContext = [
    diagnosis && `Diagnosis: ${diagnosis}`,
    visitNumber && `Visit #: ${visitNumber}`,
    precautions && `Precautions: ${precautions}`,
    deficits && `Deficits/Impairments: ${deficits}`,
    assistLevel && `Assist Level: ${assistLevel}`,
    interventions && `Interventions: ${interventions}`,
    patientResponse && `Patient Response: ${patientResponse}`,
    plan && `Plan: ${plan}`,
  ].filter(Boolean).join('\n');

  const fullInput = [
    structuredContext && `--- Structured Fields ---\n${structuredContext}`,
    shorthandInput && `--- Provider Notes ---\n${shorthandInput}`,
  ].filter(Boolean).join('\n\n');

  const systemPrompt = `You are a clinical documentation assistant specialized in ${specialty}.
Generate a professional, complete ${noteType} note from the provider's input.
Use clear section headers appropriate for the note type (e.g. S/O/A/P for SOAP).
Use standard medical terminology. Be concise but clinically complete.
Do not fabricate information not implied by the provider's notes.
Format the output cleanly — no markdown, just plain text with section labels.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1200,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a ${noteType} note for a ${specialty} visit:\n\n${fullInput}` }
    ],
  });

  return completion.choices[0].message.content || '';
}

module.exports = { generateClinicalNote };

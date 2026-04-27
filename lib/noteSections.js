export function parseClientNote(noteText = '') {
  const text = typeof noteText === 'string' ? noteText : '';

  const headings = [
    'Evaluation Summary:',
    'Evaluation Assessment:',
    'Clinical Connections:',
    'Treatment Priorities:',
    'Subjective:',
    'Objective:',
    'SOAP Assessment:',
    'Plan:',
  ];

  const indices = headings
    .map((heading) => ({ heading, index: text.indexOf(heading) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);

  const values = {};

  for (let i = 0; i < indices.length; i += 1) {
    const current = indices[i];
    const next = indices[i + 1];
    const start = current.index + current.heading.length;
    const end = next ? next.index : text.length;
    values[current.heading] = text.slice(start, end).trim();
  }

  return {
    evaluationSummary: values['Evaluation Summary:'] || '',
    evalAssessment: values['Evaluation Assessment:'] || '',
    clinicalConnections: toList(values['Clinical Connections:']),
    treatmentPriorities: toList(values['Treatment Priorities:']),
    subjective: values['Subjective:'] || '',
    objective: toList(values['Objective:']),
    soapAssessment: values['SOAP Assessment:'] || '',
    plan: values['Plan:'] || '',
    raw: text,
  };
}

export function hasStructuredClientNote(noteText = '') {
  const parsed = parseClientNote(noteText);

  return Boolean(
      parsed.evaluationSummary ||
      parsed.evalAssessment ||
      parsed.subjective ||
      parsed.objective.length ||
      parsed.soapAssessment ||
      parsed.plan
  );
}

function toList(sectionText = '') {
  return sectionText
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

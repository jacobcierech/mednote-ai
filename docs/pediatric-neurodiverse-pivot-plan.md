# MedNote AI Pediatric Neurodiverse Pivot

## Current Structure

- `app/page.js`
  Public entry point. Best place to reposition the product and sell the niche.
- `app/(app)/dashboard/page.js`
  Authenticated workspace overview with note history and usage stats.
- `app/(app)/soap/page.js`
  Strongest existing clinical workflow. Already partially shifted toward pediatric neurodiverse care and should remain the core MVP product surface.
- `app/(app)/history/page.js`
  Useful for future progress comparison over time and parent/school summary history.
- `app/api/ai/soap-note/route.js`
  Structured AI SOAP generation. Best place to add pediatric discipline-specific prompting and output expansion.
- `app/api/notes/*`
  Persistence layer for saved notes and version history.
- `lib/clinicalLogic.js`
  Current recommendation engine. Good place to expand into pediatric goal banks, autism/ADHD templates, and sensory/executive function supports.

## Highest-Value Improvements

### MVP Now

- Reposition homepage around:
  `AI Documentation Assistant for Pediatric Neurodiverse Therapy`
- Keep the existing SOAP workflow, but rename it as the core pediatric documentation workspace.
- Add demo mode with a pediatric sample case.
- Expand pediatric templates for:
  - autism support
  - ADHD / executive functioning
  - sensory integration
  - school-based participation
- Add stronger trust messaging:
  - clinician oversight
  - privacy / HIPAA positioning
  - supportive-not-replacement framing

### Next Clinical Product Improvements

- Parent/caregiver summary generator
- IEP/school-aligned note helper
- Behavior and participation summary generator
- Progress comparison over time using saved notes
- Pediatric goal bank by discipline:
  - OT
  - SLP
  - PT
  - ABA-aligned language support where appropriate

## Homepage Copy Direction

### Headline

`AI Documentation Assistant for Pediatric Neurodiverse Therapy`

### Subheading

`Reduce documentation burnout and spend more time supporting children and families.`

### Positioning Principles

- Warm
- Clinician-centered
- Neurodiversity-affirming
- Pediatric-focused
- Practical, not hype-heavy

Avoid:

- generic “AI medical scribe” language
- automation/replacement framing
- deficit-only language

## Recommended New Sections / Components

- Hero with pediatric neurodiverse positioning
- Before/after documentation example
- “How it saves time” workflow explainer
- Pediatric feature grid
- Demo mode CTA
- HIPAA / trust / clinician oversight block
- Testimonials placeholder
- Clinic-type targeting block:
  - pediatric OT
  - SLP
  - PT
  - school-based therapy
  - autism/ADHD clinics

## Database / Schema Recommendations

Current schema is enough for note generation, but a pediatric workflow platform should grow toward:

- `clients`
  - id
  - display_name / initials
  - age_range
  - diagnoses
  - care_setting
  - caregiver_contacts_summary
  - school_context_summary

- `episodes_of_care`
  - client_id
  - discipline
  - primary_focus
  - care_plan_summary

- `goals`
  - episode_id
  - goal_text
  - domain
  - source_template
  - active / archived

- `session_notes`
  - existing note structure can evolve into session-level records
  - add session tags:
    - sensory regulation
    - executive functioning
    - self-care
    - social participation
    - school participation

- `caregiver_summaries`
  - note_id
  - summary_text
  - reading_level

- `school_support_summaries`
  - note_id
  - iep_alignment_text
  - classroom_supports

## Scalable Architecture Decisions

### Practical Near-Term

- Keep the current monolith Next.js app
- Keep structured AI routes separated by function:
  - SOAP generation
  - caregiver summary generation
  - school summary generation
  - goal generation
- Keep templates and recommendation logic in `lib/*`
- Add simple feature flags/config by discipline and setting before introducing a more complex admin system

### Avoid Early

- no microservices
- no event bus
- no deeply abstracted plugin system yet
- no overbuilt EMR replacement architecture

## MVP vs Future

### MVP

- Pediatric neurodiverse landing page
- Pediatric SOAP workflow
- Demo mode
- Autism/ADHD/sensory/school-based templates
- Parent/caregiver summary generation
- Goal suggestions
- Trust/privacy positioning

### Phase 2

- Progress comparison over time
- Developmental milestone helper
- School/IEP documentation assistance
- Discipline-specific goal banks

### Phase 3

- Clinic onboarding
- team roles
- saved templates by clinic
- outcome reporting
- broader pediatric workflow platform

## Commercial Readiness

To feel commercially viable, MedNote AI should present as:

- a focused niche SaaS for pediatric neurodiverse therapy clinics
- a documentation-burnout relief tool
- clinically respectful and non-threatening
- obviously useful in under 60 seconds

Key message:

`This helps clinicians write faster, not think less.`

## Immediate Local Build Plan

1. Rework public landing page and messaging
2. Add demo mode into pediatric SOAP workspace
3. Tighten dashboard naming and pediatric workflow labels
4. Add at least one new pediatric AI route beyond SOAP:
   - caregiver summary or goal generation
5. Validate locally
6. Only then push to Railway

const deficitLibrary = {
  sensory_modulation: {
    assessments: ["Sensory profile review", "Caregiver interview", "Classroom participation observation"],
    interventions: [
      "Provided individualized sensory regulation supports using graded proprioceptive, vestibular, tactile, or environmental strategies based on the child's observed needs.",
      "Facilitated participation in daily routine tasks after sensory-based preparation, with attention to regulation, body awareness, and transition readiness."
    ],
    reasoning:
      "Child presents with sensory modulation differences affecting regulation, transitions, and participation in home, school, or therapy routines."
  },

  executive_function: {
    assessments: ["Executive functioning observation", "Caregiver interview", "School routine analysis"],
    interventions: [
      "Used external executive functioning supports including visual schedule, first-then language, task chunking, and predictable transition cues.",
      "Facilitated task initiation, sequencing, and flexible problem solving during meaningful self-care or school-readiness activities."
    ],
    reasoning:
      "Child demonstrates executive functioning support needs affecting initiation, sequencing, transitions, and follow-through during daily routines."
  },

  fine_motor_visual_motor: {
    assessments: ["Fine motor observation", "Visual-motor integration screening", "Handwriting sample"],
    interventions: [
      "Facilitated play-based fine motor and visual-motor activities targeting grasp, bilateral coordination, hand strength, and school task participation.",
      "Practiced handwriting or prewriting demands with graded supports for posture, grasp, visual attention, spacing, sizing, and endurance."
    ],
    reasoning:
      "Child presents with fine motor or visual-motor needs affecting written output, play, self-care, and classroom participation."
  },

  motor_planning: {
    assessments: ["Praxis observation", "Bilateral coordination observation", "Functional play assessment"],
    interventions: [
      "Facilitated play-based motor planning activities using modeling, graded challenge, and opportunities for sequencing novel movement patterns.",
      "Supported bilateral coordination, body awareness, and praxis during functional play, dressing, and school participation tasks."
    ],
    reasoning:
      "Child demonstrates motor planning needs affecting body awareness, sequencing, play participation, and completion of daily routines."
  },

  emotional_regulation: {
    assessments: ["Regulation observation", "Caregiver interview", "Trigger and support pattern review"],
    interventions: [
      "Provided co-regulation support and practiced child-centered regulation strategies during challenging transitions or task demands.",
      "Used predictable structure, choice-making, sensory supports, and recovery time to support emotional regulation and return to participation."
    ],
    reasoning:
      "Child benefits from emotional regulation supports to access therapy, classroom, self-care, and family routines."
  },

  attention_participation: {
    assessments: ["Task participation observation", "Classroom routine review", "Caregiver interview"],
    interventions: [
      "Supported sustained participation using movement breaks, visual cues, reduced task load, and structured work-rest intervals.",
      "Facilitated attention to functional tasks through meaningful activities, environmental supports, and graded task demands."
    ],
    reasoning:
      "Child demonstrates attention and participation support needs that affect completion of meaningful home and school tasks."
  },

  self_care_skills: {
    assessments: ["Self-care routine analysis", "Caregiver interview", "Dressing or hygiene task observation"],
    interventions: [
      "Practiced self-care routines using task breakdown, visual supports, adaptive strategies, and caregiver coaching.",
      "Facilitated dressing, hygiene, or grooming participation with graded prompting and child-centered supports for independence."
    ],
    reasoning:
      "Child demonstrates self-care participation needs affecting family routines, independence, and age-expected daily activities."
  },

  feeding_participation: {
    assessments: ["Mealtime participation observation", "Caregiver interview", "Sensory preference review"],
    interventions: [
      "Supported mealtime participation through sensory-informed exposure, positioning, routine structure, and caregiver coaching as appropriate.",
      "Facilitated positive, low-pressure engagement with mealtime routines while respecting sensory preferences and regulation needs."
    ],
    reasoning:
      "Child presents with feeding or mealtime participation needs affecting family routines and access to age-appropriate occupations."
  },

  communication_participation: {
    assessments: ["Communication participation observation", "Caregiver interview", "School participation review"],
    interventions: [
      "Supported functional communication participation through environmental supports, visual cues, partner strategies, and predictable routines.",
      "Facilitated opportunities for choice-making, requesting support, and participation during play or classroom routines."
    ],
    reasoning:
      "Child demonstrates communication participation support needs affecting play, learning, transitions, and interaction with caregivers or peers."
  },

  gross_motor_coordination: {
    assessments: ["Gross motor observation", "Balance and coordination screening", "Play participation observation"],
    interventions: [
      "Facilitated play-based balance, coordination, postural control, and bilateral integration activities with graded challenge.",
      "Supported gross motor participation in playground, classroom, or community routines through task-specific practice."
    ],
    reasoning:
      "Child presents with gross motor coordination needs affecting play, school participation, and age-appropriate movement routines."
  },

  shoulder_rom: {
    assessments: ["QuickDASH", "Shoulder ROM assessment"],
    interventions: [
      "Provided guided therapeutic exercise and active-assisted ROM to improve shoulder flexion, abduction, and external rotation required for functional upper extremity use.",
      "Facilitated functional reaching and movement re-education activities to improve shoulder mobility and movement efficiency during daily routines."
    ],
    reasoning:
      "Patient presents with limited shoulder ROM affecting functional reach, movement efficiency, and occupational performance."
  },

  shoulder_strength: {
    assessments: ["QuickDASH", "Manual Muscle Testing"],
    interventions: [
      "Provided progressive therapeutic strengthening targeting proximal shoulder musculature and scapular stabilizers to improve upper extremity performance.",
      "Facilitated graded reaching and lifting activities to improve shoulder stability, endurance, and motor control during functional tasks."
    ],
    reasoning:
      "Patient presents with decreased shoulder strength limiting functional reach and performance during daily tasks."
  },

  hand_weakness: {
    assessments: ["Grip Strength Testing", "Pinch Strength Testing"],
    interventions: [
      "Provided graded therapeutic exercise to improve gross grasp, intrinsic hand strength, and sustained hand endurance for functional hand use.",
      "Facilitated distal control and grasp stability activities to improve manipulation and sustained performance during ADL and IADL tasks."
    ],
    reasoning:
      "Patient presents with hand weakness affecting grasp, manipulation, and sustained performance during functional activities."
  },

  grip_pinch_weakness: {
    assessments: ["Grip Strength Testing", "Pinch Strength Testing"],
    interventions: [
      "Provided graded therapeutic exercise to improve grip strength, tip pinch, lateral pinch, and sustained grasp required for functional hand use.",
      "Facilitated resisted hand use and fine motor strengthening tasks to improve pinch control, distal stability, and manipulation skills."
    ],
    reasoning:
      "Patient presents with decreased grip and pinch strength affecting grasp, manipulation, and occupational task performance."
  },

  fine_motor_coordination: {
    assessments: ["9-Hole Peg Test", "Box and Block Test"],
    interventions: [
      "Facilitated fine motor coordination tasks targeting isolated digit control, bilateral integration, and graded pinch for improved manipulation.",
      "Implemented in-hand manipulation activities including translation, shift, and rotation to improve dexterity and task performance."
    ],
    reasoning:
      "Patient presents with impaired fine motor coordination affecting dexterity, motor planning, and task efficiency."
  },

  decreased_dexterity: {
    assessments: ["9-Hole Peg Test", "Handwriting assessment"],
    interventions: [
      "Provided dexterity training and in-hand manipulation activities to improve refined grasp control, finger isolation, and distal precision.",
      "Facilitated visual-motor and fine motor coordination activities to improve pacing, motor control, and task accuracy."
    ],
    reasoning:
      "Patient demonstrates decreased dexterity affecting fine motor control, grasp efficiency, and occupational performance."
  },

  pain: {
    assessments: ["Numeric Pain Rating Scale", "QuickDASH"],
    interventions: [
      "Provided pain management education and activity modification strategies to reduce symptom provocation during functional tasks.",
      "Facilitated graded therapeutic activity to improve movement tolerance, body mechanics, and participation despite pain limitations."
    ],
    reasoning:
      "Patient presents with pain limiting movement efficiency, activity tolerance, and occupational performance."
  },

  edema: {
    assessments: ["Edema measurement", "QuickDASH"],
    interventions: [
      "Provided edema management interventions including elevation, active movement, and compression education as clinically appropriate.",
      "Facilitated therapeutic hand and upper extremity activity to reduce stiffness and improve functional use during daily tasks."
    ],
    reasoning:
      "Patient presents with edema affecting mobility, functional hand use, and self-care task performance."
  },

  impaired_scar_mobility: {
    assessments: ["Scar assessment", "QuickDASH"],
    interventions: [
      "Provided scar management and desensitization techniques as indicated to improve tissue mobility and movement tolerance.",
      "Implemented therapeutic activity and movement-based intervention to improve function limited by scar adhesion or soft tissue restriction."
    ],
    reasoning:
      "Patient presents with impaired scar mobility affecting tissue extensibility, movement efficiency, and occupational performance."
  },

  tendon_gliding_limitation: {
    assessments: ["ROM assessment", "Grip Strength Testing"],
    interventions: [
      "Provided tendon gliding exercises and therapeutic hand activity to improve tendon excursion, digital ROM, and grasp efficiency.",
      "Facilitated graded hand function tasks to improve flexion-extension patterns, motor control, and functional grasp during ADL tasks."
    ],
    reasoning:
      "Patient presents with limited tendon excursion affecting grasp, release, and fine motor task performance."
  },

  reduced_activity_tolerance: {
    assessments: ["Activity tolerance assessment", "AM-PAC"],
    interventions: [
      "Provided graded functional endurance training to improve tolerance for sustained task completion during daily activities.",
      "Facilitated therapeutic activity emphasizing pacing, rest break planning, and workload modification to improve participation."
    ],
    reasoning:
      "Patient demonstrates reduced activity tolerance affecting endurance, task completion, and participation in daily routines."
  },

  wrist_elbow_rom: {
    assessments: ["ROM assessment", "QuickDASH"],
    interventions: [
      "Provided therapeutic exercise and ROM activity to improve wrist and elbow mobility required for sustained upper extremity positioning and functional use.",
      "Facilitated graded task simulation to improve movement efficiency, comfort, and tolerance during upper extremity functional tasks."
    ],
    reasoning:
      "Patient presents with limited wrist and elbow ROM affecting positioning, movement efficiency, and occupational performance."
  }
};

const taskLibrary = {
  classroom_transitions: {
    assessments: ["Classroom transition observation", "Teacher report", "Sensory profile review"],
    interventions: [
      "Practiced transitions using visual schedule, transition warnings, first-then language, and structured choices.",
      "Facilitated regulation and participation during transitions from preferred to non-preferred activities with graded support."
    ],
    shortGoalTemplate:
      "Child will transition between familiar activities with {assistLevel} using visual or sensory supports within 4 weeks.",
    longGoalTemplate:
      "Child will participate in classroom or daily transitions with improved regulation, predictability, and reduced adult support within 8 weeks.",
    reasoning:
      "Selected limitation affects transitions, classroom participation, regulation, and access to daily routines."
  },

  school_participation: {
    assessments: ["School participation observation", "Teacher interview", "Classroom routine analysis"],
    interventions: [
      "Facilitated classroom participation routines using visual supports, environmental modifications, movement breaks, and task chunking.",
      "Practiced school-readiness tasks targeting attention, motor participation, communication, and regulation within meaningful routines."
    ],
    shortGoalTemplate:
      "Child will participate in a structured school-based task with {assistLevel} using individualized supports within 4 weeks.",
    longGoalTemplate:
      "Child will demonstrate improved access to classroom routines with appropriate supports and increased participation within 8 weeks.",
    reasoning:
      "Selected limitation affects access to learning routines, classroom participation, and school-based therapy goals."
  },

  morning_routine: {
    assessments: ["Caregiver interview", "Morning routine analysis", "Self-care sequencing observation"],
    interventions: [
      "Provided caregiver coaching for morning routine supports including visual schedule, predictable sequencing, transition warnings, and sensory preparation.",
      "Practiced dressing or school-preparation routines using task breakdown, graded prompting, and regulation supports."
    ],
    shortGoalTemplate:
      "Child will complete one step of the morning routine with {assistLevel} using visual or caregiver supports within 4 weeks.",
    longGoalTemplate:
      "Child will participate in the morning routine with improved regulation, sequencing, and caregiver-supported independence within 8 weeks.",
    reasoning:
      "Selected limitation affects caregiver routines, self-care participation, transitions, and family quality of life."
  },

  self_care_routines: {
    assessments: ["Self-care task observation", "Caregiver interview", "Routine participation analysis"],
    interventions: [
      "Practiced dressing, hygiene, or grooming tasks using visual supports, task breakdown, and adaptive strategies.",
      "Provided caregiver education for prompting hierarchy, environmental setup, and strengths-based self-care participation."
    ],
    shortGoalTemplate:
      "Child will complete a targeted self-care step with {assistLevel} using individualized supports within 4 weeks.",
    longGoalTemplate:
      "Child will participate in age-appropriate self-care routines with improved sequencing, regulation, and independence within 8 weeks.",
    reasoning:
      "Selected limitation affects self-care development, daily routines, caregiver workload, and age-expected participation."
  },

  mealtime_participation: {
    assessments: ["Mealtime observation", "Caregiver interview", "Sensory preference review"],
    interventions: [
      "Supported mealtime participation through predictable routine, sensory-informed exposure, positioning, and caregiver coaching.",
      "Facilitated positive engagement with mealtime tasks while respecting sensory preferences and avoiding pressure-based language."
    ],
    shortGoalTemplate:
      "Child will participate in a targeted mealtime routine with {assistLevel} using sensory-informed supports within 4 weeks.",
    longGoalTemplate:
      "Child will demonstrate improved mealtime participation and caregiver-supported routine engagement within 8 weeks.",
    reasoning:
      "Selected limitation affects family routines, sensory regulation, feeding participation, and caregiver carryover."
  },

  play_participation: {
    assessments: ["Play observation", "Peer interaction observation", "Motor planning observation"],
    interventions: [
      "Facilitated child-led and therapist-guided play to support regulation, motor planning, communication, and peer participation.",
      "Used graded play challenges to support flexible problem solving, bilateral coordination, and social participation."
    ],
    shortGoalTemplate:
      "Child will engage in a targeted play routine with {assistLevel} using individualized supports within 4 weeks.",
    longGoalTemplate:
      "Child will demonstrate improved participation in play routines with increased regulation, flexibility, and functional engagement within 8 weeks.",
    reasoning:
      "Selected limitation affects play, social participation, motor planning, and meaningful childhood occupations."
  },

  peer_interaction: {
    assessments: ["Peer participation observation", "Play-based communication observation", "Teacher or caregiver report"],
    interventions: [
      "Supported peer interaction through structured play roles, visual supports, communication opportunities, and regulation strategies.",
      "Facilitated participation in shared activities with attention to access, choice-making, and child-centered communication."
    ],
    shortGoalTemplate:
      "Child will participate in a shared activity with {assistLevel} using communication or regulation supports within 4 weeks.",
    longGoalTemplate:
      "Child will demonstrate improved peer participation during structured routines with individualized supports within 8 weeks.",
    reasoning:
      "Selected limitation affects social participation, communication access, regulation, and classroom or play routines."
  },

  caregiver_carryover: {
    assessments: ["Caregiver interview", "Home routine review", "Strategy carryover check"],
    interventions: [
      "Provided caregiver coaching in visual supports, co-regulation strategies, sensory preparation, and task breakdown for home carryover.",
      "Collaborated with caregiver to identify realistic routine-based strategies that match the child's strengths and support needs."
    ],
    shortGoalTemplate:
      "Caregiver will implement one targeted home strategy with {assistLevel} coaching within 4 weeks.",
    longGoalTemplate:
      "Caregiver will report improved confidence using individualized supports during targeted daily routines within 8 weeks.",
    reasoning:
      "Selected limitation affects generalization of therapy strategies, caregiver confidence, and participation across environments."
  },

  ub_dressing: {
    assessments: ["COPM"],
    interventions: [
      "Implemented task-specific upper body dressing retraining using graded garment management practice and compensatory dressing strategies.",
      "Provided education in movement modification, positioning, and sequencing to improve independence with upper body dressing."
    ],
    shortGoalTemplate:
      "Patient will complete upper body dressing with {assistLevel} using improved movement quality and compensatory strategies within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete upper body dressing with improved efficiency, safety, and functional upper extremity use within 4 weeks.",
    reasoning:
      "Selected limitation affects upper body dressing performance and independence with self-care."
  },

  grooming: {
    assessments: ["COPM"],
    interventions: [
      "Implemented sink-level grooming simulation to improve tolerance for sustained upper extremity positioning and self-care performance.",
      "Facilitated task-specific grooming retraining emphasizing reach, motor control, and sequencing during self-care tasks."
    ],
    shortGoalTemplate:
      "Patient will complete grooming tasks with {assistLevel} using improved upper extremity function within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete grooming tasks with improved endurance, safety, and self-care efficiency within 4 weeks.",
    reasoning:
      "Selected limitation affects grooming performance and efficiency during daily self-care routines."
  },

  bathing: {
    assessments: ["COPM", "Barthel Index"],
    interventions: [
      "Implemented task-specific bathing simulation and ADL retraining to improve safety, endurance, and performance during bathing tasks.",
      "Provided education in pacing, compensatory techniques, and setup strategies to improve bathing independence."
    ],
    shortGoalTemplate:
      "Patient will complete bathing-related tasks with {assistLevel} using improved safety and functional performance within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete bathing tasks with improved safety, efficiency, and activity tolerance within 4 weeks.",
    reasoning:
      "Selected limitation affects bathing performance, safety, and independence with self-care."
  },

  toileting: {
    assessments: ["COPM", "Barthel Index"],
    interventions: [
      "Implemented task-specific toileting retraining emphasizing clothing management, sequencing, and functional task completion.",
      "Provided education in safety, setup, and compensatory strategies to improve independence with toileting routines."
    ],
    shortGoalTemplate:
      "Patient will complete toileting-related tasks with {assistLevel} using improved motor control and safety within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete toileting tasks with improved efficiency, safety, and self-care independence within 4 weeks.",
    reasoning:
      "Selected limitation affects toileting performance and independence during essential self-care routines."
  },

  feeding: {
    assessments: ["COPM"],
    interventions: [
      "Implemented task-specific feeding retraining emphasizing utensil grasp, hand-to-mouth coordination, and controlled task performance.",
      "Provided adaptive equipment and ergonomic education to improve independence and reduce compensatory strain during self-feeding."
    ],
    shortGoalTemplate:
      "Patient will complete self-feeding with {assistLevel} using improved grasp and coordination within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete self-feeding with improved control, efficiency, and endurance within 4 weeks.",
    reasoning:
      "Selected limitation affects self-feeding performance and independence with mealtime tasks."
  },

  home_management: {
    assessments: ["COPM", "AM-PAC"],
    interventions: [
      "Implemented simulation of home management tasks with pacing, workload modification, and graded task progression to improve IADL performance.",
      "Facilitated therapeutic activity targeting endurance, sequencing, and safe task completion during household routines."
    ],
    shortGoalTemplate:
      "Patient will complete home management tasks with {assistLevel} using improved endurance and task efficiency within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete light home management tasks with improved activity tolerance, safety, and pacing within 4 weeks.",
    reasoning:
      "Selected limitation affects household IADL participation, endurance, and task completion."
  },

  handwriting: {
    assessments: ["Handwriting assessment", "COPM"],
    interventions: [
      "Implemented task-specific handwriting retraining emphasizing grasp pattern, pressure grading, letter formation, spacing, and visual-motor control.",
      "Provided ergonomic and adaptive writing tool training, including grip modification and positioning strategies, to improve handwriting efficiency and reduce fatigue."
    ],
    shortGoalTemplate:
      "Patient will complete short handwriting tasks with {assistLevel} using improved motor control and grasp efficiency within 2 weeks.",
    longGoalTemplate:
      "Patient will independently complete handwriting tasks with improved legibility, endurance, and functional written communication within 4 weeks.",
    reasoning:
      "Selected limitation affects handwriting quality, endurance, and functional written communication."
  },

  computer_use: {
    assessments: ["COPM"],
    interventions: [
      "Implemented ergonomic education for workstation setup including keyboard, mouse, desk, and upper extremity positioning to reduce strain during computer tasks.",
      "Facilitated task simulation for typing and mouse use to improve endurance, movement efficiency, and symptom management during functional computer use."
    ],
    shortGoalTemplate:
      "Patient will complete computer-based tasks with {assistLevel} using improved positioning and tolerance within 2 weeks.",
    longGoalTemplate:
      "Patient will independently perform computer-based tasks with improved comfort, endurance, and upper extremity efficiency within 4 weeks.",
    reasoning:
      "Selected limitation affects sustained computer use required for daily, school, or work-related tasks."
  },

  opening_containers: {
    assessments: ["COPM"],
    interventions: [
      "Implemented simulation of container, jar, and packaging management tasks to improve functional hand use during meal preparation and home routines.",
      "Provided joint protection, ergonomic strategy, and adaptive device education to improve efficiency and reduce strain during container management."
    ],
    shortGoalTemplate:
      "Patient will open common containers with {assistLevel} using improved hand function and task strategy within 2 weeks.",
    longGoalTemplate:
      "Patient will independently manage containers and packaging required for daily routines within 4 weeks.",
    reasoning:
      "Selected limitation affects IADL performance involving container and package management."
  },

  buttoning_zippers: {
    assessments: ["COPM"],
    interventions: [
      "Provided task-specific dressing retraining using buttons, zippers, hooks, and fasteners to improve dressing independence.",
      "Educated patient in compensatory dressing strategies and adaptive fastener techniques as appropriate to support efficient garment management."
    ],
    shortGoalTemplate:
      "Patient will manage clothing fasteners with {assistLevel} using improved dexterity and coordination within 2 weeks.",
    longGoalTemplate:
      "Patient will independently manage buttons and zippers during dressing within 4 weeks.",
    reasoning:
      "Selected limitation affects fine motor dressing performance and garment management."
  },

  work_tasks: {
    assessments: ["COPM", "QuickDASH"],
    interventions: [
      "Implemented graded simulation of work-related tasks to improve tolerance, movement efficiency, and return-to-function performance.",
      "Provided ergonomic training, activity modification, and pacing education to support safe work-related task completion."
    ],
    shortGoalTemplate:
      "Patient will perform simulated work tasks with {assistLevel} using improved movement quality and tolerance within 2 weeks.",
    longGoalTemplate:
      "Patient will independently perform required work tasks with improved tolerance, body mechanics, and task efficiency within 4 weeks.",
    reasoning:
      "Selected limitation affects occupational participation in work-related activities."
  },

  reaching_overhead: {
    assessments: ["COPM"],
    interventions: [
      "Implemented graded overhead reaching tasks using functional objects to improve control, endurance, and upper extremity use during daily routines.",
      "Provided body mechanics and activity modification education to support safe overhead performance."
    ],
    shortGoalTemplate:
      "Patient will perform overhead reaching tasks with {assistLevel} using improved upper extremity function within 2 weeks.",
    longGoalTemplate:
      "Patient will independently perform overhead reaching required for daily routines with improved safety and movement efficiency within 4 weeks.",
    reasoning:
      "Selected limitation affects overhead functional reach required for daily task performance."
  }
};

const settingLibrary = {
  pediatric_outpatient: {
    assessmentsToAdd: ["Caregiver priorities review"],
    interventionPrefix: "Pediatric outpatient focus: ",
    reasoningAddition:
      " Pediatric therapy should emphasize participation, regulation, caregiver priorities, play, self-care, school readiness, and carryover across home and community routines."
  },
  school_based: {
    assessmentsToAdd: ["IEP goal review", "Classroom participation observation"],
    interventionPrefix: "School-based focus: ",
    reasoningAddition:
      " School-based therapy should emphasize educational access, classroom participation, accommodations, IEP-aligned goals, and collaboration with school teams."
  },
  autism_clinic: {
    assessmentsToAdd: ["Sensory profile review", "Caregiver priorities review"],
    interventionPrefix: "Autism/ADHD clinic focus: ",
    reasoningAddition:
      " Autism and ADHD-informed care should use neurodiversity-affirming language, respect regulation needs, and emphasize supports for access, communication, routines, and participation."
  },
  early_intervention: {
    assessmentsToAdd: ["Developmental milestone review", "Family routine interview"],
    interventionPrefix: "Early intervention focus: ",
    reasoningAddition:
      " Early intervention should emphasize family routines, caregiver coaching, developmental participation, play, communication, motor skills, and natural-environment carryover."
  },
  outpatient_orthopedics: {
    assessmentsToAdd: ["Home Exercise Program Review"],
    interventionPrefix: "Outpatient orthopedics focus: ",
    reasoningAddition:
      " Outpatient orthopedic intervention should emphasize restoration of ROM, strength, tissue mobility, pain management, ergonomic performance, and return to meaningful daily, school, work, and leisure tasks."
  },
  hand_therapy: {
    assessmentsToAdd: ["Grip/Pinch reassessment"],
    interventionPrefix: "Hand therapy focus: ",
    reasoningAddition:
      " Hand therapy intervention should emphasize dexterity, grasp patterns, tendon excursion, scar mobility, edema control, and restoration of functional hand use."
  },
  acute: {
    assessmentsToAdd: ["AM-PAC"],
    interventionPrefix: "Acute care focus: ",
    reasoningAddition:
      " Acute care intervention should prioritize safe participation in essential self-care, mobility, discharge planning, and immediate functional performance."
  }
};

function uniqueItems(items) {
  return [...new Set(items)];
}

function fillTemplate(template, assistLevel) {
  return template.replace("{assistLevel}", assistLevel);
}

export function getRecommendations(deficit, limitation, assistLevel, setting) {
  const deficitInfo = deficitLibrary[deficit] || null;
  const taskInfo = taskLibrary[limitation] || null;
  const settingInfo =
    settingLibrary[setting] || settingLibrary.pediatric_outpatient;

  if (!deficitInfo && !taskInfo) {
    return {
      assessments: uniqueItems([
        "Caregiver interview",
        "Participation observation",
        ...settingInfo.assessmentsToAdd
      ]),
      interventions: [
        `${settingInfo.interventionPrefix}Provided routine-based therapeutic activity to support participation in the selected home, school, or community task.`,
        `${settingInfo.interventionPrefix}Facilitated regulation, communication, motor, or executive functioning supports based on the child's observed needs.`,
        `${settingInfo.interventionPrefix}Provided caregiver or team education in environmental supports, prompting, and carryover strategies.`,
        `${settingInfo.interventionPrefix}Implemented graded functional practice to improve access, confidence, and participation in daily routines.`
      ],
      shortGoal: `Child will demonstrate improved participation in the selected routine with ${assistLevel} within 4 weeks.`,
      longGoal:
        "Child will demonstrate improved access, regulation, and participation in the selected daily routine within 8 weeks.",
      reasoning:
        "A generalized pediatric therapy plan was generated because no specific rule-based match was identified for the selected presentation." +
        settingInfo.reasoningAddition
    };
  }

  const assessments = uniqueItems([
    ...(deficitInfo?.assessments || []),
    ...(taskInfo?.assessments || []),
    ...settingInfo.assessmentsToAdd
  ]);

  const interventions = [
    ...(deficitInfo?.interventions || []),
    ...(taskInfo?.interventions || [])
  ].map((item) => `${settingInfo.interventionPrefix}${item}`);

  const shortGoal = taskInfo
    ? fillTemplate(taskInfo.shortGoalTemplate, assistLevel)
    : `Child will participate in the selected routine with ${assistLevel} and individualized supports within 4 weeks.`;

  const longGoal = taskInfo
    ? taskInfo.longGoalTemplate
    : "Child will demonstrate improved participation, regulation, and independence with the selected routine within 8 weeks.";

  const reasoning =
    `${deficitInfo?.reasoning || ""} ${taskInfo?.reasoning || ""}`.trim() +
    settingInfo.reasoningAddition;

  return {
    assessments,
    interventions,
    shortGoal,
    longGoal,
    reasoning
  };
}

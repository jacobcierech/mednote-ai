const deficitLibrary = {
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
    settingLibrary[setting] || settingLibrary.outpatient_orthopedics;

  if (!deficitInfo && !taskInfo) {
    return {
      assessments: uniqueItems([
        "COPM",
        "QuickDASH",
        ...settingInfo.assessmentsToAdd
      ]),
      interventions: [
        `${settingInfo.interventionPrefix}Provided task-specific ADL/IADL retraining to improve occupational performance in the selected activity.`,
        `${settingInfo.interventionPrefix}Facilitated therapeutic activity targeting the identified deficit and its impact on functional task completion.`,
        `${settingInfo.interventionPrefix}Provided education in compensatory strategies, body mechanics, and symptom management to improve safety and efficiency.`,
        `${settingInfo.interventionPrefix}Implemented graded functional practice to improve independence, movement quality, and carryover into daily routines.`
      ],
      shortGoal: `Patient will demonstrate improved occupational performance in the selected functional task with ${assistLevel} within 2 weeks.`,
      longGoal:
        "Patient will demonstrate increased independence, efficiency, and safety in the selected occupational task within 4 weeks.",
      reasoning:
        "A generalized orthopedic OT plan was generated because no specific rule-based match was identified for the selected presentation." +
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
    : `Patient will perform the selected task with ${assistLevel} and improved occupational performance within 2 weeks.`;

  const longGoal = taskInfo
    ? taskInfo.longGoalTemplate
    : "Patient will demonstrate improved independence and efficiency with the selected task within 4 weeks.";

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
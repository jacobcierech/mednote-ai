export function createEmptyCase() {
  return {
    patientInfo: {
      name: "",
      diagnosis: "",
      dominantSide: "",
      setting: "outpatient_orthopedics",
      precautions: "",
      postopStatus: ""
    },
    eval: {
      chiefComplaint: "",
      occupationalProfile: "",
      patientGoals: "",
      plof: "",
      clof: "",
      pain: "",
      rom: "",
      strength: "",
      standardizedAssessments: "",
      functionalDeficits: "",
      barriers: "",
      strengthsSummary: "",
      clinicalObservations: "",
      deficits: [],
      functionalLimitations: [],
      assessmentResults: []
    },
    planOfCare: {
      shortTermGoals: [],
      longTermGoals: [],
      interventions: [],
      frequency: "",
      duration: ""
    },
    visits: [],
    discharge: null
  };
}

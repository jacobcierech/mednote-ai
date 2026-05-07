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
      plof: "",
      clof: "",
      pain: "",
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
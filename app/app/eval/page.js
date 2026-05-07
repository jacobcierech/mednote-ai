"use client";

import { useState } from "react";
import { createEmptyCase } from "../../../lib/caseTemplates";

export default function EvalPage() {
  const [caseData, setCaseData] = useState(createEmptyCase());
  const [saved, setSaved] = useState(false);

  function updatePatientInfo(field, value) {
    setCaseData((prev) => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value
      }
    }));
    setSaved(false);
  }

  function updateEval(field, value) {
    setCaseData((prev) => ({
      ...prev,
      eval: {
        ...prev.eval,
        [field]: value
      }
    }));
    setSaved(false);
  }

  function handleDeficitsChange(value) {
    const deficits = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateEval("deficits", deficits);
  }

  function handleFunctionalLimitationsChange(value) {
    const functionalLimitations = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateEval("functionalLimitations", functionalLimitations);
  }

  function handleSave() {
    localStorage.setItem("mednote_active_case", JSON.stringify(caseData));
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold">Initial Evaluation</h1>
        <p className="mt-2 text-gray-600">
          Build the patient case that MedNote will use for planning and SOAP notes.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-lg border p-3"
            placeholder="Patient name"
            value={caseData.patientInfo.name}
            onChange={(e) => updatePatientInfo("name", e.target.value)}
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Diagnosis"
            value={caseData.patientInfo.diagnosis}
            onChange={(e) => updatePatientInfo("diagnosis", e.target.value)}
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Dominant side"
            value={caseData.patientInfo.dominantSide}
            onChange={(e) => updatePatientInfo("dominantSide", e.target.value)}
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Setting"
            value={caseData.patientInfo.setting}
            onChange={(e) => updatePatientInfo("setting", e.target.value)}
          />
          <input
            className="rounded-lg border p-3 md:col-span-2"
            placeholder="Precautions"
            value={caseData.patientInfo.precautions}
            onChange={(e) => updatePatientInfo("precautions", e.target.value)}
          />
          <input
            className="rounded-lg border p-3 md:col-span-2"
            placeholder="Post-op status"
            value={caseData.patientInfo.postopStatus}
            onChange={(e) => updatePatientInfo("postopStatus", e.target.value)}
          />

          <textarea
            className="rounded-lg border p-3 md:col-span-2"
            rows={3}
            placeholder="Chief complaint"
            value={caseData.eval.chiefComplaint}
            onChange={(e) => updateEval("chiefComplaint", e.target.value)}
          />
          <textarea
            className="rounded-lg border p-3 md:col-span-2"
            rows={4}
            placeholder="Occupational profile"
            value={caseData.eval.occupationalProfile}
            onChange={(e) => updateEval("occupationalProfile", e.target.value)}
          />
          <textarea
            className="rounded-lg border p-3"
            rows={3}
            placeholder="Prior level of function (PLOF)"
            value={caseData.eval.plof}
            onChange={(e) => updateEval("plof", e.target.value)}
          />
          <textarea
            className="rounded-lg border p-3"
            rows={3}
            placeholder="Current level of function (CLOF)"
            value={caseData.eval.clof}
            onChange={(e) => updateEval("clof", e.target.value)}
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Pain"
            value={caseData.eval.pain}
            onChange={(e) => updateEval("pain", e.target.value)}
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Deficits (comma separated)"
            onChange={(e) => handleDeficitsChange(e.target.value)}
          />
          <input
            className="rounded-lg border p-3 md:col-span-2"
            placeholder="Functional limitations (comma separated)"
            onChange={(e) => handleFunctionalLimitationsChange(e.target.value)}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Save Case
          </button>
          {saved && <span className="self-center text-green-600">Saved</span>}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { getRecommendations } from "../../lib/clinicalLogic";

export default function PlanBuilderPage() {
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [deficit, setDeficit] = useState("grip_pinch_weakness");
  const [limitation, setLimitation] = useState("handwriting");
  const [assistLevel, setAssistLevel] = useState("min assist");
  const [setting, setSetting] = useState("outpatient_orthopedics");

  function handleGenerate() {
    const recs = getRecommendations(deficit, limitation, assistLevel, setting);
    setResult(recs);
    setCopied(false);
  }

  async function handleCopy() {
    if (!result) return;

    const text = `
Plan Builder Recommendation

Deficit: ${deficit}
Functional Limitation: ${limitation}
Assist Level: ${assistLevel}
Setting: ${setting}

Suggested Assessments:
${result.assessments.map((item) => `- ${item}`).join("\n")}

Suggested Interventions:
${result.interventions.map((item) => `- ${item}`).join("\n")}

Goals:
- Short-term: ${result.shortGoal}
- Long-term: ${result.longGoal}

Clinical Reasoning:
${result.reasoning}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-bold tracking-tight">Plan Builder Beta</h1>
          <p className="mt-2 text-gray-600">
            Generate OT-focused assessments, interventions, goals, and clinical
            reasoning based on the patient presentation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Deficit
              </label>
              <select
                value={deficit}
                onChange={(e) => setDeficit(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="shoulder_rom">Shoulder ROM Limitation</option>
                <option value="shoulder_strength">Shoulder Weakness</option>
                <option value="wrist_elbow_rom">Wrist/Elbow ROM Limitation</option>
                <option value="hand_weakness">Hand Weakness</option>
                <option value="grip_pinch_weakness">Grip/Pinch Weakness</option>
                <option value="fine_motor_coordination">Fine Motor Coordination Deficit</option>
                <option value="decreased_dexterity">Decreased Dexterity</option>
                <option value="pain">Pain</option>
                <option value="edema">Edema</option>
                <option value="impaired_scar_mobility">Impaired Scar Mobility</option>
                <option value="tendon_gliding_limitation">Tendon Gliding Limitation</option>
                <option value="reduced_activity_tolerance">Reduced Activity Tolerance</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Functional Limitation
              </label>
              <select
                value={limitation}
                onChange={(e) => setLimitation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="ub_dressing">Upper Body Dressing</option>
                <option value="grooming">Grooming</option>
                <option value="bathing">Bathing</option>
                <option value="toileting">Toileting</option>
                <option value="feeding">Feeding</option>
                <option value="home_management">Home Management</option>
                <option value="handwriting">Handwriting</option>
                <option value="computer_use">Computer Use</option>
                <option value="opening_containers">Opening Containers</option>
                <option value="buttoning_zippers">Buttons/Zippers</option>
                <option value="work_tasks">Work Tasks</option>
                <option value="reaching_overhead">Reaching Overhead</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Assist Level
              </label>
              <select
                value={assistLevel}
                onChange={(e) => setAssistLevel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="max assist">Max Assist</option>
                <option value="mod assist">Mod Assist</option>
                <option value="min assist">Min Assist</option>
                <option value="supervision">Supervision</option>
                <option value="independent">Independent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Setting
              </label>
              <select
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="outpatient_orthopedics">Outpatient Orthopedics</option>
                <option value="hand_therapy">Hand Therapy</option>
                <option value="acute">Acute Care</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              className="rounded-lg bg-black px-5 py-3 text-white hover:opacity-90"
            >
              Generate Plan
            </button>

            {result && (
              <button
                onClick={handleCopy}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 hover:bg-gray-50"
              >
                {copied ? "Copied" : "Copy Plan"}
              </button>
            )}
          </div>

          {result && (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:col-span-1">
                <h2 className="text-lg font-semibold">Suggested Assessments</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-800">
                  {result.assessments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold">Suggested Interventions</h2>
                <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-800">
                  {result.interventions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:col-span-3">
                <h2 className="text-lg font-semibold">Goals</h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-gray-800">
                  <p>
                    <span className="font-semibold">Short-term:</span>{" "}
                    {result.shortGoal}
                  </p>
                  <p>
                    <span className="font-semibold">Long-term:</span>{" "}
                    {result.longGoal}
                  </p>
                </div>

                <h2 className="mt-6 text-lg font-semibold">Clinical Reasoning</h2>
                <p className="mt-3 text-sm leading-6 text-gray-800">
                  {result.reasoning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
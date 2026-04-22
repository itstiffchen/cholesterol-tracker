"use client";

import { useState } from "react";
import { CholesterolRecord } from "@/types/cholesterol";
import { generateNutritionPlan } from "@/lib/nutrition";

interface Props {
  records: CholesterolRecord[];
}

export default function NutritionPlan({ records }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);

  if (records.length === 0) {
    return (
      <p className="text-sm text-[#5a6288]">
        Add your first blood test result to get a personalized nutrition plan.
      </p>
    );
  }

  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
  const plan = generateNutritionPlan(latest);

  const mealIcons: Record<string, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snacks: "🥜",
  };

  const mealLabels: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snacks: "Snacks",
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <p className="text-sm leading-relaxed text-[#1a2744]">{plan.summary}</p>

      {/* Concerns */}
      {plan.concerns.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-amber-800">Areas to focus on:</p>
          <ul className="space-y-1 text-sm text-amber-700">
            {plan.concerns.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Based on latest results */}
      <div className="rounded-xl border border-[#e8e4ff]/90 bg-white/50 px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5a6288]">
          Based on your {latest.date} results
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-[#1a2744]">
          {latest.totalCholesterol !== null && (
            <span>Total: <strong>{latest.totalCholesterol}</strong></span>
          )}
          {latest.ldl !== null && (
            <span>LDL: <strong>{latest.ldl}</strong></span>
          )}
          {latest.hdl !== null && (
            <span>HDL: <strong>{latest.hdl}</strong></span>
          )}
          {latest.triglycerides !== null && (
            <span>Trig: <strong>{latest.triglycerides}</strong></span>
          )}
          {latest.nonHdl !== null && (
            <span>Non-HDL: <strong>{latest.nonHdl}</strong></span>
          )}
        </div>
      </div>

      {/* Weekly Meal Plan */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#3d5a9e]">7-Day Meal Plan</h3>

        {/* Day selector */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
          {plan.weeklyPlan.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(i)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedDay === i
                  ? "bg-[#3d5a9e] text-white"
                  : "bg-white/60 text-[#5a6288] hover:bg-white/80"
              }`}
            >
              {d.day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Meals for selected day */}
        <div className="space-y-3">
          {(["breakfast", "lunch", "dinner", "snacks"] as const).map((meal) => (
            <div
              key={meal}
              className="rounded-xl border border-[#e8e4ff]/90 bg-gradient-to-r from-[#faf8ff]/90 to-[#f0f7ff]/80 px-5 py-4"
            >
              <p className="mb-2 text-sm font-semibold text-[#3d5a9e]">
                {mealIcons[meal]} {mealLabels[meal]}
              </p>
              <ul className="space-y-1 text-sm text-[#1a2744]">
                {plan.weeklyPlan[selectedDay].meals[meal].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#3d5a9e]">Nutrition Tips for Your Levels</h3>
        <div className="space-y-2">
          {plan.tips.map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-[#e8e4ff]/60 bg-white/40 px-4 py-3 text-sm text-[#1a2744]"
            >
              <span className="shrink-0 text-[#6366f1]">💡</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#5a6288]">
        This meal plan is for general wellness guidance only. Always consult your doctor or a registered dietitian for personalized medical nutrition advice.
      </p>
    </div>
  );
}

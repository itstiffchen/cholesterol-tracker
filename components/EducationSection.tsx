"use client";

import { METRICS } from "@/lib/cholesterol-constants";

export default function EducationSection() {
  return (
    <div className="space-y-3">
      {METRICS.map((m) => (
        <details
          key={m.key}
          className="group rounded-xl border border-[#e8e4ff]/90 bg-gradient-to-r from-[#faf8ff]/90 to-[#f0f7ff]/80"
        >
          <summary className="flex cursor-pointer items-center gap-3 px-5 py-3 text-sm font-semibold text-[#3d5a9e]">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: m.color }}
            />
            {m.label}
            <span className="ml-auto text-[#a78bfa] transition group-open:rotate-90">▸</span>
          </summary>
          <div className="border-t border-[#e8e4ff]/60 px-5 py-3 text-sm leading-relaxed text-[#1a2744]">
            <p>{m.description}</p>
            <p className="mt-2 text-[#5a6288]">{m.details}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

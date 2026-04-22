"use client";

import { useState } from "react";
import { CholesterolRecord } from "@/types/cholesterol";

interface Props {
  onAdd: (record: CholesterolRecord) => void;
}

const empty = {
  date: "",
  totalCholesterol: "",
  ldl: "",
  hdl: "",
  triglycerides: "",
  nonHdl: "",
  notes: "",
};

export default function DataEntryForm({ onAdd }: Props) {
  const [form, setForm] = useState(empty);

  function set(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // auto-compute non-HDL when total and HDL are both present
      const total = field === "totalCholesterol" ? value : next.totalCholesterol;
      const hdl = field === "hdl" ? value : next.hdl;
      if (total && hdl && !next.nonHdl) {
        const computed = Number(total) - Number(hdl);
        if (computed > 0) next.nonHdl = String(computed);
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;

    const num = (v: string) => (v ? Number(v) : null);
    const record: CholesterolRecord = {
      id: crypto.randomUUID(),
      date: form.date,
      totalCholesterol: num(form.totalCholesterol),
      ldl: num(form.ldl),
      hdl: num(form.hdl),
      triglycerides: num(form.triglycerides),
      nonHdl: num(form.nonHdl),
      source: "manual",
      notes: form.notes || undefined,
    };
    onAdd(record);
    setForm(empty);
  }

  const inputClass =
    "w-full rounded-lg border border-[#e0e7ff] bg-white/80 px-3 py-2 text-sm text-[#1a2744] placeholder:text-[#a0aec0] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-3">
          <label className="mb-1 block text-sm font-medium text-[#3d5a9e]">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </div>
        {[
          { field: "totalCholesterol", label: "Total Cholesterol" },
          { field: "ldl", label: "LDL" },
          { field: "hdl", label: "HDL" },
          { field: "triglycerides", label: "Triglycerides" },
          { field: "nonHdl", label: "Non-HDL" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium text-[#3d5a9e]">{label}</label>
            <input
              type="number"
              min={0}
              max={1000}
              placeholder="mg/dL"
              value={form[field as keyof typeof form]}
              onChange={(e) => set(field, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3">
          <label className="mb-1 block text-sm font-medium text-[#3d5a9e]">Notes (optional)</label>
          <input
            type="text"
            placeholder="e.g. fasting, medication changes..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#60a5fa] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
      >
        Add Record
      </button>
    </form>
  );
}

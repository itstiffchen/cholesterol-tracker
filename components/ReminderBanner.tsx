"use client";

import { CholesterolRecord } from "@/types/cholesterol";

interface Props {
  records: CholesterolRecord[];
  dismissed: boolean;
  onDismiss: () => void;
}

export default function ReminderBanner({ records, dismissed, onDismiss }: Props) {
  if (dismissed || records.length === 0) return null;

  const latestDate = [...records]
    .sort((a, b) => b.date.localeCompare(a.date))[0].date;
  const last = new Date(latestDate);
  const now = new Date();
  const monthsSince = (now.getFullYear() - last.getFullYear()) * 12 + now.getMonth() - last.getMonth();

  if (monthsSince < 5) return null;

  const urgent = monthsSince >= 6;

  return (
    <div
      className={`mb-6 flex items-center justify-between rounded-xl border px-5 py-3 ${
        urgent
          ? "border-red-200 bg-red-50/80 text-red-800"
          : "border-amber-200 bg-amber-50/80 text-amber-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{urgent ? "🔴" : "🟡"}</span>
        <p className="text-sm font-medium">
          {urgent
            ? `It's been ${monthsSince} months since your last blood test. Time to schedule your cholesterol check!`
            : `Your next blood test is coming up. It's been ${monthsSince} months since your last test.`}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-3 shrink-0 text-xs opacity-60 transition hover:opacity-100"
        aria-label="Dismiss reminder"
      >
        ✕
      </button>
    </div>
  );
}

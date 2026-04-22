"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { CholesterolRecord } from "@/types/cholesterol";
import { METRICS } from "@/lib/cholesterol-constants";

interface Props {
  records: CholesterolRecord[];
}

export default function ChartSection({ records }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(METRICS.map((m) => [m.key, true])),
  );

  if (records.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[#e0e7ff] bg-white/40">
        <p className="text-sm text-[#5a6288]">Your cholesterol chart will appear here once you add records.</p>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const data = sorted.map((r) => ({
    date: r.date,
    "Total Cholesterol": r.totalCholesterol,
    "LDL": r.ldl,
    "HDL": r.hdl,
    "Triglycerides": r.triglycerides,
    "Non-HDL": r.nonHdl,
  }));

  function toggle(key: string) {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => toggle(m.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              visible[m.key]
                ? "border-transparent text-white"
                : "border-[#e0e7ff] bg-white/60 text-[#5a6288]"
            }`}
            style={visible[m.key] ? { backgroundColor: m.color } : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5a6288" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5a6288" }} domain={[0, "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #e0e7ff",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {/* Desirable range bands */}
          <ReferenceArea y1={0} y2={200} fill="#3d5a9e" fillOpacity={0.04} />
          <ReferenceArea y1={200} y2={240} fill="#f39c12" fillOpacity={0.04} />

          {METRICS.map((m) =>
            visible[m.key] ? (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 4, fill: m.color }}
                connectNulls
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

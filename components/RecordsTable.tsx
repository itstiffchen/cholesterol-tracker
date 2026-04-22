"use client";

import { CholesterolRecord } from "@/types/cholesterol";

interface Props {
  records: CholesterolRecord[];
  onDelete: (id: string) => void;
}

function val(v: number | null) {
  return v !== null ? v : "—";
}

export default function RecordsTable({ records, onDelete }: Props) {
  if (records.length === 0) {
    return <p className="text-sm text-[#5a6288]">No records yet. Add your first blood test result above.</p>;
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#e0e7ff] text-xs font-semibold uppercase tracking-wider text-[#5a6288]">
            <th className="py-2 pr-3">Date</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">LDL</th>
            <th className="px-3 py-2">HDL</th>
            <th className="px-3 py-2">Trig.</th>
            <th className="px-3 py-2">Non-HDL</th>
            <th className="px-3 py-2">Source</th>
            <th className="py-2 pl-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-b border-[#e8e4ff]/60 text-[#1a2744]">
              <td className="py-2 pr-3 font-medium">{r.date}</td>
              <td className="px-3 py-2">{val(r.totalCholesterol)}</td>
              <td className="px-3 py-2">{val(r.ldl)}</td>
              <td className="px-3 py-2">{val(r.hdl)}</td>
              <td className="px-3 py-2">{val(r.triglycerides)}</td>
              <td className="px-3 py-2">{val(r.nonHdl)}</td>
              <td className="px-3 py-2 capitalize text-[#5a6288]">{r.source}</td>
              <td className="py-2 pl-3">
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                  aria-label={`Delete record from ${r.date}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

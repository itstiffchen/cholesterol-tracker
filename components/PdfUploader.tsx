"use client";

import { useState, useRef } from "react";
import { CholesterolRecord } from "@/types/cholesterol";
import { parseQuestPdf } from "@/lib/parse-quest-pdf";

interface Props {
  onAdd: (record: CholesterolRecord) => void;
}

export default function PdfUploader({ onAdd }: Props) {
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<Partial<CholesterolRecord> | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setParsing(true);
    setPreview(null);
    setWarnings([]);

    try {
      const buffer = await file.arrayBuffer();
      const result = await parseQuestPdf(buffer);
      setPreview(result.record);
      setWarnings(result.warnings);
    } catch {
      setError("Failed to parse PDF. Please try manual entry.");
    } finally {
      setParsing(false);
    }
  }

  function confirm() {
    if (!preview) return;
    const record: CholesterolRecord = {
      id: crypto.randomUUID(),
      date: preview.date || new Date().toISOString().slice(0, 10),
      totalCholesterol: preview.totalCholesterol ?? null,
      ldl: preview.ldl ?? null,
      hdl: preview.hdl ?? null,
      triglycerides: preview.triglycerides ?? null,
      nonHdl: preview.nonHdl ?? null,
      source: "pdf",
    };
    onAdd(record);
    setPreview(null);
    setWarnings([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-[#6366f1] bg-[#6366f1]/10"
            : "border-[#e0e7ff] bg-white/40 hover:border-[#a78bfa]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <p className="text-sm font-medium text-[#3d5a9e]">
          {parsing ? "Parsing PDF..." : "Drop a Quest Diagnostics PDF here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-[#5a6288]">Optimized for Quest Diagnostics lipid panel results</p>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {preview && (
        <div className="mt-4 rounded-xl border border-[#e8e4ff] bg-white/60 p-4">
          <p className="mb-2 text-sm font-semibold text-[#3d5a9e]">Extracted Values (confirm before saving)</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-[#1a2744]">
            <span>Date: {preview.date || "Not found"}</span>
            <span>Total: {preview.totalCholesterol ?? "—"}</span>
            <span>LDL: {preview.ldl ?? "—"}</span>
            <span>HDL: {preview.hdl ?? "—"}</span>
            <span>Trig: {preview.triglycerides ?? "—"}</span>
            <span>Non-HDL: {preview.nonHdl ?? "—"}</span>
          </div>
          {warnings.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs text-amber-600">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={confirm}
              className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#60a5fa] px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Save Record
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setWarnings([]);
              }}
              className="rounded-lg border border-[#e0e7ff] px-4 py-1.5 text-sm text-[#5a6288] transition hover:bg-white/60"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

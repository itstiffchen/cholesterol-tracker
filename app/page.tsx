"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CholesterolRecord } from "@/types/cholesterol";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { decrypt } from "@/lib/crypto";
import SectionTitle from "@/components/SectionTitle";
import DataEntryForm from "@/components/DataEntryForm";
import PdfUploader from "@/components/PdfUploader";
import RecordsTable from "@/components/RecordsTable";
import ReminderBanner from "@/components/ReminderBanner";
import EducationSection from "@/components/EducationSection";
import ShareDialog from "@/components/ShareDialog";

const ChartSection = dynamic(() => import("@/components/ChartSection"), { ssr: false });

/** Check if the URL contains shared encrypted data */
function getSharedPayload(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  const prefix = "#shared=";
  if (hash.startsWith(prefix)) return hash.slice(prefix.length);
  return null;
}

/** Shared view: password prompt → decrypted chart */
function SharedView() {
  const [password, setPassword] = useState("");
  const [records, setRecords] = useState<CholesterolRecord[] | null>(null);
  const [error, setError] = useState("");
  const [decrypting, setDecrypting] = useState(false);

  async function handleDecrypt(e: React.FormEvent) {
    e.preventDefault();
    const payload = getSharedPayload();
    if (!payload || !password) return;
    setDecrypting(true);
    setError("");
    try {
      const json = await decrypt(payload, password);
      const data = JSON.parse(json) as CholesterolRecord[];
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setError("Invalid data format.");
      }
    } catch {
      setError("Incorrect password or corrupted link.");
    } finally {
      setDecrypting(false);
    }
  }

  return (
    <div className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[56rem] rounded-2xl border border-white/70 bg-white/65 px-8 py-10 shadow-[0_12px_48px_-16px_rgba(99,102,241,0.22),0_4px_24px_-8px_rgba(139,92,246,0.12)] backdrop-blur-md sm:px-10 sm:py-12">
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-normal tracking-tight">
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#3d5a9e] to-[#6b5b95] bg-clip-text text-transparent">
              Cholesterol Tracker
            </span>
          </h1>
          <p className="mt-2 text-[#5a6288]">
            Someone shared their cholesterol data with you.
          </p>
        </header>

        {!records ? (
          <form onSubmit={handleDecrypt} className="mx-auto max-w-sm">
            <label className="mb-1 block text-sm font-medium text-[#3d5a9e]">
              Enter the password to view the chart
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-3 w-full rounded-lg border border-[#e0e7ff] bg-white/80 px-3 py-2 text-sm text-[#1a2744] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
            />
            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={!password || decrypting}
              className="w-full rounded-lg bg-gradient-to-r from-[#6366f1] to-[#60a5fa] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {decrypting ? "Decrypting..." : "View Chart"}
            </button>
          </form>
        ) : (
          <>
            <hr className="site-rule" />
            <section className="mb-10">
              <SectionTitle>Trends</SectionTitle>
              <ChartSection records={records} />
            </section>

            <hr className="site-rule" />

            <section className="mb-10">
              <SectionTitle>History</SectionTitle>
              <RecordsTable records={records} onDelete={() => {}} />
            </section>

            <hr className="site-rule" />

            <section className="mb-6">
              <SectionTitle>Understanding Your Numbers</SectionTitle>
              <EducationSection />
            </section>
          </>
        )}

        <footer className="mt-14 border-t border-[#e0e7ff] pt-8 text-sm text-[#5a6288]">
          <p>
            Built by{" "}
            <a href="https://itstiffchen.github.io" className="site-link" target="_blank" rel="noreferrer">
              Tiffany Chen
            </a>
            . Shared data is read-only and not stored on any server.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  const [records, setRecords, hydrated] = useLocalStorage<CholesterolRecord[]>(
    "cholesterol-records",
    [],
  );
  const [dismissed, setDismissed] = useLocalStorage("cholesterol-reminder-dismissed", false);
  const [tab, setTab] = useState<"manual" | "pdf">("manual");
  const [showShare, setShowShare] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    if (getSharedPayload()) setIsSharedView(true);
  }, []);

  function addRecord(record: CholesterolRecord) {
    setRecords((prev) => [...prev, record]);
    setDismissed(false);
  }

  function deleteRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function exportData() {
    const json = JSON.stringify(records, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cholesterol-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as CholesterolRecord[];
        if (Array.isArray(data)) {
          setRecords((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            return [...prev, ...data.filter((r) => !ids.has(r.id))];
          });
        }
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#5a6288]">Loading...</p>
      </div>
    );
  }

  if (isSharedView) return <SharedView />;

  return (
    <div className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[56rem] rounded-2xl border border-white/70 bg-white/65 px-8 py-10 shadow-[0_12px_48px_-16px_rgba(99,102,241,0.22),0_4px_24px_-8px_rgba(139,92,246,0.12)] backdrop-blur-md sm:px-10 sm:py-12">
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-normal tracking-tight">
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#3d5a9e] to-[#6b5b95] bg-clip-text text-transparent">
              Cholesterol Tracker
            </span>
          </h1>
          <p className="mt-2 text-[#5a6288]">
            Track your lipid panel results over time. Upload Quest Diagnostics PDFs or enter values manually.
          </p>
        </header>

        <ReminderBanner
          records={records}
          dismissed={dismissed}
          onDismiss={() => setDismissed(true)}
        />

        <hr className="site-rule" />

        {/* Chart */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle>Trends</SectionTitle>
            {records.length > 0 && (
              <button
                onClick={() => setShowShare(true)}
                className="rounded-lg border border-[#e0e7ff] px-3 py-1.5 text-xs font-medium text-[#5a6288] transition hover:bg-white/60"
              >
                Share Chart
              </button>
            )}
          </div>
          <ChartSection records={records} />
        </section>

        <hr className="site-rule" />

        {/* Data Entry */}
        <section className="mb-10">
          <SectionTitle>Add Results</SectionTitle>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setTab("manual")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === "manual"
                  ? "bg-[#3d5a9e] text-white"
                  : "bg-white/60 text-[#5a6288] hover:bg-white/80"
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setTab("pdf")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === "pdf"
                  ? "bg-[#3d5a9e] text-white"
                  : "bg-white/60 text-[#5a6288] hover:bg-white/80"
              }`}
            >
              Upload PDF
            </button>
          </div>
          {tab === "manual" ? <DataEntryForm onAdd={addRecord} /> : <PdfUploader onAdd={addRecord} />}
        </section>

        <hr className="site-rule" />

        {/* Records */}
        <section className="mb-10">
          <SectionTitle>History</SectionTitle>
          <RecordsTable records={records} onDelete={deleteRecord} />
          {records.length > 0 && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={exportData}
                className="rounded-lg border border-[#e0e7ff] px-3 py-1.5 text-xs font-medium text-[#5a6288] transition hover:bg-white/60"
              >
                Export JSON
              </button>
              <label className="cursor-pointer rounded-lg border border-[#e0e7ff] px-3 py-1.5 text-xs font-medium text-[#5a6288] transition hover:bg-white/60">
                Import JSON
                <input type="file" accept=".json" className="hidden" onChange={importData} />
              </label>
            </div>
          )}
        </section>

        <hr className="site-rule" />

        {/* Education */}
        <section className="mb-6">
          <SectionTitle>Understanding Your Numbers</SectionTitle>
          <EducationSection />
        </section>

        <footer className="mt-14 border-t border-[#e0e7ff] pt-8 text-sm text-[#5a6288]">
          <p>
            Built by{" "}
            <a href="https://itstiffchen.github.io" className="site-link" target="_blank" rel="noreferrer">
              Tiffany Chen
            </a>
            . Data is stored locally in your browser.
          </p>
        </footer>
      </div>

      {showShare && <ShareDialog records={records} onClose={() => setShowShare(false)} />}
    </div>
  );
}

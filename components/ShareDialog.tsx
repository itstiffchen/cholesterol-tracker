"use client";

import { useState } from "react";
import { CholesterolRecord } from "@/types/cholesterol";
import { encrypt } from "@/lib/crypto";

interface Props {
  records: CholesterolRecord[];
  onClose: () => void;
}

export default function ShareDialog({ records, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function generate() {
    if (!password || password.length < 4) return;
    setGenerating(true);
    try {
      const data = JSON.stringify(records);
      const encrypted = await encrypt(data, password);
      const base = window.location.origin + window.location.pathname;
      setShareUrl(`${base}#shared=${encrypted}`);
    } catch {
      alert("Failed to generate share link.");
    } finally {
      setGenerating(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-md rounded-2xl border border-white/70 bg-white/95 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-1 text-lg font-semibold text-[#3d5a9e]">Share Your Chart</h3>
        <p className="mb-4 text-sm text-[#5a6288]">
          Create a password-protected link. Anyone with the link and password can view your chart.
        </p>

        {!shareUrl ? (
          <>
            <label className="mb-1 block text-sm font-medium text-[#3d5a9e]">
              Set a password (min 4 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              className="mb-4 w-full rounded-lg border border-[#e0e7ff] bg-white px-3 py-2 text-sm text-[#1a2744] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
            />
            <div className="flex gap-2">
              <button
                onClick={generate}
                disabled={password.length < 4 || generating}
                className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#60a5fa] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Link"}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-[#e0e7ff] px-5 py-2 text-sm text-[#5a6288] transition hover:bg-white/60"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 rounded-lg border border-[#e0e7ff] bg-[#faf8ff] p-3">
              <p className="break-all text-xs text-[#1a2744]">{shareUrl}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#60a5fa] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-[#e0e7ff] px-5 py-2 text-sm text-[#5a6288] transition hover:bg-white/60"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-xs text-[#5a6288]">
              Share this link along with the password you set. Your friend will be prompted to enter the password to view your chart.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

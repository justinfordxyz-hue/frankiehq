"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FormData {
  brandName: string;
  franchiseeName: string;
  locationId: string;
  locationAddress: string;
  fbcName: string;
  visitDate: string;
  reportType: string;
  safetyScore: number;
  safetyMax: number;
  productScore: number;
  productMax: number;
  serviceScore: number;
  serviceMax: number;
  imageScore: number;
  imageMax: number;
  criticalFindings: string;
  positiveFindings: string;
  previousVisitNotes: string;
  additionalContext: string;
}

const defaultForm: FormData = {
  brandName: "Paco Taco",
  franchiseeName: "",
  locationId: "",
  locationAddress: "",
  fbcName: "",
  visitDate: new Date().toISOString().split("T")[0],
  reportType: "Operations Assessment",
  safetyScore: "",
  safetyMax: 30,
  productScore: "",
  productMax: 25,
  serviceScore: "",
  serviceMax: 25,
  imageScore: "",
  imageMax: 20,
  criticalFindings: "",
  positiveFindings: "",
  previousVisitNotes: "",
  additionalContext: "",
};

function getTierInfo(pct: number) {
  if (pct < 70) return { tier: "CRITICAL", color: "#dc2626", bg: "#fef2f2" };
  if (pct < 85) return { tier: "DEVELOPING", color: "#d97706", bg: "#fffbeb" };
  if (pct < 92) return { tier: "GOOD", color: "#059669", bg: "#ecfdf5" };
  return { tier: "ELITE", color: "#0891b2", bg: "#ecfeff" };
}

export default function DemoPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalScore =
    form.safetyScore + form.productScore + form.serviceScore + form.imageScore;
  const totalMax =
    form.safetyMax + form.productMax + form.serviceMax + form.imageMax;
  const pct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const tierInfo = getTierInfo(pct);

  function update(field: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function generate() {
    setLoading(true);
    setError("");
    setLetter("");
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setLetter(data.letter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-white border border-[#0e0433]/10 text-[#0e0433] placeholder:text-[#0e0433]/30 focus:border-[#10c3be] focus:outline-none transition-colors";
  const labelClass = "block text-sm text-[#0e0433]/50 mb-1";

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#0e0433]/10 px-6 py-4 flex items-center justify-between bg-white/50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Frankie" width={100} height={40} />
          <span className="text-xs text-[#0e0433]/30 tracking-widest uppercase">
            Letter Generator
          </span>
        </Link>
        <span
          className="text-xs px-3 py-1 rounded-full border font-medium"
          style={{
            color: "#d97706",
            borderColor: "#d97706",
            background: "#fffbeb",
          }}
        >
          DEMO MODE
        </span>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Brand & Visit Info */}
          <section className="bg-white rounded-xl border border-[#0e0433]/10 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#10c3be] tracking-wider uppercase">
              Visit Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Brand</label>
                <input
                  className={inputClass}
                  value={form.brandName}
                  onChange={(e) => update("brandName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Report Type</label>
                <select
                  className={inputClass}
                  value={form.reportType}
                  onChange={(e) => update("reportType", e.target.value)}
                >
                  <option>Operations Assessment</option>
                  <option>Health &amp; Safety Visit</option>
                  <option>Window Readiness</option>
                  <option>Deficiency Report</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Franchisee Name</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Maria Rodriguez"
                  value={form.franchiseeName}
                  onChange={(e) => update("franchiseeName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Location ID</label>
                <input
                  className={inputClass}
                  placeholder="e.g. PT-4012"
                  value={form.locationId}
                  onChange={(e) => update("locationId", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location Address</label>
              <input
                className={inputClass}
                placeholder="e.g. 1450 S Pacific Coast Hwy, Redondo Beach, CA"
                value={form.locationAddress}
                onChange={(e) => update("locationAddress", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>FBC Name</label>
                <input
                  className={inputClass}
                  placeholder="e.g. JD Ford"
                  value={form.fbcName}
                  onChange={(e) => update("fbcName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Visit Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.visitDate}
                  onChange={(e) => update("visitDate", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Scoring */}
          <section className="bg-white rounded-xl border border-[#0e0433]/10 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#10c3be] tracking-wider uppercase">
                Assessment Scores
              </h2>
              <div
                className="text-sm font-bold px-3 py-1 rounded-lg"
                style={{
                  color: tierInfo.color,
                  background: tierInfo.bg,
                }}
              >
                {pct}% — {tierInfo.tier}
              </div>
            </div>

            {/* Score bar */}
            <div className="w-full h-2 rounded-full bg-[#0e0433]/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: tierInfo.color,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  ["Safety", "safetyScore", "safetyMax"],
                  ["Product Quality", "productScore", "productMax"],
                  ["Service", "serviceScore", "serviceMax"],
                  ["Image / Cleanliness", "imageScore", "imageMax"],
                ] as const
              ).map(([label, scoreKey, maxKey]) => (
                <div key={scoreKey} className="space-y-1">
                  <label className={labelClass}>
                    {label}{" "}
                    <span className="text-[#0e0433]/25">
                      (max {form[maxKey]})
                    </span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      max={form[maxKey]}
                      className={inputClass}
                      value={form[scoreKey] || ""}
                      onChange={(e) =>
                        update(
                          scoreKey,
                          Math.min(Number(e.target.value), form[maxKey])
                        )
                      }
                    />
                    <span className="text-xs text-[#0e0433]/25 whitespace-nowrap">
                      / {form[maxKey]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Findings */}
          <section className="bg-white rounded-xl border border-[#0e0433]/10 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#10c3be] tracking-wider uppercase">
              Findings &amp; Context
            </h2>
            <div>
              <label className={labelClass}>Critical Findings</label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="List any critical deficiencies, safety violations, or urgent issues..."
                value={form.criticalFindings}
                onChange={(e) => update("criticalFindings", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Positive Findings</label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="What's working well? Strong areas, improvements since last visit..."
                value={form.positiveFindings}
                onChange={(e) => update("positiveFindings", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                Previous Visit Notes{" "}
                <span className="text-[#0e0433]/25">(optional)</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[60px] resize-y`}
                placeholder="Context from prior visits — open action items, trends..."
                value={form.previousVisitNotes}
                onChange={(e) => update("previousVisitNotes", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                Additional Context{" "}
                <span className="text-[#0e0433]/25">(optional)</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[60px] resize-y`}
                placeholder="Anything else relevant — market conditions, ownership changes, staffing..."
                value={form.additionalContext}
                onChange={(e) => update("additionalContext", e.target.value)}
              />
            </div>
          </section>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={loading || !form.franchiseeName || !form.fbcName}
            className="w-full py-3 rounded-lg font-semibold text-white bg-[#10c3be] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Generating letter..." : "Generate Follow-Up Letter"}
          </button>
        </div>

        {/* Right: Output */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-[#0e0433]/10 p-6 min-h-[400px] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#10c3be] tracking-wider uppercase">
                Generated Letter
              </h2>
              {letter && (
                <button
                  onClick={() => navigator.clipboard.writeText(letter)}
                  className="text-xs text-[#0e0433]/40 hover:text-[#10c3be] transition-colors"
                >
                  Copy to clipboard
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-8 h-8 border-2 border-[#0e0433]/10 border-t-[#10c3be] rounded-full animate-spin" />
                <p className="text-sm text-[#0e0433]/30">
                  Frankie is writing your letter...
                </p>
              </div>
            )}

            {!loading && !letter && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[#0e0433]/30 text-sm">
                  Fill in the assessment details and click Generate.
                  <br />
                  Frankie will draft a complete follow-up letter.
                </p>
              </div>
            )}

            {letter && (
              <div className="max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-[#0e0433] font-[inherit] leading-relaxed">
                  {letter}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

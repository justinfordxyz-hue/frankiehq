"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Assessment {
  id: string;
  report_type: string;
  visit_date: string;
  percentage: number | null;
  tier: string | null;
  critical_findings: string | null;
  positive_findings: string | null;
}

interface Letter {
  id: string;
  letter_type: string;
  status: string;
  created_at: string;
  content: string;
}

interface FranchiseeDetail {
  id: string;
  name: string;
  dba_name: string | null;
  location_id: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  assessments: Assessment[];
  letters: Letter[];
}

function getTierStyle(tier: string | null) {
  switch (tier) {
    case "CRITICAL":
      return { color: "#dc2626", bg: "#fef2f2" };
    case "DEVELOPING":
      return { color: "#d97706", bg: "#fffbeb" };
    case "GOOD":
      return { color: "#059669", bg: "#ecfdf5" };
    case "ELITE":
      return { color: "#0891b2", bg: "#ecfeff" };
    default:
      return { color: "#9ca3af", bg: "#f9fafb" };
  }
}

export default function FranchiseeDetailPage() {
  const params = useParams();
  const [data, setData] = useState<FranchiseeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"assessments" | "letters">("assessments");
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/franchisee/${params.id}`)
        .then((r) => r.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#0e0433]/10 border-t-[#10c3be] rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#0e0433]/30">Franchisee not found.</p>
        <Link href="/dashboard" className="text-[#10c3be] text-sm mt-4 inline-block">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const latestAssessment = data.assessments[0];
  const tierStyle = getTierStyle(latestAssessment?.tier || null);

  return (
    <div className="p-8 max-w-5xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="text-sm text-[#0e0433]/40 hover:text-[#10c3be] transition-colors mb-6 inline-block"
      >
        ← Back to Portfolio
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-[#0e0433]/10 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0e0433]">{data.name}</h1>
            {data.dba_name && (
              <p className="text-sm text-[#0e0433]/40">DBA: {data.dba_name}</p>
            )}
            <div className="flex gap-6 mt-3 text-sm text-[#0e0433]/50">
              {data.location_id && <span>ID: {data.location_id}</span>}
              {data.city && data.state && (
                <span>
                  {data.address && `${data.address}, `}
                  {data.city}, {data.state} {data.zip}
                </span>
              )}
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
            </div>
          </div>
          <div className="text-right">
            {latestAssessment ? (
              <>
                <div
                  className="text-2xl font-bold"
                  style={{ color: tierStyle.color }}
                >
                  {latestAssessment.percentage}%
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded inline-block mt-1"
                  style={{ color: tierStyle.color, background: tierStyle.bg }}
                >
                  {latestAssessment.tier}
                </span>
                <div className="text-xs text-[#0e0433]/30 mt-2">
                  Last visit: {new Date(latestAssessment.visit_date).toLocaleDateString()}
                </div>
              </>
            ) : (
              <span className="text-sm text-[#0e0433]/30">No assessments yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(["assessments", "letters"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#10c3be] text-white"
                : "text-[#0e0433]/40 hover:text-[#0e0433] hover:bg-[#0e0433]/5"
            }`}
          >
            {tab === "assessments" ? `Assessments (${data.assessments.length})` : `Letters (${data.letters.length})`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "assessments" && (
        <div className="space-y-3">
          {data.assessments.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#0e0433]/10 p-8 text-center">
              <p className="text-[#0e0433]/30">No assessments recorded yet.</p>
            </div>
          ) : (
            data.assessments.map((a) => {
              const ts = getTierStyle(a.tier);
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[#0e0433]/10 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#0e0433]">
                        {a.report_type}
                      </span>
                      <span className="text-xs text-[#0e0433]/30 ml-3">
                        {new Date(a.visit_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color: ts.color }}>
                        {a.percentage}%
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded"
                        style={{ color: ts.color, background: ts.bg }}
                      >
                        {a.tier}
                      </span>
                    </div>
                  </div>
                  {(a.critical_findings || a.positive_findings) && (
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                      {a.critical_findings && (
                        <div>
                          <span className="font-semibold text-red-600">Critical:</span>
                          <span className="text-[#0e0433]/50 ml-1">{a.critical_findings}</span>
                        </div>
                      )}
                      {a.positive_findings && (
                        <div>
                          <span className="font-semibold text-green-600">Positive:</span>
                          <span className="text-[#0e0433]/50 ml-1">{a.positive_findings}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "letters" && (
        <div className="space-y-3">
          {data.letters.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#0e0433]/10 p-8 text-center">
              <p className="text-[#0e0433]/30">No letters generated yet.</p>
            </div>
          ) : (
            data.letters.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-xl border border-[#0e0433]/10 p-4 shadow-sm"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedLetter(expandedLetter === l.id ? null : l.id)
                  }
                >
                  <div>
                    <span className="text-sm font-medium text-[#0e0433]">
                      {l.letter_type === "fbr_followup" ? "FBR Follow-Up" : l.letter_type}
                    </span>
                    <span className="text-xs text-[#0e0433]/30 ml-3">
                      {new Date(l.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        l.status === "sent"
                          ? "text-green-700 bg-green-50"
                          : l.status === "approved"
                          ? "text-blue-700 bg-blue-50"
                          : "text-amber-700 bg-amber-50"
                      }`}
                    >
                      {l.status}
                    </span>
                    <span className="text-[#0e0433]/30 text-xs">
                      {expandedLetter === l.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
                {expandedLetter === l.id && (
                  <div className="mt-4 pt-4 border-t border-[#0e0433]/5">
                    <pre className="whitespace-pre-wrap text-sm text-[#0e0433]/70 font-[inherit] leading-relaxed">
                      {l.content}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(l.content)}
                      className="mt-3 text-xs text-[#10c3be] hover:underline"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

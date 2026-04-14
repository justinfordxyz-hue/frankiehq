"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Franchisee {
  id: string;
  name: string;
  dba_name: string | null;
  location_id: string | null;
  city: string | null;
  state: string | null;
  status: string;
  last_visit_date: string | null;
  last_score: number | null;
  last_tier: string | null;
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

function daysSince(dateStr: string | null): string {
  if (!dateStr) return "—";
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function DashboardPage() {
  const [franchisees, setFranchisees] = useState<Franchisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        setFranchisees(data.franchisees || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = franchisees.filter(
    (f) =>
      f.name.toLowerCase().includes(filter.toLowerCase()) ||
      (f.location_id && f.location_id.toLowerCase().includes(filter.toLowerCase())) ||
      (f.city && f.city.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0e0433]">Portfolio</h1>
          <p className="text-sm text-[#0e0433]/40 mt-1">
            {franchisees.length} franchisee{franchisees.length !== 1 ? "s" : ""} in your portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name, ID, or city..."
            className="px-4 py-2 rounded-lg border border-[#0e0433]/10 text-sm bg-white focus:border-[#10c3be] focus:outline-none w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0e0433]/10 border-t-[#10c3be] rounded-full animate-spin" />
        </div>
      ) : franchisees.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#0e0433]/30 text-lg mb-4">No franchisees in your portfolio yet.</p>
          <a
            href="/api/seed"
            className="inline-block px-4 py-2 bg-[#10c3be] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all"
          >
            Seed Demo Data (Paco Taco)
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#0e0433]/10 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0e0433]/10 bg-[#0e0433]/[0.02]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Franchisee
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Tier
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#0e0433]/40 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const tierStyle = getTierStyle(f.last_tier);
                return (
                  <tr
                    key={f.id}
                    className="border-b border-[#0e0433]/5 hover:bg-[#10c3be]/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/franchisee/${f.id}`}
                        className="font-medium text-[#0e0433] hover:text-[#10c3be] transition-colors"
                      >
                        {f.name}
                      </Link>
                      {f.dba_name && (
                        <div className="text-xs text-[#0e0433]/30">
                          DBA: {f.dba_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0e0433]/60">
                      <div>{f.location_id || "—"}</div>
                      <div className="text-xs text-[#0e0433]/30">
                        {f.city && f.state ? `${f.city}, ${f.state}` : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0e0433]/50">
                      {daysSince(f.last_visit_date)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#0e0433]">
                      {f.last_score !== null ? `${f.last_score}%` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {f.last_tier ? (
                        <span
                          className="text-xs font-bold px-2 py-1 rounded"
                          style={{
                            color: tierStyle.color,
                            background: tierStyle.bg,
                          }}
                        >
                          {f.last_tier}
                        </span>
                      ) : (
                        <span className="text-xs text-[#0e0433]/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          f.status === "active"
                            ? "text-green-700 bg-green-50"
                            : f.status === "probation"
                            ? "text-amber-700 bg-amber-50"
                            : "text-red-700 bg-red-50"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

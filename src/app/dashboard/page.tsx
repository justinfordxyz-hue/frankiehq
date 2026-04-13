import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0e0433]">
      <header className="border-b border-[#252636] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold text-[#10c3be]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FRANKIE
          </span>
          <span className="text-xs text-[#5a5848] tracking-widest uppercase">
            Dashboard
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h1
          className="text-3xl font-bold text-[#e2e0d8]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome to Frankie
        </h1>
        <p className="text-[#8a8878] max-w-md mx-auto">
          Your FBC dashboard is coming in S2. For now, head to the{" "}
          <a href="/demo" className="text-[#10c3be] hover:underline">
            letter generator demo
          </a>{" "}
          to see Frankie in action.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
          {[
            {
              label: "Letter Generator",
              status: "Live",
              color: "#3ecfa5",
              href: "/demo",
            },
            {
              label: "Portfolio View",
              status: "S2",
              color: "#d4920a",
              href: "#",
            },
            {
              label: "A/R Collections",
              status: "S3–S4",
              color: "#d4920a",
              href: "#",
            },
          ].map((mod) => (
            <a
              key={mod.label}
              href={mod.href}
              className="bg-[#12131a] border border-[#252636] rounded-xl p-5 text-left hover:border-[#10c3be] transition-colors"
            >
              <div className="text-sm font-semibold text-[#e2e0d8]">
                {mod.label}
              </div>
              <div
                className="text-xs mt-1 font-medium"
                style={{ color: mod.color }}
              >
                {mod.status}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[#0e0433]/10 px-6 py-4 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#10c3be]" style={{ fontFamily: "var(--font-display)" }}>
            FRANKIE
          </span>
          <span className="text-xs text-[#0e0433]/30 tracking-widest uppercase">Dashboard</span>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold text-[#0e0433]" style={{ fontFamily: "var(--font-display)" }}>
          Welcome to Frankie
        </h1>
        <p className="text-[#0e0433]/50 max-w-md mx-auto">
          Your FBC dashboard is coming in S2. For now, head to the{" "}
          <a href="/demo" className="text-[#10c3be] hover:underline">letter generator demo</a>{" "}
          to see Frankie in action.
        </p>
      </div>
    </main>
  );
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#0e0433]/10 flex flex-col">
        <div className="p-6 border-b border-[#0e0433]/10">
          <Link href="/dashboard">
            <Image src="/logo.svg" alt="Frankie" width={120} height={48} />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#0e0433]/70 hover:bg-[#10c3be]/10 hover:text-[#0e0433] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Portfolio
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#0e0433]/70 hover:bg-[#10c3be]/10 hover:text-[#0e0433] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Letter Generator
          </Link>
        </nav>
        <div className="p-4 border-t border-[#0e0433]/10">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-xs text-[#0e0433]/40">Account</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

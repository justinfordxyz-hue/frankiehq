import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" alt="Frankie" width={280} height={120} priority />
        </div>
        <p className="text-sm tracking-widest uppercase text-[#0e0433]/50">
          Your FBCs&apos; secret weapon.
        </p>
        <p className="text-[#0e0433]/40 text-base leading-relaxed max-w-lg mx-auto">
          The virtual FBC support platform that automates letters, A/R
          collections, and performance insights — so your field team can focus on
          coaching.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/demo"
            className="px-6 py-3 bg-[#10c3be] text-white font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Try the Demo
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-[#0e0433]/20 text-[#0e0433]/50 rounded-lg hover:border-[#10c3be] hover:text-[#10c3be] transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

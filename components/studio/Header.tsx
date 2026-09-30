import Link from "next/link";

export default function Header({ pill }: { pill: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090f]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-fuchsia-500 text-lg shadow-lg shadow-fuchsia-500/20">
            ✍️
          </div>
          <div>
            <p className="text-base font-extrabold leading-tight tracking-tight">BlogMaster</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Marketing · Storytelling · Escrita Avançada
            </p>
          </div>
        </Link>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 sm:block">
          {pill}
        </div>
      </div>
    </header>
  );
}

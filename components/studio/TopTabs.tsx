"use client";

import cls from "@/lib/cls";
import type { TabId } from "@/lib/types";

const TABS: { id: TabId; emoji: string; label: string }[] = [
  { id: "chat", emoji: "💬", label: "Processo guiado" },
  { id: "prompts", emoji: "✍️", label: "Etapa 4 · Prompts" },
  { id: "checklist", emoji: "✅", label: "5 Must-Haves" },
  { id: "rascunho", emoji: "📝", label: "Rascunho" },
];

export default function TopTabs({
  tab,
  onChange,
  promptsReady,
}: {
  tab: TabId;
  onChange: (t: TabId) => void;
  promptsReady: boolean;
}) {
  return (
    <div className="nice-scroll flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-current={active ? "page" : undefined}
            className={cls(
              "flex min-w-fit items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition",
              active
                ? "bg-gradient-to-r from-amber-400 to-fuchsia-500 font-bold text-slate-950 shadow-lg shadow-fuchsia-500/20"
                : "text-slate-300 hover:bg-white/[0.06]"
            )}
          >
            <span>{t.emoji}</span>
            <span className="whitespace-nowrap">{t.label}</span>
            {t.id === "prompts" && promptsReady && !active && (
              <span className="rounded-full bg-emerald-400/90 px-1.5 text-[10px] font-extrabold text-emerald-950">
                3
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

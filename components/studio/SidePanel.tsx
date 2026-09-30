"use client";

import { ETAPAS, STEPS, STEP_SHORT, answerLabel } from "@/lib/method";
import type { Answers } from "@/lib/types";
import cls from "@/lib/cls";

interface Props {
  answers: Answers;
  progress: number;
  onJump: (index: number) => void;
  onOpenPrompts: () => void;
  onOpenChecklist: () => void;
  onRestart: () => void;
}

const SPAN: Record<number, { start: number; end: number }> = {
  1: { start: 0, end: 2 },
  2: { start: 2, end: 3 },
  3: { start: 3, end: STEPS.length },
};

type Status = "done" | "current" | "next" | "ready" | "locked";

function statusFor(n: number, progress: number): Status {
  const span = SPAN[n];
  if (span) {
    if (progress >= span.end) return "done";
    if (progress >= span.start) return "current";
    return "next";
  }
  if (n === 4 || n === 5) return progress >= STEPS.length ? "ready" : "next";
  return "locked";
}

const BADGE: Record<Status, string> = {
  done: "✓ concluída",
  current: "em curso",
  ready: "abrir →",
  next: "aguarda o chat",
  locked: "fase final",
};

export default function SidePanel({
  answers,
  progress,
  onJump,
  onOpenPrompts,
  onOpenChecklist,
  onRestart,
}: Props) {
  const answered = STEPS.map((step, index) => ({ step, index })).filter(({ step }) => {
    const v = answers[step.id];
    return typeof v === "string" ? v.trim().length > 0 : v !== null;
  });

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Mapa do método
        </h2>
        <ol className="mt-3 space-y-1">
          {ETAPAS.map((e) => {
            const st = statusFor(e.n, progress);
            const clickable = st === "done" || st === "current" || st === "ready";
            return (
              <li key={e.n}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => {
                    if (e.n <= 3) onJump(SPAN[e.n].start);
                    else if (e.n === 4) onOpenPrompts();
                    else if (e.n === 5) onOpenChecklist();
                  }}
                  className={cls(
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition",
                    clickable ? "hover:bg-white/[0.05]" : "cursor-default",
                    st === "current" && "border border-amber-300/30 bg-amber-300/[0.06]"
                  )}
                >
                  <span
                    className={cls(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold",
                      st === "done" && "bg-emerald-400/90 text-emerald-950",
                      st === "current" && "bg-gradient-to-br from-amber-400 to-fuchsia-500 text-slate-950",
                      st === "ready" && "border border-emerald-300/60 text-emerald-300",
                      (st === "next" || st === "locked") && "border border-white/15 text-slate-500"
                    )}
                  >
                    {st === "done" ? "✓" : e.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cls(
                        "block truncate text-[13px] font-semibold",
                        st === "locked" || st === "next" ? "text-slate-500" : "text-slate-100"
                      )}
                    >
                      {e.titulo}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">{e.desc}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {BADGE[st]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Rumo atual
        </h2>
        {answered.length === 0 ? (
          <p className="mt-2 text-[13px] text-slate-500">
            Nenhuma decisão ainda — o chat define o rumo.
          </p>
        ) : (
          <ul className="mt-2.5 space-y-1.5">
            {answered.map(({ step, index }) => (
              <li
                key={step.id}
                className="flex items-center gap-2 rounded-xl bg-black/25 px-2.5 py-1.5"
              >
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {STEP_SHORT[step.id]}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-slate-200">
                  {answerLabel(step, answers)}
                </span>
                <button
                  type="button"
                  onClick={() => onJump(index)}
                  title={`Alterar ${STEP_SHORT[step.id].toLowerCase()}`}
                  className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs text-slate-400 transition hover:bg-white/10 hover:text-amber-300"
                >
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300"
      >
        ↺ Reiniciar o processo
      </button>
    </aside>
  );
}

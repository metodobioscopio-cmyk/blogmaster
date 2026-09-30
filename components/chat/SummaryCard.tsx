"use client";

import { STEPS, STEP_SHORT, answerLabel } from "@/lib/method";
import type { Answers } from "@/lib/types";

interface Props {
  answers: Answers;
  onOpenPrompts: () => void;
  onOpenChecklist: () => void;
  onRestart: () => void;
}

export default function SummaryCard({
  answers,
  onOpenPrompts,
  onOpenChecklist,
  onRestart,
}: Props) {
  return (
    <div className="animate-rise">
      <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-400/[0.12] via-fuchsia-500/[0.08] to-transparent p-4 sm:p-5">
        <p className="text-lg font-extrabold text-slate-50">Direcionamento concluído 🎯</p>
        <p className="mt-1 text-sm text-slate-300">
          Os 3 prompts da Etapa 4 foram configurados com as suas escolhas:
        </p>
        <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex items-baseline gap-2 rounded-lg bg-black/25 px-2.5 py-1.5"
            >
              <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {STEP_SHORT[step.id]}
              </dt>
              <dd className="truncate text-slate-100">{answerLabel(step, answers)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenPrompts}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
          >
            ✍️ Abrir Etapa 4 · Prompts
          </button>
          <button
            type="button"
            onClick={onOpenChecklist}
            className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/50"
          >
            ✅ Ver os 5 Must-Haves
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:text-slate-200"
          >
            ↺ Recomeçar
          </button>
        </div>
      </div>
    </div>
  );
}

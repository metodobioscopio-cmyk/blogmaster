"use client";

import { useEffect, useState } from "react";
import { MUST_HAVES } from "@/lib/musthaves";
import cls from "@/lib/cls";

const KEY = "blogmaster-checks-v1";

export default function MustHavesView({ onOpenPrompts }: { onOpenPrompts: () => void }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<number, boolean>);
    } catch {
      /* estado limpo */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(checked));
    } catch {
      /* sem storage */
    }
  }, [checked, ready]);

  const count = MUST_HAVES.filter((m) => checked[m.id]).length;
  const toggle = (id: number) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
          Etapa 5 · Revisão
        </p>
        <h1 className="text-2xl font-extrabold text-slate-50 sm:text-3xl">
          O checklist dos 5 Must-Haves
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
          Nenhum texto sai do rascunho sem passar por aqui. O Prompt 3 da Etapa 4 já usa este
          checklist como critério de revisão — aqui você faz a conferência final, card a card.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="h-2 w-44 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all"
              style={{ width: `${(count / MUST_HAVES.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-300">
            {count}/{MUST_HAVES.length} cumpridos
          </span>
          {count === MUST_HAVES.length && (
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
              Pronto para publicar 🎉
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MUST_HAVES.map((m) => {
          const on = Boolean(checked[m.id]);
          return (
            <article
              key={m.id}
              className={cls(
                "flex flex-col rounded-3xl border p-5 transition",
                on
                  ? "border-emerald-400/40 bg-emerald-400/[0.06]"
                  : "border-white/10 bg-white/[0.03]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                    Must-Have #{m.id}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-slate-50">
                    {m.emoji} {m.titulo}
                  </h3>
                </div>
                <span
                  className={cls(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold",
                    on
                      ? "border-emerald-300 bg-emerald-400 text-emerald-950"
                      : "border-white/15 bg-white/[0.04] text-transparent"
                  )}
                >
                  ✓
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{m.resumo}</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-[13px] text-slate-400">
                {m.checks.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-emerald-300/80">▪</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => toggle(m.id)}
                className={cls(
                  "mt-4 rounded-xl border px-3 py-2 text-xs font-bold transition",
                  on
                    ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-200"
                    : "border-white/15 bg-white/[0.05] text-slate-200 hover:border-emerald-300/50"
                )}
              >
                {on ? "Cumpri este must-have ✓" : "Marcar como cumprido"}
              </button>
            </article>
          );
        })}

        <div className="flex flex-col justify-center rounded-3xl border border-dashed border-white/15 p-5 text-sm text-slate-400">
          <p className="text-base font-extrabold text-slate-200">💡 Como usar</p>
          <p className="mt-2 leading-relaxed">
            Cole a versão final do texto no{" "}
            <button
              type="button"
              onClick={onOpenPrompts}
              className="font-semibold text-amber-300 underline-offset-2 hover:underline"
            >
              Prompt 3 da Etapa 4
            </button>{" "}
            e compare o resultado com cada card. Texto só publica com 5/5 — ou com justificativa
            consciente para cada pendência.
          </p>
        </div>
      </div>
    </div>
  );
}

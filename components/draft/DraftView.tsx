"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import CopyButton from "@/components/ui/CopyButton";
import cls from "@/lib/cls";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function DraftView({
  projectId,
  initialDraft,
}: {
  projectId: string;
  initialDraft: string;
}) {
  const [text, setText] = useState(initialDraft);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const onChange = (v: string) => {
    setText(v);
    setStatus("saving");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      api(`/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ draft: v }),
      })
        .then(() => setStatus("saved"))
        .catch(() => setStatus("error"));
    }, 700);
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-extrabold uppercase tracking-widest text-sky-300">
          Entre as Etapas 4 e 5
        </p>
        <h1 className="text-2xl font-extrabold text-slate-50 sm:text-3xl">Rascunho do projeto</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
          Cole aqui o resultado do <strong>Prompt 2</strong>, revise com o{" "}
          <strong>Prompt 3</strong> e guarde a versão final. O texto é salvo automaticamente na
          API enquanto você digita.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cls(
            "rounded-full border px-2.5 py-1 text-[11px] font-bold",
            status === "saving" && "border-amber-300/40 bg-amber-300/10 text-amber-200",
            status === "saved" && "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
            status === "error" && "border-rose-300/40 bg-rose-500/10 text-rose-200",
            status === "idle" && "border-white/10 bg-white/[0.04] text-slate-400"
          )}
        >
          {status === "saving" && "Salvando…"}
          {status === "saved" && "Salvo na API ✓"}
          {status === "error" && "Erro ao salvar — tente de novo"}
          {status === "idle" && (text ? "Tudo salvo" : "Autosave ativado")}
        </span>
        <span className="text-[11px] text-slate-500">
          {words.toLocaleString("pt-BR")} palavras · {text.length.toLocaleString("pt-BR")}{" "}
          caracteres
        </span>
        <div className="ml-auto">
          <CopyButton text={text} label="Copiar rascunho" />
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          "Cole aqui o rascunho gerado pelo Prompt 2…\n\nDica: depois de revisar com o Prompt 3, valide o resultado no checklist dos 5 Must-Haves."
        }
        className="nice-scroll min-h-[52vh] w-full resize-y rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-[15px] leading-relaxed text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
      />
    </div>
  );
}

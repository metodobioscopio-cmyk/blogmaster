"use client";

import type { Prompt } from "@/lib/types";
import CopyButton from "@/components/ui/CopyButton";

export default function PromptCard({ prompt, index }: { prompt: Prompt; index: number }) {
  return (
    <li className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
        <span className="rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-950">
          Prompt {index + 1}/3
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-slate-50">{prompt.titulo}</h3>
          <p className="text-xs text-slate-400">{prompt.objetivo}</p>
        </div>
        <CopyButton text={prompt.texto} />
      </div>
      <pre className="nice-scroll max-h-[420px] overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-[12.5px] leading-relaxed text-slate-200 sm:px-5">
        {prompt.texto}
      </pre>
      <div className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-500 sm:px-5">
        {prompt.texto.length.toLocaleString("pt-BR")} caracteres · cole no seu assistente de IA
        preferido
      </div>
    </li>
  );
}

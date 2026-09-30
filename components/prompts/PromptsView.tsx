"use client";

import { buildPrompts, LABELS } from "@/lib/prompts";
import { isComplete } from "@/lib/method";
import type { Answers } from "@/lib/types";
import CopyButton from "@/components/ui/CopyButton";
import PromptCard from "./PromptCard";

interface Props {
  answers: Answers;
  onOpenChat: () => void;
}

function contextChips(a: Answers) {
  return [
    { k: "Tema", v: a.tema.trim() || "definir no chat" },
    { k: "Missão", v: a.missao ? LABELS.missao[a.missao] : "definir no chat" },
    { k: "Formato", v: a.formato ? LABELS.formato[a.formato] : "definir no chat" },
    { k: "Tom", v: a.tom ? LABELS.tom[a.tom] : "definir no chat" },
    { k: "Canal", v: a.canal ? LABELS.canal[a.canal] : "definir no chat" },
    { k: "Âncoras", v: a.ancoras ? LABELS.ancoras[a.ancoras] : "definir no chat" },
  ];
}

export default function PromptsView({ answers, onOpenChat }: Props) {
  const prompts = buildPrompts(answers);
  const complete = isComplete(answers);
  const allText = prompts
    .map((p, i) => `PROMPT ${i + 1}/3 — ${p.titulo.toUpperCase()}\n\n${p.texto}`)
    .join("\n\n\n════════════════════\n\n\n");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
          Etapa 4 · Escrita
        </p>
        <h1 className="text-2xl font-extrabold text-slate-50 sm:text-3xl">
          Os 3 prompts de escrita, prontos para copiar
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
          Use em sequência: o <strong>Prompt 1</strong> desenha o esqueleto narrativo, o{" "}
          <strong>Prompt 2</strong> escreve o rascunho a partir dele e o <strong>Prompt 3</strong>{" "}
          revisa tudo com os 5 Must-Haves. Cada prompt já carrega o contexto definido no processo
          guiado.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {contextChips(answers).map((c) => (
            <span
              key={c.k}
              className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-slate-300"
            >
              <span className="font-bold text-slate-400">{c.k}:</span> {c.v}
            </span>
          ))}
        </div>
      </header>

      {!complete && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/[0.08] px-4 py-3">
          <p className="min-w-0 flex-1 text-sm text-amber-100">
            Estes prompts estão usando valores padrão. Complete o direcionamento no chat para
            personalizá-los com o seu tema, missão e canal.
          </p>
          <button
            type="button"
            onClick={onOpenChat}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
          >
            💬 Ir para o processo guiado
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={allText} label="Copiar os 3 prompts" />
        <span className="text-xs text-slate-500">
          Dica: cole no Claude, ChatGPT ou no assistente da sua preferência.
        </span>
      </div>

      <ol className="space-y-6">
        {prompts.map((p, i) => (
          <PromptCard key={p.id} prompt={p} index={i} />
        ))}
      </ol>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
        <strong className="text-slate-100">Próxima etapa:</strong> depois de gerar a versão final
        com o Prompt 3, valide o texto no checklist dos 5 Must-Haves (Etapa 5).
      </div>
    </div>
  );
}

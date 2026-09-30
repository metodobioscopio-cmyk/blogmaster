"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { STEPS, answerLabel } from "@/lib/method";
import type { Answers, ChipOption, DecisionStep, Step, TextStep } from "@/lib/types";
import SummaryCard from "./SummaryCard";
import TypingDots from "./TypingDots";

interface ChatFlowProps {
  answers: Answers;
  progress: number;
  typing: boolean;
  onPick: (step: DecisionStep, option: ChipOption) => void;
  onText: (step: TextStep, value: string) => void;
  onRestart: () => void;
  onOpenPrompts: () => void;
  onOpenChecklist: () => void;
}

function Avatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-fuchsia-500 text-sm shadow-lg shadow-fuchsia-500/20">
      ✍️
    </div>
  );
}

function AssistantBubble({ step, children }: { step: Step; children?: ReactNode }) {
  return (
    <div className="animate-rise flex items-start gap-3">
      <Avatar />
      <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3 sm:max-w-[78%]">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-300/90">
          Etapa {step.etapa} · {step.etapaLabel}
        </div>
        <p className="text-[15px] leading-relaxed text-slate-100">{step.question}</p>
        {step.sub && <p className="mt-1 text-[13px] text-slate-400">{step.sub}</p>}
        {children}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="animate-rise flex items-start gap-3">
      <Avatar />
      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
        <TypingDots />
      </div>
    </div>
  );
}

function UserBubble({ step, answers }: { step: Step; answers: Answers }) {
  return (
    <div className="animate-rise flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-amber-400/90 to-fuchsia-500/90 px-4 py-2.5 text-[15px] font-medium text-slate-950 sm:max-w-[70%]">
        {answerLabel(step, answers)}
      </div>
    </div>
  );
}

function TextAnswerForm({
  step,
  onText,
}: {
  step: TextStep;
  onText: (s: TextStep, v: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("answer") as HTMLInputElement | null;
        onText(step, input?.value ?? "");
      }}
      className="mt-3 flex flex-col gap-2 sm:flex-row"
    >
      <input
        name="answer"
        type="text"
        placeholder={step.placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
      />
      <div className="flex shrink-0 gap-2">
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={() => onText(step, "")}
          title="Usar a sugestão padrão"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-slate-400 transition hover:text-slate-200"
        >
          Pular
        </button>
      </div>
    </form>
  );
}

function IntroBubble() {
  return (
    <div className="animate-rise flex items-start gap-3">
      <Avatar />
      <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3 sm:max-w-[78%]">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-300/90">
          BlogMaster · Processo guiado
        </div>
        <p className="text-[15px] leading-relaxed text-slate-100">
          Olá! Eu sou o <strong>Maestro</strong>, seu copiloto de escrita avançada — marketing +
          storytelling. 🎼
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Vou conduzir você pelas <strong>Etapas 1 a 3</strong> com decisões rápidas de rumo. No
          fim, seus <strong>3 prompts da Etapa 4</strong> ficam prontos para copiar — e o
          checklist dos <strong>5 Must-Haves</strong> fecha a revisão na Etapa 5.
        </p>
      </div>
    </div>
  );
}

export default function ChatFlow({
  answers,
  progress,
  typing,
  onPick,
  onText,
  onRestart,
  onOpenPrompts,
  onOpenChecklist,
}: ChatFlowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [progress, typing]);

  const done = progress >= STEPS.length;
  const current = done ? null : STEPS[progress];

  return (
    <section className="flex h-[74vh] min-h-[560px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
      <div className="nice-scroll flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <IntroBubble />

        {STEPS.slice(0, progress).map((step) => (
          <div key={step.id} className="space-y-3">
            <AssistantBubble step={step} />
            <UserBubble step={step} answers={answers} />
          </div>
        ))}

        {current &&
          (typing ? (
            <TypingBubble />
          ) : current.kind === "decision" ? (
            <AssistantBubble step={current}>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {current.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onPick(current, opt)}
                    className="group rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:border-amber-300/60 hover:bg-amber-300/10"
                  >
                    <span className="block text-sm font-semibold text-slate-100">
                      {opt.emoji} {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400 transition group-hover:text-slate-300">
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>
            </AssistantBubble>
          ) : (
            <AssistantBubble step={current}>
              <TextAnswerForm step={current} onText={onText} />
            </AssistantBubble>
          ))}

        {done && (
          <SummaryCard
            answers={answers}
            onOpenPrompts={onOpenPrompts}
            onOpenChecklist={onOpenChecklist}
            onRestart={onRestart}
          />
        )}
        <div ref={endRef} />
      </div>
    </section>
  );
}

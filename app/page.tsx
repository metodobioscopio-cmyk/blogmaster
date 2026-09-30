"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/studio/Header";
import TopTabs from "@/components/studio/TopTabs";
import SidePanel from "@/components/studio/SidePanel";
import ChatFlow from "@/components/chat/ChatFlow";
import PromptsView from "@/components/prompts/PromptsView";
import MustHavesView from "@/components/checklist/MustHavesView";
import { DEFAULT_ANSWERS, STEPS } from "@/lib/method";
import type { Answers, ChipOption, DecisionStep, TabId, TextStep } from "@/lib/types";

const STORAGE_KEY = "blogmaster-studio-v1";

export default function Home() {
  const [tab, setTab] = useState<TabId>("chat");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [progress, setProgress] = useState(0);
  const [typing, setTyping] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const firstType = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          tab?: TabId;
          answers?: Partial<Answers>;
          progress?: number;
        };
        if (saved.answers) setAnswers({ ...DEFAULT_ANSWERS, ...saved.answers });
        if (typeof saved.progress === "number") {
          setProgress(Math.max(0, Math.min(saved.progress, STEPS.length)));
        }
        if (saved.tab === "chat" || saved.tab === "prompts" || saved.tab === "checklist") {
          setTab(saved.tab);
        }
      }
    } catch {
      /* estado limpo */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab, answers, progress }));
    } catch {
      /* sem storage */
    }
  }, [tab, answers, progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setTyping(true);
    const delay = firstType.current ? 900 : 600;
    firstType.current = false;
    const t = window.setTimeout(() => setTyping(false), delay);
    return () => window.clearTimeout(t);
  }, [progress, hydrated]);

  const handlePick = (step: DecisionStep, opt: ChipOption) => {
    setAnswers((a) => ({ ...a, [step.id]: opt.id }) as Answers);
    setProgress((p) => Math.min(p + 1, STEPS.length));
  };

  const handleText = (step: TextStep, value: string) => {
    const v = value.trim() || step.fallback;
    setAnswers((a) => ({ ...a, [step.id]: v }) as Answers);
    setProgress((p) => Math.min(p + 1, STEPS.length));
  };

  const jumpTo = (index: number) => {
    setTab("chat");
    setProgress(Math.max(0, Math.min(index, STEPS.length)));
  };

  const restart = () => {
    setAnswers(DEFAULT_ANSWERS);
    setProgress(0);
    setTab("chat");
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090f] text-slate-400">
        <p className="animate-pulse text-sm">Carregando o estúdio…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090f]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-fuchsia-500/15 via-amber-400/5 to-transparent"
      />
      <Header tab={tab} />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-6">
        <TopTabs tab={tab} onChange={setTab} promptsReady={progress >= STEPS.length} />
        <div className="mt-6">
          {tab === "chat" && (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
              <ChatFlow
                answers={answers}
                progress={progress}
                typing={typing}
                onPick={handlePick}
                onText={handleText}
                onRestart={restart}
                onOpenPrompts={() => setTab("prompts")}
                onOpenChecklist={() => setTab("checklist")}
              />
              <SidePanel
                answers={answers}
                progress={progress}
                onJump={jumpTo}
                onOpenPrompts={() => setTab("prompts")}
                onOpenChecklist={() => setTab("checklist")}
                onRestart={restart}
              />
            </div>
          )}
          {tab === "prompts" && (
            <PromptsView answers={answers} onOpenChat={() => setTab("chat")} />
          )}
          {tab === "checklist" && <MustHavesView onOpenPrompts={() => setTab("prompts")} />}
        </div>
        <footer className="mt-12 text-center text-xs text-slate-500">
          BlogMaster · Marketing, Storytelling e Escrita Avançada — do genérico ao inconfundível.
        </footer>
      </main>
    </div>
  );
}

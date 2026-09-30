"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/studio/Header";
import ToastHost from "@/components/ui/ToastHost";
import TopTabs from "@/components/studio/TopTabs";
import SidePanel from "@/components/studio/SidePanel";
import ChatFlow from "@/components/chat/ChatFlow";
import PromptsView from "@/components/prompts/PromptsView";
import MustHavesView from "@/components/checklist/MustHavesView";
import DraftView from "@/components/draft/DraftView";
import { DEFAULT_ANSWERS, STEPS, answeredCount } from "@/lib/method";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import type {
  Answers,
  ChipOption,
  DecisionStep,
  ProjectDTO,
  TabId,
  TextStep,
} from "@/lib/types";

const PILL: Record<TabId, string> = {
  chat: "Etapas 1–3 · Direcionamento",
  prompts: "Etapa 4 · Escrita",
  checklist: "Etapa 5 · Revisão",
  rascunho: "Rascunho · autosave",
};

function TitleEditor({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const t = draft.trim();
    setEditing(false);
    if (t && t !== value) onCommit(t);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        maxLength={120}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className="min-w-0 flex-1 rounded-lg border border-amber-300/50 bg-black/40 px-2 py-1 text-lg font-extrabold text-slate-50 outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Renomear projeto"
      className="group flex min-w-0 items-center gap-2 text-left"
    >
      <span className="truncate text-lg font-extrabold text-slate-50">{value}</span>
      <span className="text-sm opacity-0 transition group-hover:opacity-100">✏️</span>
    </button>
  );
}

export default function Workspace({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<TabId>("chat");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [title, setTitle] = useState("");
  const [editingAt, setEditingAt] = useState<number | null>(null);
  const [typing, setTyping] = useState(true);
  const firstType = useRef(true);
  const loadedAt = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    api<{ project: ProjectDTO }>(`/api/projects/${projectId}`)
      .then((d) => {
        if (!alive) return;
        setProject(d.project);
        setAnswers(d.project.answers);
        setChecklist(d.project.checklist);
        setTitle(d.project.title);
        loadedAt.current = Date.now();
      })
      .catch(() => {
        if (alive) setNotFound(true);
      });
    return () => {
      alive = false;
    };
  }, [projectId]);

  const patch = useCallback(
    async (body: Record<string, unknown>): Promise<ProjectDTO | null> => {
      try {
        const data = await api<{ project: ProjectDTO }>(`/api/projects/${projectId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setProject(data.project);
        return data.project;
      } catch (e) {
        toast(e instanceof Error ? e.message : "Falha ao salvar.", "err");
        return null;
      }
    },
    [projectId]
  );

  const derivedProgress = answeredCount(answers);
  const progress = editingAt !== null ? editingAt : derivedProgress;
  const loaded = project !== null;

  useEffect(() => {
    if (!loaded) return;
    if (loadedAt.current && Date.now() - loadedAt.current < 1200 && !firstType.current) {
      return;
    }
    setTyping(true);
    const delay = firstType.current ? 900 : 600;
    firstType.current = false;
    const t = window.setTimeout(() => setTyping(false), delay);
    return () => window.clearTimeout(t);
  }, [progress, loaded, editingAt]);

  const handlePick = (step: DecisionStep, opt: ChipOption) => {
    const prev = answers;
    const next = { ...answers, [step.id]: opt.id } as Answers;
    setAnswers(next);
    setEditingAt(null);
    void patch({ answers: next }).then((p) => {
      if (!p) setAnswers(prev);
    });
  };

  const handleText = (step: TextStep, value: string) => {
    const prev = answers;
    const v = value.trim() || step.fallback;
    const next = { ...answers, [step.id]: v } as Answers;
    setAnswers(next);
    setEditingAt(null);
    void patch({ answers: next }).then((p) => {
      if (!p) setAnswers(prev);
    });
  };

  const toggleCheck = (id: number) => {
    const prev = checklist;
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    void patch({ checklist: next }).then((p) => {
      if (!p) setChecklist(prev);
    });
  };

  const commitTitle = (t: string) => {
    const prev = title;
    setTitle(t);
    void patch({ title: t }).then((p) => {
      if (!p) setTitle(prev);
    });
  };

  const jumpTo = (index: number) => {
    setTab("chat");
    setEditingAt(Math.max(0, Math.min(index, STEPS.length)));
  };

  const restart = () => {
    const prev = answers;
    const cleared: Answers = { ...DEFAULT_ANSWERS };
    setAnswers(cleared);
    setEditingAt(0);
    setTab("chat");
    void patch({ answers: cleared }).then((p) => {
      if (!p) setAnswers(prev);
    });
  };

  const promptsReady = progress >= STEPS.length;

  const body = useMemo(() => {
    if (!project) return null;
    return (
      <>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-amber-300/40 hover:text-amber-200"
          >
            ← Projetos
          </Link>
          <TitleEditor value={title} onCommit={commitTitle} />
        </div>

        <div className="mt-4">
          <TopTabs tab={tab} onChange={setTab} promptsReady={promptsReady} />
        </div>

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
            <PromptsView projectId={projectId} answers={answers} onOpenChat={() => setTab("chat")} />
          )}
          {tab === "checklist" && (
            <MustHavesView checked={checklist} onToggle={toggleCheck} onOpenPrompts={() => setTab("prompts")} />
          )}
          {tab === "rascunho" && (
            <DraftView projectId={projectId} initialDraft={project.draft} />
          )}
        </div>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, tab, answers, progress, typing, checklist, title]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#07090f]">
        <Header pill="Projeto não encontrado" />
        <main className="mx-auto max-w-6xl px-4 pt-16 text-center">
          <p className="text-4xl">🕵️</p>
          <p className="mt-3 text-lg font-extrabold text-slate-100">
            Este projeto não existe (ou foi excluído).
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-slate-950"
          >
            ← Voltar aos projetos
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090f]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-fuchsia-500/15 via-amber-400/5 to-transparent"
      />
      <Header pill={PILL[tab]} />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-6">
        {!loaded ? (
          <div className="space-y-4">
            <div className="h-9 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
            <div className="h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
            <div className="h-[60vh] animate-pulse rounded-3xl bg-white/[0.04]" />
          </div>
        ) : (
          body
        )}
        <footer className="mt-12 text-center text-xs text-slate-500">
          BlogMaster · Marketing, Storytelling e Escrita Avançada — do genérico ao inconfundível.
        </footer>
      </main>
      <ToastHost />
    </div>
  );
}

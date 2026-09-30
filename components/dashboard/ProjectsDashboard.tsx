"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/studio/Header";
import ToastHost from "@/components/ui/ToastHost";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { LABELS } from "@/lib/prompts";
import { answeredCount } from "@/lib/method";
import cls from "@/lib/cls";
import type { ProjectDTO } from "@/lib/types";

function relTime(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "agora mesmo";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

function rumoChips(p: ProjectDTO): string[] {
  const chips: string[] = [];
  if (p.answers.missao) chips.push(LABELS.missao[p.answers.missao]);
  if (p.answers.formato) chips.push(LABELS.formato[p.answers.formato]);
  if (p.answers.canal) chips.push(LABELS.canal[p.answers.canal]);
  return chips;
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 3000);
    return () => window.clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (armed) onDelete();
        else setArmed(true);
      }}
      className={cls(
        "shrink-0 rounded-lg border px-2 py-1 text-[11px] font-bold transition",
        armed
          ? "border-rose-400 bg-rose-500/20 text-rose-200"
          : "border-white/10 text-slate-500 hover:border-rose-400/40 hover:text-rose-300"
      )}
      title="Excluir projeto"
    >
      {armed ? "Confirmar?" : "🗑"}
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
        />
      ))}
    </div>
  );
}

export default function ProjectsDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api<{ projects: ProjectDTO[] }>("/api/projects");
      setProjects(data.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar projetos.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || creating) return;
    setCreating(true);
    try {
      const data = await api<{ project: ProjectDTO }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: t }),
      });
      toast("Projeto criado! Defina o rumo no chat.");
      router.push(`/projeto/${data.project.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Falha ao criar projeto.", "err");
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((p) => (p ? p.filter((x) => x.id !== id) : p));
      toast("Projeto excluído.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Falha ao excluir.", "err");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-fuchsia-500/15 via-amber-400/5 to-transparent"
      />
      <Header pill="Seus projetos" />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
            Estúdio full-stack
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-50 sm:text-3xl">
            Seus projetos de conteúdo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Cada projeto guarda o direcionamento do chat, os 3 prompts da Etapa 4, o checklist dos
            5 Must-Haves e o rascunho — tudo persistido na API, para você retomar de onde parou.
          </p>
        </div>

        <form
          onSubmit={create}
          className="mt-6 flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
        >
          <label htmlFor="novo-titulo" className="text-sm font-bold text-slate-200 sm:shrink-0">
            Novo projeto:
          </label>
          <input
            id="novo-titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Artigo sobre precificação para criativos"
            maxLength={120}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
          />
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="shrink-0 rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {creating ? "Criando…" : "＋ Criar e abrir o chat"}
          </button>
        </form>

        {projects === null && !error && <SkeletonGrid />}

        {error && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3">
            <p className="text-sm text-rose-200">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-xl border border-rose-300/40 px-3 py-1.5 text-xs font-bold text-rose-200 hover:bg-rose-400/10"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {projects !== null && projects.length === 0 && !error && (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-4xl">🎬</p>
            <p className="mt-3 text-lg font-extrabold text-slate-100">
              Nenhum projeto ainda
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
              Crie o primeiro acima: o Maestro conduz o direcionamento no chat e libera os 3
              prompts da Etapa 4 prontos para copiar.
            </p>
          </div>
        )}

        {projects !== null && projects.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const done = answeredCount(p.answers);
              const checks = Object.values(p.checklist).filter(Boolean).length;
              const chips = rumoChips(p);
              return (
                <Link
                  key={p.id}
                  href={`/projeto/${p.id}`}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-300/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-[15px] font-extrabold text-slate-50 group-hover:text-amber-200">
                      {p.title}
                    </h3>
                    <DeleteButton onDelete={() => void remove(p.id)} />
                  </div>
                  {chips.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[12px] text-slate-500">Rumo ainda indefinido</p>
                  )}
                  <div className="mt-3 flex-1" />
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Direcionamento</span>
                        <span className="font-bold text-slate-300">{done}/7</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 transition-all"
                          style={{ width: `${(done / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        ✅ {checks}/5 must-haves · 📝{" "}
                        {p.draft.trim() ? "rascunho iniciado" : "sem rascunho"}
                      </span>
                      <span>{relTime(p.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <ToastHost />
    </div>
  );
}

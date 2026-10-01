import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_ANSWERS } from "./method";
import type { Answers, ProjectDTO } from "./types";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  answers_json TEXT NOT NULL DEFAULT '{}',
  checklist_json TEXT NOT NULL DEFAULT '{}',
  draft TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
`;

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "blogmaster.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA);
  dbInstance = db;
  return db;
}

interface ProjectRow {
  id: string;
  title: string;
  answers_json: string;
  checklist_json: string;
  draft: string;
  created_at: string;
  updated_at: string;
}

function rowToDto(row: ProjectRow): ProjectDTO {
  let answers: Answers = { ...DEFAULT_ANSWERS };
  const checklist: Record<number, boolean> = {};
  try {
    answers = { ...DEFAULT_ANSWERS, ...(JSON.parse(row.answers_json) as Partial<Answers>) };
  } catch {
    /* defaults */
  }
  try {
    const raw = JSON.parse(row.checklist_json) as Record<string, boolean>;
    for (const [k, v] of Object.entries(raw)) {
      const n = Number(k);
      if (Number.isInteger(n) && n >= 1 && n <= 5) checklist[n] = Boolean(v);
    }
  } catch {
    /* vazio */
  }
  return {
    id: row.id,
    title: row.title,
    answers,
    checklist,
    draft: row.draft,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listProjects(): ProjectDTO[] {
  const rows = getDb()
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as unknown as ProjectRow[];
  return rows.map(rowToDto);
}

export function getProject(id: string): ProjectDTO | null {
  const row = getDb()
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id) as ProjectRow | undefined;
  return row ? rowToDto(row) : null;
}

export function createProject(title: string): ProjectDTO {
  const id = randomUUID();
  getDb()
    .prepare("INSERT INTO projects (id, title, answers_json) VALUES (?, ?, ?)")
    .run(id, title, JSON.stringify(DEFAULT_ANSWERS));
  return getProject(id)!;
}

export interface ProjectPatch {
  title?: string;
  answers?: Partial<Answers>;
  checklist?: Record<string, boolean>;
  draft?: string;
}

export function updateProject(id: string, patch: ProjectPatch): ProjectDTO | null {
  const existing = getProject(id);
  if (!existing) return null;

  const next = {
    title: patch.title ?? existing.title,
    answers: patch.answers ? { ...existing.answers, ...patch.answers } : existing.answers,
    checklist: { ...existing.checklist },
    draft: patch.draft ?? existing.draft,
  };

  if (patch.checklist) {
    for (const [k, v] of Object.entries(patch.checklist)) {
      const n = Number(k);
      if (Number.isInteger(n) && n >= 1 && n <= 5) next.checklist[n] = Boolean(v);
    }
  }

  getDb()
    .prepare(
      `UPDATE projects
       SET title = ?, answers_json = ?, checklist_json = ?, draft = ?,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`
    )
    .run(
      next.title,
      JSON.stringify(next.answers),
      JSON.stringify(next.checklist),
      next.draft,
      id
    );
  return getProject(id);
}

export function deleteProject(id: string): boolean {
  const res = getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  return Number(res.changes) > 0;
}

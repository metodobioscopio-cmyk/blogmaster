import { z } from "zod";

const mission = z.enum(["vender", "educar", "inspirar", "autoridade"]);
const format = z.enum(["opiniao", "guia", "estudo", "narrativa"]);
const tone = z.enum(["provocativo", "conversacional", "tecnico", "inspirador"]);
const channel = z.enum(["blog", "linkedin", "newsletter", "instagram"]);
const anchor = z.enum(["fortes", "parciais", "nenhuma"]);

export const AnswersPatchSchema = z.object({
  tema: z.string().max(600).optional(),
  missao: mission.nullable().optional(),
  formato: format.nullable().optional(),
  tom: tone.nullable().optional(),
  promessa: z.string().max(600).optional(),
  canal: channel.nullable().optional(),
  ancoras: anchor.nullable().optional(),
});

export const CreateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
});

export const PatchProjectSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    answers: AnswersPatchSchema.optional(),
    checklist: z.record(z.string(), z.boolean()).optional(),
    draft: z.string().max(200_000).optional(),
  })
  .refine(
    (v) =>
      v.title !== undefined ||
      v.answers !== undefined ||
      v.checklist !== undefined ||
      v.draft !== undefined,
    { message: "PATCH vazio." }
  );

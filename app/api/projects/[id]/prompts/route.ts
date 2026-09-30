import { NextResponse } from "next/server";
import { getProject } from "@/lib/db";
import { buildPrompts } from "@/lib/prompts";

type Ctx = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const project = getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ prompts: buildPrompts(project.answers), source: "server" });
}

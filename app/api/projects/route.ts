import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/db";
import { CreateProjectSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ projects: listProjects() });
  } catch {
    return NextResponse.json({ error: "Falha ao listar projetos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informe um título de 1 a 120 caracteres." },
      { status: 400 }
    );
  }
  try {
    const project = createProject(parsed.data.title);
    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Falha ao criar o projeto." }, { status: 500 });
  }
}

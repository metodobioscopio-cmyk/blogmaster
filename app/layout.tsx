import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlogMaster — Marketing, Storytelling e Escrita Avançada",
  description:
    "Processo de escrita guiado em formato de chat: abas decisórias de rumo, 3 prompts da Etapa 4 prontos para copiar e o checklist dos 5 Must-Haves em cards.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#07090f] font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

"use client";

import { useState } from "react";
import cls from "@/lib/cls";

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* tenta fallback */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function CopyButton({
  text,
  label = "Copiar",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await writeClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cls(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
        copied
          ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
          : "border-white/15 bg-white/[0.06] text-slate-200 hover:border-amber-300/50 hover:bg-amber-300/10",
        className
      )}
    >
      {copied ? "✓ Copiado!" : `📋 ${label}`}
    </button>
  );
}

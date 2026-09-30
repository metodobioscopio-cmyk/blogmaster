"use client";

import { useEffect, useState } from "react";
import { onToast } from "@/lib/toast";
import type { ToastItem } from "@/lib/toast";
import cls from "@/lib/cls";

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(
    () =>
      onToast((t) => {
        setItems((prev) => [...prev, t]);
        window.setTimeout(
          () => setItems((prev) => prev.filter((i) => i.id !== t.id)),
          3200
        );
      }),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className={cls(
            "animate-rise pointer-events-auto rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur",
            t.kind === "ok"
              ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
              : "border-rose-300/40 bg-rose-500/15 text-rose-200"
          )}
        >
          {t.kind === "ok" ? "✓ " : "⚠️ "}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

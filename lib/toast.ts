export type ToastKind = "ok" | "err";

export interface ToastItem {
  id: number;
  msg: string;
  kind: ToastKind;
}

type Listener = (t: ToastItem) => void;

const listeners = new Set<Listener>();
let seq = 1;

export function toast(msg: string, kind: ToastKind = "ok"): void {
  const item: ToastItem = { id: seq++, msg, kind };
  listeners.forEach((l) => l(item));
}

export function onToast(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

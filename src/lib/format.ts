export function money(n: number, currency = 'USD', locale = 'pt-BR'): string {
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: Math.abs(n) < 10 ? 2 : 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function num(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(n);
}

export function pct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(n)}%`;
}

export function compact(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} d`;
}

export function hoursSince(iso?: string): number {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

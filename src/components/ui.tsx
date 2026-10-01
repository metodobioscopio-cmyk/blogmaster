import { useCallback, useEffect, useState } from 'react';

export function Card({
  title,
  hint,
  children,
  right,
  className = '',
}: {
  title?: string;
  hint?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {(title || right) && (
        <div className="card__head">
          <div style={{ flex: 1 }}>
            {title && <div className="card__title">{title}</div>}
            {hint && <div className="card__hint">{hint}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ k, v, note, tone }: { k: string; v: React.ReactNode; note?: string; tone?: 'ok' | 'warn' | 'bad' }) {
  const color = tone === 'ok' ? 'var(--accent)' : tone === 'warn' ? 'var(--warn)' : tone === 'bad' ? 'var(--danger)' : undefined;
  return (
    <div className="stat">
      <div className="stat__k">{k}</div>
      <div className="stat__v" style={color ? { color } : undefined}>
        {v}
      </div>
      {note && <div className="stat__n">{note}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="tiny muted">{hint}</span>}
    </div>
  );
}

export function Num({
  label,
  value,
  onChange,
  step = 1,
  min,
  hint,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  hint?: string;
  suffix?: string;
}) {
  return (
    <Field label={suffix ? `${label} (${suffix})` : label} hint={hint}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    </Field>
  );
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
  area,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  hint?: string;
  area?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      {area ? (
        <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Check({
  label,
  checked,
  onChange,
  hint,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (b: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint && <div className="tiny muted">{hint}</div>}
      </span>
    </label>
  );
}

export function Badge({
  children,
  tone = 'ghost',
}: {
  children: React.ReactNode;
  tone?: 'ok' | 'warn' | 'bad' | 'info' | 'violet' | 'ghost';
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Bar({ value, tone }: { value: number; tone?: 'warn' | 'bad' }) {
  return (
    <div className={`bar ${tone ? `bar--${tone}` : ''}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'bad' | 'ok';
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`callout ${tone !== 'info' ? `callout--${tone}` : ''}`}>
      {title && <div className="callout__t">{title}</div>}
      {children}
    </div>
  );
}

export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setDone(true);
  }, [text]);
  return (
    <button className="btn btn--sm" onClick={copy} type="button">
      {done ? 'Copiado ✓' : label}
    </button>
  );
}

export function Source({ source, url }: { source: string; url?: string }) {
  return (
    <div className="tiny muted">
      Fonte:{' '}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer noopener">
          {source}
        </a>
      ) : (
        source
      )}
    </div>
  );
}

let toastTimer: number | undefined;
export function toast(msg: string) {
  const el = document.getElementById('toast-root');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.style.display = 'none';
  }, 3200);
}

export function ToastRoot() {
  return <div className="toast" id="toast-root" style={{ display: 'none' }} />;
}

export function Verdict({ v }: { v: string }) {
  const map: Record<string, { tone: 'ok' | 'warn' | 'bad' | 'info'; label: string }> = {
    scale: { tone: 'ok', label: 'SCALE' },
    iterate: { tone: 'warn', label: 'ITERATE' },
    kill: { tone: 'bad', label: 'KILL' },
    indefinido: { tone: 'info', label: 'COLETE MAIS DADO' },
  };
  const m = map[v] ?? { tone: 'info' as const, label: v.toUpperCase() };
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <Card title={title}>
      <p className="dim">{children}</p>
    </Card>
  );
}

import { Badge, Bar, Callout, Card, Stat } from '../components/ui';
import { DAY_BLOCKS, FINAL_CHECKLIST, STEPS } from '../lib/steps';
import { useStore } from '../state/store';

const LETTER_ROUTE: Record<string, string> = {
  V: 'demand',
  A: 'audit',
  L: 'angle',
  I: 'tracking',
  D: 'decide',
};

export default function Plan14() {
  const { state, dispatch } = useStore();
  const total = STEPS.length;
  const done = STEPS.filter((s) => state.tasks[`step-${s.id}`]).length;
  const checklistDone = FINAL_CHECKLIST.filter((c) => state.tasks[c.id]).length;

  return (
    <>
      <p className="lead">
        Os 19 passos do método em sequência de execução, com a ação, o porquê, o exemplo e a armadilha de cada um. Marque
        conforme executa — o progresso alimenta o score do console.
      </p>

      <div className="grid g4">
        <Stat k="Passos concluídos" v={`${done}/${total}`} note={`${Math.round((done / total) * 100)}%`} />
        <Stat k="Checklist final" v={`${checklistDone}/${FINAL_CHECKLIST.length}`} tone={checklistDone === FINAL_CHECKLIST.length ? 'ok' : 'warn'} />
        <Stat k="Duração" v="14 dias" note="3 blocos de validação + 1 de decisão" />
        <Stat k="Regra" v="1 canal" note="1 idioma, 1 cultura por vez" />
      </div>

      <div style={{ margin: '12px 0 18px' }}>
        <Bar value={(done / total) * 100} tone={done < total / 2 ? 'warn' : undefined} />
      </div>

      {DAY_BLOCKS.map((block) => {
        const steps = STEPS.filter((s) => s.day[0] >= block.days[0] && s.day[1] <= block.days[1]);
        if (!steps.length) return null;
        const blockDone = steps.filter((s) => state.tasks[`step-${s.id}`]).length;
        return (
          <Card
            key={block.label}
            title={`${block.label} — ${block.focus}`}
            hint={`${blockDone}/${steps.length} passos`}
            right={<Badge tone={blockDone === steps.length ? 'ok' : 'ghost'}>{blockDone === steps.length ? 'bloco fechado' : 'em curso'}</Badge>}
          >
            {steps.map((s) => {
              const id = `step-${s.id}`;
              const on = !!state.tasks[id];
              return (
                <div className={`step-row ${on ? 'step-row--done' : ''}`} key={s.id}>
                  <div className="step-n">{String(s.n).padStart(2, '0')}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span className="step-title">{s.title}</span>
                      <Badge tone="ghost">{s.letter}</Badge>
                      {s.anchor && <Badge tone="violet">precisa de pesquisa</Badge>}
                    </div>
                    <div className="step-meta">
                      <strong>Ação:</strong> {s.action}
                    </div>
                    <div className="step-meta muted">
                      <strong>Por quê:</strong> {s.why}
                    </div>
                    <div className="step-meta muted">
                      <strong>Exemplo:</strong> {s.example}
                    </div>
                    <div className="step-meta pit">
                      <strong>Armadilha:</strong> {s.pitfall}
                    </div>
                    {s.anchor && <div className="step-meta" style={{ color: 'var(--violet)' }}>Pesquise: {s.anchor}</div>}
                  </div>
                  <div className="row" style={{ gap: 6, alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={on} onChange={() => dispatch({ type: 'task/toggle', taskId: id })} />
                    <a className="btn btn--sm btn--ghost" href={`#/${LETTER_ROUTE[s.letter] ?? 'dashboard'}`}>
                      módulo
                    </a>
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })}

      <h2>Checklist final</h2>
      <Card title="Os oito itens que fecham o ciclo" hint="Se algum ficar desmarcado, a campanha não está validada">
        <div className="grid g2">
          {FINAL_CHECKLIST.map((item) => (
            <label className="check" key={item.id} style={{ padding: '6px 0' }}>
              <input type="checkbox" checked={!!state.tasks[item.id]} onChange={() => dispatch({ type: 'task/toggle', taskId: item.id })} />
              <span className={state.tasks[item.id] ? 'dim' : ''}>{item.label}</span>
            </label>
          ))}
        </div>
        <div className="divider" />
        {checklistDone === FINAL_CHECKLIST.length ? (
          <Callout tone="ok" title="Ciclo fechado">
            Gere o relatório em <a href="#/export">Relatório & template</a> e arquive. O que fica é o aprendizado
            documentado, não o resultado de uma campanha.
          </Callout>
        ) : (
          <Callout tone="warn" title={`Faltam ${FINAL_CHECKLIST.length - checklistDone} item(ns)`}>
            O checklist não é burocracia: cada item é uma causa comum de campanha que "quase" deu certo.
          </Callout>
        )}
      </Card>
    </>
  );
}

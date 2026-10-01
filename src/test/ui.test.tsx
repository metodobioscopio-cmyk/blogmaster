// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { StoreProvider } from '../state/store';
import App from '../App';

function renderApp() {
  return render(
    <StoreProvider>
      <App />
    </StoreProvider>,
  );
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
  window.location.hash = '';
  // A API pode não estar no ar durante os testes de UI.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ demo: true, ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })),
  );
});

const ROUTES_TO_VISIT = [
  'dashboard',
  'demand',
  'audit',
  'angle',
  'tracking',
  'decide',
  'scale',
  'test72',
  'plan14',
  'benchmarks',
  'stack',
  'export',
  'pricing',
  'settings',
];

describe('aplicação monta e todas as rotas renderizam', () => {
  it('abre no console com a campanha de exemplo', () => {
    renderApp();
    expect(screen.getByText('VALIDA OS')).toBeTruthy();
    // O nome aparece no seletor de campanha e no badge do topo.
    expect(screen.getAllByText('Exemplo — suplemento T1 via Meta').length).toBeGreaterThan(0);
  });

  for (const route of ROUTES_TO_VISIT) {
    it(`renderiza a rota #/${route} sem quebrar`, () => {
      window.location.hash = `#/${route}`;
      const { container } = renderApp();
      expect(container.textContent?.length ?? 0).toBeGreaterThan(200);
    });
  }

  it('não deixa nenhuma rota mostrar tela em branco', () => {
    for (const route of ROUTES_TO_VISIT) {
      cleanup();
      window.location.hash = `#/${route}`;
      const { container } = renderApp();
      const text = container.textContent ?? '';
      expect(text, `rota ${route} renderizou vazia`).not.toMatch(/^\s*$/);
      cleanup();
    }
  });
});

describe('interações principais', () => {
  it('navega pelo menu lateral', () => {
    renderApp();
    const link = document.querySelector('a[href="#/benchmarks"]') as HTMLAnchorElement;
    fireEvent.click(link);
    expect(window.location.hash).toBe('#/benchmarks');
  });

  it('edita a comissão e recalcula o break-even', () => {
    window.location.hash = '#/demand';
    renderApp();
    // A oferta de exemplo tem preço 69 e comissão 65% com taxa de rede do ClickBank.
    const inputs = document.querySelectorAll('input[type=number]');
    expect(inputs.length).toBeGreaterThan(5);
    const commission = inputs[5] as HTMLInputElement;
    fireEvent.change(commission, { target: { value: '100' } });
    expect(screen.getByText(/Conversão de empate/i)).toBeTruthy();
  });

  it('marca um passo do plano de 14 dias', () => {
    window.location.hash = '#/plan14';
    renderApp();
    const boxes = document.querySelectorAll('input[type=checkbox]');
    const before = Array.from(boxes).filter((b) => (b as HTMLInputElement).checked).length;
    fireEvent.click(boxes[0]);
    const after = Array.from(document.querySelectorAll('input[type=checkbox]')).filter((b) => (b as HTMLInputElement).checked).length;
    expect(after).not.toBe(before);
  });

  it('troca a moeda em ajustes e reflete no topo', () => {
    window.location.hash = '#/settings';
    const { container } = renderApp();
    // O primeiro <select> do DOM é o seletor de campanha, na barra lateral.
    const currencySelect = container.querySelector('.page select') as HTMLSelectElement;
    fireEvent.change(currencySelect, { target: { value: 'BRL' } });
    const topbar = container.querySelector('.topbar') as HTMLElement;
    expect(topbar.textContent).toContain('BRL');
  });

  it('gera o relatório em markdown', async () => {
    window.location.hash = '#/export';
    renderApp();
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Gerar relatório'));
    expect(btn).toBeTruthy();
    fireEvent.click(btn!);
    const pre = document.querySelector('pre');
    expect(pre?.textContent).toContain('Campanha Validada em 14 Dias');
  });

  it('a régua de corte aceita o padrão do roadmap', () => {
    window.location.hash = '#/decide';
    renderApp();
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('padrão do roadmap'));
    fireEvent.click(btn!);
    const inputs = document.querySelectorAll('input[type=number]');
    expect((inputs[0] as HTMLInputElement).value).toBe('1');
  });
});

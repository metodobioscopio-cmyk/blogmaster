# Design System — "Editorial Premium"
### Growth Design Pro · documentação da identidade

Este diretório documenta a identidade visual do produto. O código-fonte dos tokens está em
`site/assets/css/`. Aqui ficam as decisões — o porquê de cada valor, e as regras que mantêm o conjunto
coerente quando outra pessoa (ou um agente de IA) for editar.

---

## 1. A decisão de posicionamento visual

A categoria vende "growth hacker": fundo preto, gradiente neon, contador piscando, emoji em cada
parágrafo. O Growth Design Pro faz o oposto: **parece uma publicação de arquitetura, não um lançamento
de infoproduto**.

Papel morno, tinta, um único acento em ouro profundo, tipografia serifada de alto contraste, muito
respiro e filetes de régua como motivo recorrente. Onde o concorrente grita, o produto sussurra — e
parece mais caro por isso. A inversão estética **é** o diferencial de percepção.

**Princípio operacional que decorre disso:** o ouro é decoração semântica, não cor de ação. Botões são
tinta sólida; o ouro marca ênfase, número de seção e filete. Isso evita o "dourado de sorte" que
barateia o conjunto.

---

## 2. Tokens (fonte única: `site/assets/css/tokens.css`)

### Cor

| Token | Valor | Uso | Contraste medido |
|---|---|---|---|
| `--paper` | `#F7F4ED` | fundo padrão | — |
| `--paper-2` | `#EFEADF` | seções alternadas | — |
| `--paper-3` | `#E5DFD1` | bordas e poços | — |
| `--paper-card` | `#FCFAF5` | cartões elevados | — |
| `--ink` | `#121110` | texto principal | 16.8:1 sobre `--paper` |
| `--ink-2` | `#3A3733` | texto secundário | 9.4:1 |
| `--ink-3` | `#6B655C` | legendas e metadados (**piso**) | 4.9:1 |
| `--night` | `#0F0F0D` | seções de impacto e rodapé | — |
| `--on-night` | `#F2EEE4` | texto sobre escuro | 15.1:1 |
| `--on-night-2` | `#A9A296` | texto suave sobre escuro | 6.0:1 |
| `--gold` | `#8F6F2E` | acento sobre papel | AA |
| `--gold-bright` | `#C9A44C` | acento sobre escuro | AA |
| `--api-1…6` | azul, verde, terracota, ouro, violeta, teal | cor funcional de cada API | AA em uso textual |

### Tipografia

Auto-hospedada — nenhum CDN externo. O produto precisa funcionar offline e não depender de terceiros
para renderizar.

| Família | Papel | Pesos usados | Arquivo |
|---|---|---|---|
| **Fraunces** | display, títulos, números grandes | 300, 400, 600, 300 itálico | `fraunces-*.woff2` |
| **Inter** | corpo, interface, legendas | 300, 400, 500, 600 | `inter-*.woff2` |
| **JetBrains Mono** | código, prompts, endpoints, metadados | 400, 500 | `jetbrains-mono-*.woff2` |

Escala fluida com `clamp()`: display `2.75→6.5rem` · h1 `2.25→4rem` · lead `1.06→1.375rem` ·
corpo `1.0625rem` · eyebrow `0.6875rem` com tracking `0.18em` em caixa alta.

### Espaçamento e medida

Base 4pt (`--s-1` a `--s-12`), `--gutter` fluido, `--section-y` entre `3.5rem` e `8rem`.
Larguras: `78rem` conteúdo · `46rem` leitura longa · `90rem` faixas full-bleed controladas.

### Movimento

`--dur` 260 ms · `--dur-fast` 140 ms · `--dur-slow` 620 ms · `--ease-out: cubic-bezier(.16,1,.3,1)`.
Nada rebate, nada gira, nada pisca — exceto o selo decorativo (26 s, desligado em
`prefers-reduced-motion`).

---

## 3. Motivos assinatura

| Motivo | Classe | Onde aparece |
|---|---|---|
| **Filete com legenda numerada** | `.filete` | abre cada seção: número mono + rótulo em caixa alta + régua |
| **Colofão** | `.gdp-colophon` | ficha técnica do produto em formato de metadados de livro |
| **Selo giratório** | `.gdp-seal` | círculo com as seis etapas, giro lentíssimo |
| **Índice numerado** | `.gdp-modules` | os 6 módulos como sumário de livro, não como cards de marketing |
| **Textura de papel** | `body::before` | ruído SVG, `multiply` no claro e `screen` no escuro |

---

## 4. Camadas do CSS

```
tokens.css       → decisões (cor, tipo, espaço, forma, movimento)
base.css         → reset + primitivas de layout + tipografia editorial
components.css   → botão, nav, cartão, acordeão, oferta, FAQ, rodapé, código
```

**Regra absoluta:** nenhum valor de cor, tipografia ou espaçamento é escrito à mão em um componente.
Sempre token. Se precisar de um valor que não existe, ele entra em `tokens.css` primeiro.

---

## 5. Regras de aplicação

1. Contraste mínimo AA em todo par texto/fundo. `--ink-3` é o piso — nada abaixo dele em texto.
2. Ouro nunca em texto de corpo: apenas ênfase, número, filete e borda.
3. Sombra só em elemento que realmente flutua (cartão em hover, botão em hover).
4. Sem ícone decorativo. Cada ícone carrega informação.
5. Tipografia faz a hierarquia; cor faz a função. Não use cor para hierarquia.
6. Toda alteração visual exige rodar `python3 tools/verificar.py` antes de publicar.

---

## 6. Como reutilizar esta identidade em outro produto

Se você quiser construir uma identidade parecida para um cliente (e não copiar esta), o caminho é o
método do Módulo 1, não este arquivo:

1. Extraia decisões de 3 referências (prompt 01 do kit).
2. Recombine tipografia de uma, paleta de outra, ritmo de uma terceira.
3. Escreva os tokens antes de desenhar qualquer página.
4. Verifique o contraste de todo par **antes** de aplicar.

A identidade "Editorial Premium" é o **resultado** desse processo aplicado a este produto. Copiá-la
inteira para um cliente é o oposto do que o curso ensina — e produz um site com a cara de outra marca.

---

## 7. Arquivos relacionados

- `site/assets/css/tokens.css` — a implementação (fonte única)
- `kit/templates/design-system-starter-kit/` — 10 sistemas originais para recombinar
- `kit/prompts/prompts-pt.md` §1 — os seis prompts de extração de design system
- `00-PROJETO.md` §4 — a decisão de identidade dentro do projeto do produto

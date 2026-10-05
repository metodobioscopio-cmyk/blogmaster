# GROWTH DESIGN PRO — Arquivo de Projeto

> **Este é o documento-fonte do produto.** Tudo o que existe neste repositório (site, e-book, kit de
> ferramentas, materiais de venda) deriva das decisões registradas aqui. Se você for alterar qualquer
> coisa, altere primeiro aqui — senão a identidade se fragmenta.

| Campo | Valor |
|---|---|
| **Produto** | Growth Design Pro |
| **Formato** | Curso online (vídeo + PDF) + Kit de Ferramentas |
| **Carga** | 6 módulos · 28 aulas · ~4 h de conteúdo |
| **Preço** | R$ 497 (cheio) · R$ 297 (lançamento) · USD 97 / USD 57 |
| **Garantia** | 7 dias, incondicional |
| **Plataformas** | Hotmart, Kiwify, Eduzz (BR) · Gumroad (EN) |
| **Idiomas** | PT-BR (principal) + EN (Gumroad) |
| **Identidade** | Editorial Premium — papel, tinta e ouro |
| **Base técnica** | Repositório público `cporter202/ai-growth-stack` — 6 APIs no RapidAPI |

---

## 1. Promessa e posicionamento

**Promessa central**

> Transforme qualquer site em uma máquina de crescimento exponencial usando IA e um stack de 6 APIs
> prontas para uso.

**Frase de posicionamento**

> "Pare de projetar sites lineares. Comece a construir sistemas de crescimento exponencial."

**A distinção que sustenta o preço.** Não é um curso de "usar IA para fazer site". É um curso de
**arquitetura de crescimento**: o aluno aprende a encadear seis serviços de IA em um funil, de modo que a
saída de cada etapa alimente a entrada da seguinte. O diferencial não está em nenhuma API isolada — está na
**sequência** e no **método de design** que transforma dado bruto em página que converte.

**Posicionamento honesto (e defensável).** O produto ensina a operar um stack de terceiros e um método de
design. Ele **não** vende as APIs, **não** garante tráfego, ranking ou receita. Toda promessa numérica de
resultado — em página de vendas, anúncio ou depoimento — precisa ser substituída por resultado real medido
do aluno ou removida. Ver §9.

---

## 2. Público e objeção principal

| Segmento | Dor | O que compra |
|---|---|---|
| Freelancer de design/desenvolvimento | Vende "site institucional" a preço de mercado, concorrência de template | Um pacote fechado de maior ticket ("Site Exponencial") |
| Agência pequena (2–10 pessoas) | Entrega site, mas não retém cliente na fase de crescimento | Um serviço recorrente de otimização |
| Dono de negócio digital | Site existe, não gera lead | Diagnóstico e correção sem contratar equipe |
| Marketer / gestor de tráfego | Anuncia para página que não converte | Ferramenta de otimização de página e copy |

**Objeção número um:** *"já uso ChatGPT, por que preciso disso?"*
**Resposta (usar literalmente nos materiais):** porque ChatGPT **gera texto**, e o Growth Stack **mede**.
A API de SEO devolve score de 1 a 100 e recomendações por dimensão; a de conversão avalia formulários, CTAs
e sinais de confiança da página; a de extração traz os dados reais do concorrente. Você não está pedindo
opinião a um modelo — está rodando um diagnóstico sobre dados da página e depois usando IA para executar a
correção. Texto sem medição é achismo com boa redação.

---

## 3. As 6 APIs e o que cada uma faz (verificado na documentação pública)

| # | API | Entrada | Saída | Papel no funil |
|---|---|---|---|---|
| 1 | Website Data Extraction | URL | meta tags, contatos, links, imagens, dados de SEO estruturados | **Inteligência** |
| 2 | AI SEO Analysis | URL | score 1–100 + recomendações + plano passo a passo | **Diagnóstico** |
| 3 | AI Conversion Optimization | URL | score + análise de formulários, CTAs, estrutura, sinais de confiança | **Atrito** |
| 4 | AI Website Copywriter | contexto/briefing | title tags, meta descriptions, headings, CTAs, página completa | **Produção** |
| 5 | AI Landing Page Optimizer | URL | otimização de headline, CTA, layout, caminho de conversão | **Refino** |
| 6 | AI Social Media Content Generator | conteúdo do site | posts por plataforma (X/Twitter, Facebook, Instagram, LinkedIn) + hashtags | **Amplificação** |

**Sequência canônica (o "Funil de Crescimento"):**

```
1 EXTRAIR ──▶ 2 ANALISAR ──▶ 3 ESCREVER ──▶ 4 OTIMIZAR ──▶ 5 CONVERTER ──▶ 6 AMPLIFICAR
  dados do       score SEO      copy que        headline,      formulário,      posts por
  concorrente    e lacunas      ranqueia        CTA, layout    fricção          plataforma
      │              │              │               │              │               │
      └── alimenta ───┴── alimenta ─┴─── alimenta ──┴── alimenta ──┴── alimenta ────┘
                                                                          │
                        ◀──────────── ciclo: novo dado volta ao passo 1 ───┘
```

> ⚠️ **Verificação obrigatória antes de gravar.** Todos os seis serviços estão hospedados no RapidAPI sob o
> mesmo publicador (`contact-_OGid12Eu`). Nomes de endpoint, parâmetros obrigatórios, limites de plano e
> preços mudam sem aviso. **Regravar o screencast do Módulo 4 é pré-requisito de gravação**, nunca depois.
> Consulte a página de cada API em `rapidapi.com/user/contact-_OGid12Eu`.

---

## 4. Identidade visual — Design System "Editorial Premium"

### 4.1 Conceito

A categoria vende "growth hacker": fundo preto, gradiente neon, contador piscando. O Growth Design Pro faz
o oposto editorial — **parece uma publicação de arquitetura, não um lançamento de infoproduto**. Papel
morno, tinta, um único acento em ouro profundo, tipografia serifada de alto contraste com muito respiro e
filetes de régua. A inversão é o diferencial visual: onde o concorrente grita, o produto sussurra — e parece
mais caro por isso.

Princípio operacional: **o ouro é decoração semântica, não cor de ação.** Botões são tinta sólida; o ouro
marca ênfase, número e filete. Isso evita o "dourado de sorte" que barateia o conjunto.

### 4.2 Tokens (fonte única: `site/assets/css/tokens.css`)

**Cor**

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F7F4ED` | fundo padrão |
| `--paper-2` | `#EFEADF` | seções alternadas |
| `--ink` | `#121110` | texto principal (16.8:1 sobre papel) |
| `--ink-2` | `#3A3733` | texto secundário (9.4:1) |
| `--ink-3` | `#6B655C` | legendas (4.9:1 — mínimo AA) |
| `--night` | `#0F0F0D` | seções de impacto e rodapé |
| `--gold` | `#8F6F2E` | acento sobre papel |
| `--gold-bright` | `#C9A44C` | acento sobre escuro |
| `--api-1…6` | azul, verde, terracota, ouro, violeta, teal | cor funcional de cada API |

**Tipografia** — auto-hospedada (nunca CDN externa: o produto precisa funcionar offline e não depender de
terceiros para renderizar)

| Família | Papel | Pesos usados |
|---|---|---|
| **Fraunces** | display, títulos, números grandes | 300, 400, 600, 300 itálico |
| **Inter** | corpo, interface, legendas | 300, 400, 500, 600 |
| **JetBrains Mono** | código, prompts, endpoints, metadados | 400, 500 |

Escala fluida com `clamp()`: display `2.75→6.5rem`, h1 `2.25→4rem`, lead `1.06→1.375rem`, corpo `1.0625rem`,
eyebrow `0.6875rem` com tracking `0.18em` em caixa alta.

**Espaçamento** — base 4pt (`--s-1` a `--s-12`); `--gutter` fluido; `--section-y` entre `3.5rem` e `8rem`.
Larguras máximas: `78rem` conteúdo, `46rem` leitura longa.

**Movimento** — `--dur` 260 ms, `--ease-out: cubic-bezier(0.16,1,0.3,1)`. Nada rebate, nada gira, nada
pisca (exceto o selo, 26 s, decorativo, desligado em `prefers-reduced-motion`).

### 4.3 Motivos assinatura

1. **Filete com legenda numerada** (`.filete`) — abre cada seção: número mono + rótulo em caixa alta + régua.
2. **Colofão** (`.gdp-colophon`) — ficha técnica do produto em formato de metadados de livro.
3. **Selo giratório** (`.gdp-seal`) — 52 palavras em círculo, giro lentíssimo.
4. **Índice numerado** (`.gdp-modules`) — os 6 módulos como sumário de livro, não como cards de marketing.
5. **Textura de papel** — ruído SVG em `body::before`, `multiply` no claro, `screen` no escuro.

### 4.4 Regras de aplicação

- Nenhum valor de cor/tipografia/espaço escrito à mão em componente. Sempre token.
- Contraste mínimo AA em todo par texto/fundo. `--ink-3` é o piso.
- Ouro nunca em texto de corpo; só em ênfase, número, filete e borda.
- Sombra só em elemento que realmente flutua (cartão em hover, botão em hover).
- Sem ícone decorativo: cada ícone carrega informação.

---

## 5. Metodologia Vibe Design (o que o aluno aprende)

O curso se apoia em três verbos. São a estrutura do Módulo 1 e a espinha do Módulo 3.

### 5.1 EXTRAIR

Ler um site de referência e capturar **decisões**, não pixels. Dimensões a extrair, nesta ordem:
paleta (5–7 cores com função), escala tipográfica, escala de espaçamento, raios, sombras, movimento, densidade
de layout, tom de voz. A API de Extração de Dados dá o estrato bruto (meta, links, imagens, texto);
o olho humano dá a intenção.

> **Regra ética obrigatória de Vibe Design.** Extrair um *sistema* (proporções, paleta, ritmo) é
> aprendizado — como um músico tirar harmonia de ouvido. Copiar *ativos* (logo, ilustração, foto, código,
> texto literal) é violação de direito autoral. O material do curso precisa dizer isso em voz alta, e o
> "Design System Starter Kit" entregue ao aluno deve conter sistemas **originais derivados**, com
> atribuição de referência e sem nenhum ativo de terceiro.

### 5.2 RECOMBINAR

Cada decisão extraída vira uma variável. Recombinar é trocar variáveis de fontes diferentes até o resultado
não lembrar nenhuma das origens. Matriz de recombinação: `tipografia (A) × paleta (B) × ritmo (C) × movimento (D)`.
O produto precisa registrar de qual referência veio cada variável — rastreabilidade é o que separa método de
plágio.

### 5.3 CONSTRUIR

Escrever o sistema como código, não desenhar tela por tela. Ordem de construção: tokens → primitivas de
layout → componentes → páginas. Este próprio repositório é a prova: `tokens.css` → `base.css` →
`components.css` → página.

O "Prompt de Mil Dólares" (§6.2) é a ferramenta do passo 1: ele transforma a leitura de um site em um arquivo
de tokens pronto para o passo 3.

---

## 6. Prompts-mestre

> A biblioteca completa (50+ prompts bilíngues) está em `kit/prompts/`. Aqui ficam os três prompts
> estruturais que geram os outros.

### 6.1 Meta-prompt — gerar prompts

```
Você é um engenheiro de prompts. Tarefa: gerar [N] prompts para [OBJETIVO], a serem usados por
[NÍVEL DE EXPERIÊNCIA] dentro de [FERRAMENTA].

Contexto do domínio: [DESCREVER O STACK E O FUNIL]

Requisitos de cada prompt:
1. Papel explícito ("Você é..."), tarefa única, sem tarefa dupla.
2. Entradas nomeadas entre [COLCHETES] que o aluno preenche.
3. Formato de saída declarado (JSON, tabela markdown, lista numerada).
4. Uma restrição negativa explícita (o que NÃO fazer).
5. Uma pergunta de esclarecimento obrigatória quando faltar dado essencial.
6. Sem prometer resultado que a ferramenta não pode entregar.
7. Idioma: português do Brasil.
8. Comprimento: até [N] palavras. Sem preâmbulo, sem "claro, aqui está".

Entregue em tabela markdown: | # | Nome | Prompt completo | Quando usar |
```

### 6.2 "Prompt de Mil Dólares" — extrair design system

```
Você é um designer de sistemas sênior. Analise os dados do site [URL] fornecidos abaixo e produza um
design system reutilizável — não um comentário estético.

DADOS:
<dados>
[META TAGS, TEXTO, ESTRUTURA E LINKS — vindos da API de Extração de Dados]
</dados>

Extraia e devolva:

## 1. Conceito (2 frases) — qual é a ideia central do site; que sensação ele persegue.
## 2. Paleta — 6 cores em HEX com a FUNÇÃO de cada uma (fundo, texto, secundária, acento,
       linhas, estado). Se não for possível inferir com segurança, diga "não inferível".
## 3. Tipografia — famílias aparentes, classificação, pesos prováveis, relação de escala entre
       título e corpo, tracking percebido.
## 4. Espaçamento — unidade-base estimada e ritmo (denso / médio / arejado).
## 5. Forma — padrões de raio, uso de borda e de sombra.
## 6. Movimento — o que se move, quão rápido, com que propósito.
## 7. Layout — largura de conteúdo, colunas, uso de assimetria.
## 8. Tom de voz — 5 adjetivos, com evidência textual.
## 9. O que NÃO copiar — 3 características que funcionam só naquele contexto.

SAÍDA: bloco CSS completo de :root com todos os tokens acima, nomeados de forma semântica.
RESTRIÇÕES: não descreva pixels que você não pode ver; não invente fonte exata (classifique, não afirme);
não reproduza nenhum texto literal do site com mais de 8 palavras.
```

### 6.3 Prompt de auditoria de honestidade (aplicar a todo material de venda)

```
Você é um revisor de conformidade de publicidade (padrão CONAR / FTC). Leia o texto abaixo e liste:

A) Toda afirmação de resultado (número, prazo, comparação) — com trecho literal.
B) Para cada uma: ela é verificável por um terceiro? Há fonte citada?
C) Toda promessa implícita de renda, ranking ou tráfego.
D) Todo depoimento sem identificação rastreável e permissão.
E) Sugestão de reescrita para cada item, mantendo o poder comercial mas trocando
   garantia por condição: "se você fizer X, obtém Y" em vez de "você vai ganhar Y".

TEXTO:
""" [COLAR] """
```

---

## 7. Aulas — especificação de produção

**Regra de aula (todas as 28).** Cada vídeo segue o mesmo esqueleto, sem exceção:

| Bloco | Tempo | Conteúdo |
|---|---|---|
| Gancho | 0:00–0:20 | O problema em uma frase. Sem logotipo, sem trilha, sem "olá pessoal". |
| Promessa | 0:20–0:40 | "Ao final desta aula você terá [entregável concreto]." |
| Demonstração | 40 s – 80% | Screencast, tela real, sem corte de erro — mostrar o erro e a correção ensina mais. |
| Artefato | 80% – 95% | O arquivo que o aluno baixa (prompt, planilha, template). |
| Recapitulação | final | 3 bullets + "próximo passo". |

**Padrão técnico:** 1920×1080, 30 fps, zoom de tela em 125% para o texto ser legível, microfone lapela ou
headset (nunca microfone interno), sem música de fundo durante a explicação, legendas PT-BR queimadas ou
faixa `.srt` entregue. Arquivo mestre em H.264 CRF 18, áudio −16 LUFS.

### Módulo 1 — Fundamentos do Design Exponencial

| Aula | Título | Entregável |
|---|---|---|
| 1.1 | O que é Design Exponencial | Diagrama comparativo linear × exponencial (PDF) |
| 1.2 | A Metodologia Vibe Design | Fluxo extrair → recombinar → construir |
| 1.3 | Design Systems como Código | Arquivo `tokens.css` comentado |
| 1.4 | O Ecossistema AI Growth Stack | Mapa do funil de 6 etapas |

### Módulo 2 — Dominando as 6 APIs

Uma API por aula, sempre na mesma ordem de demonstração: **o que mede → entrada → saída real → como ler o
resultado → erro comum**. Screencast obrigatório de uma chamada real no RapidAPI.

| Aula | API | Erro comum a ensinar |
|---|---|---|
| 2.1 | Website Data Extraction | Extrair site que bloqueia robô e concluir que a API falhou |
| 2.2 | AI SEO Analysis | Otimizar para o score em vez de para a intenção de busca |
| 2.3 | AI Conversion Optimization | Corrigir CTA antes de corrigir a proposta de valor |
| 2.4 | AI Website Copywriter | Publicar a primeira geração sem editar o tom de voz |
| 2.5 | AI Landing Page Optimizer | Otimizar página que ainda não tem tráfego suficiente para medir |
| 2.6 | Social Media Content Generator | Publicar o mesmo texto em 4 plataformas |

### Módulo 3 — Workflow do Funil de Crescimento

| Aula | Fase | Sequência de ferramentas |
|---|---|---|
| 3.1 | Pesquisa | Extração (concorrentes) → SEO Analysis (lacunas) |
| 3.2 | Conteúdo | SEO Analysis (pauta) → Copywriter (redação) |
| 3.3 | Otimização | Landing Page Optimizer → Conversion Optimization |
| 3.4 | Amplificação | Social Generator (ciclo de tráfego) |
| 3.5 | Estudo de caso | Briefing → site publicado, projeto único gravado do zero |

> **Aula 3.5 é o ativo mais valioso do curso.** Grave um projeto real, com cliente real (com autorização),
> mostrando os números antes e depois. Se não houver cliente, use um site próprio e diga que é próprio.

### Módulo 4 — Configuração Técnica

| Aula | Conteúdo | Artefato |
|---|---|---|
| 4.1 | RapidAPI: conta, assinatura, planos, limites | Checklist de configuração |
| 4.2 | No-code: Make / n8n / Zapier | Blueprints JSON em `kit/integracoes/` |
| 4.3 | Código: JavaScript / Python | `kit/codigo/` — cliente único para as 6 APIs |
| 4.4 | Orquestração com agentes (Claude Code / Cursor) | `AGENTS.md` do projeto |
| 4.5 | Monitoramento e iteração | Planilha Growth Stack Dashboard |

### Módulo 5 — Escalando e Monetizando

| Aula | Conteúdo |
|---|---|
| 5.1 | Produtizando: o pacote "Site Exponencial" em 3 tiers |
| 5.2 | Templates para venda: empacotar design systems extraídos |
| 5.3 | Precificação por valor e proposta comercial |
| 5.4 | Escala com agentes: atendimento simultâneo |

### Módulo 6 — Bônus: Biblioteca de Recursos

`kit/prompts/` · `kit/planilhas/` · `kit/checklists/` · `kit/templates/` · `kit/integracoes/` · `kit/codigo/`

---

## 8. Estrutura comercial

### 8.1 Pacote "Site Exponencial" (produto que o aluno vende)

| Tier | Escopo | Faixa |
|---|---|---|
| **Diagnóstico** | Auditoria com as APIs 1–3, relatório de 10 páginas, plano de 30 dias | entrada |
| **Site Exponencial** | Diagnóstico + reescrita (API 4) + otimização de página (API 5) + 30 posts (API 6) | núcleo |
| **Crescimento Contínuo** | Mensal: novas páginas, otimização contínua, relatório de evolução | recorrência |

Os valores sugeridos nos materiais de venda são **faixas de referência de mercado**, não promessa de
receita. Todo material que o aluno usar com cliente deve trocar "você vai faturar" por "clientes praticam
faixas entre X e Y na sua região — valide com o seu".

### 8.2 Estrutura da página de vendas (ordem)

1. Qualificação ("leia se…") → 2. Headline e subheadline → 3. Problema em 5 linhas → 4. Inversão
("não é mais um curso de ChatGPT") → 5. O stack, em 6 blocos numerados → 6. O funil em diagrama →
7. Índice dos 6 módulos → 8. O kit de ferramentas, item por item → 9. Autoridade → 10. Depoimentos →
11. Oferta e valor empilhado → 12. Garantia → 13. FAQ (12 objeções) → 14. CTA final.

### 8.3 Precificação

Cheio R$ 497. Lançamento R$ 297, com prazo declarado e cumprido — se o prazo passar, o preço volta. Nunca
"R$ 497" riscado por tempo indeterminado: preço riscado permanente é a marca do infoproduto ruim e queima a
marca editorial que este produto construiu.

---

## 9. Conformidade e ética (ler antes de publicar)

1. **Nada de depoimento fabricado.** A página entrega os depoimentos como **espaços marcados**, com aviso de
   que devem ser preenchidos por alunos reais com autorização por escrito. Se não houver aluno ainda, a
   seção é removida — não preenchida.
2. **Nada de resultado fabricado.** Nenhum número de tráfego, receita ou prazo que não tenha sido medido.
3. **Garantia de 7 dias** é obrigação legal no Brasil (art. 49 do CDC, direito de arrependimento em compra
   fora do estabelecimento) — declarar e cumprir, sem letra miúda.
4. **Relação com o repositório `ai-growth-stack`.** O projeto é uma coleção **curada** de APIs de terceiros,
   publicada publicamente. Este produto **não é afiliado, endossado ou licenciado** pelo autor do repositório
   nem pelos fornecedores das APIs. Uso de marca, nomes e logos de terceiros: apenas para identificar os
   serviços, sem sugerir parceria. **Antes de vender:** confirme com o autor do repositório se ele autoriza a
   referência, ou simplesmente referencie os serviços do RapidAPI pelo que são, sem citar o repositório como
   origem do seu produto.
5. **Planos e limites das APIs são do aluno**, não estão inclusos na compra do curso. Isso precisa estar
   explícito na página de vendas, no FAQ e na primeira aula do Módulo 4. O erro de venda mais caro deste
   produto é o aluno comprar esperando que a assinatura esteja inclusa.
6. **Direito autoral em Vibe Design** — ver §5.1.

---

## 10. Pipeline de build (o que está neste repositório)

### Arquivos escritos à mão (a fonte de verdade)

```
site/assets/css/tokens.css        tokens (fonte única da identidade)
site/assets/css/base.css          reset + primitivas
site/assets/css/components.css    componentes
site/assets/js/main.js            comportamento
site/index.html                   landing page PT-BR
site/en/index.html                landing page EN (espelho, mesmos ids de seção)
site/area/index.html              área de membros (índice dos 6 módulos)
site/assets/img/favicon.svg       marca
site/robots.txt · sitemap.xml · _headers · _redirects
```

### Gerados por script — nunca editar a saída

```bash
python3 tools/gerar_legal.py             # 5 páginas legais (PT + EN)
python3 tools/gerar_planilhas.py         # 4 planilhas .xlsx            (precisa de openpyxl)
python3 tools/gerar_design_systems.py    # 10 design systems + preview
python3 tools/gerar_ebook.py             # e-book HTML (PT + EN) + cópias da área de membros
python3 tools/gerar_paginas_kit.py       # site/kit/ e site/ebook/ (PT + EN)
python3 tools/gerar_area_en.py           # site/en/area/ a partir das aulas da página de vendas
python3 tools/publicar_site.py           # copia kit/ para site/area/materiais/
```

Ordem, quando mexer em conteúdo compartilhado:

```bash
python3 tools/gerar_legal.py && python3 tools/gerar_ebook.py && \
python3 tools/gerar_paginas_kit.py && python3 tools/gerar_area_en.py && \
python3 tools/publicar_site.py && python3 tools/verificar.py
```

### Pré-visualização local

```bash
python3 -m http.server 8000 --directory site
```

### Publicação

Publique a pasta `site/` como raiz (Netlify: *Publish directory* = `site`; Vercel:
`vercel deploy site --prod`; Cloudflare Pages: *output* = `site`). `_headers` e `_redirects`
são lidos automaticamente pelas três plataformas.

### Critérios de aceite (verificados por `tools/verificar.py`)

- [ ] Nenhum valor hex fora de `tokens.css`
- [ ] Toda tag que abre fecha; todo `id` referenciado por `aria-controls` existe
- [ ] Nenhum `id` duplicado; nenhuma âncora interna que não exista
- [ ] Nenhum texto `TODO`/`Lorem` sobrevivente fora de crase de documentação
- [ ] Contraste AA em todos os 12 pares declarados
- [ ] Site funcional com JavaScript desabilitado (menu, acordeões, conteúdo)
- [ ] Nenhuma requisição externa em tempo de execução (fontes, scripts, imagens locais)
- [ ] Todo placeholder comercial explicitamente marcado com `data-placeholder`
- [ ] Toda URL do `sitemap.xml` resolve para um arquivo publicado
- [ ] Arquivos < 300 KB cada; página inicial < 500 KB no total

O verificador separa três níveis: **bloqueante** (quebra publicação), **aviso** (dívida visual
ou de manutenção) e **pendência** (campo que o cliente precisa preencher antes de vender, como
`CHECKOUT-URL-AQUI` e o host real da RapidAPI). Só os bloqueantes derrubam o exit code.

---

## 11. Legal (textos obrigatórios)

- **Termos de uso** e **política de privacidade** (LGPD: dados de compra, finalidade, retenção, exclusão).
- **Aviso de resultados** — em rodapé de todas as páginas: resultados dependem de execução, mercado,
  qualidade da oferta do aluno e do comportamento de plataformas de terceiros; o produto não garante
  tráfego, ranking, vendas ou renda.
- **Aviso de independência** — produto não afiliado a RapidAPI, às APIs do stack, ou a Hotmart/Kiwify/Eduzz/
  Gumroad; marcas citadas pertencem aos seus titulares.
- **Licença de uso do kit de ferramentas** — uso pessoal e comercial na prestação de serviço ao aluno,
  vedada revenda ou redistribuição dos arquivos como produto próprio.

> Este documento é planejamento de produto, não parecer jurídico. Antes de publicar, revise os textos legais
> com um advogado.

---

*Growth Design Pro · arquivo de projeto v1.0 · identidade Editorial Premium*

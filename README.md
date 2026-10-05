# Growth Design Pro

> Pare de desenhar sites lineares. Construa sistemas de crescimento.

Curso online + kit de ferramentas que ensina designers, freelancers e agências a projetar
sites que **medem o próprio crescimento** com um funil de 6 APIs de IA.

Este repositório é o produto inteiro, pronto para publicar: site estático bilíngue,
área de membros, e-book, kit de ferramentas e materiais de venda.

---

## O que existe aqui

| Pasta | O que é | Estado |
|---|---|---|
| `00-PROJETO.md` | Especificação mestra: posicionamento, funil, tokens, 28 aulas, conformidade | pronto |
| `site/` | Site estático deployable (PT-BR em `/`, inglês em `/en/`) | pronto |
| `site/index.html` · `site/en/index.html` | Página de vendas bilíngue | pronto |
| `site/kit/` · `site/en/kit/` | Página pública do kit de ferramentas | gerado |
| `site/ebook/` · `site/en/ebook/` | Página pública do e-book | gerado |
| `site/area/` | Área de membros (6 módulos, 28 aulas, biblioteca de downloads) | pronto |
| `site/area/materiais/` | Kit + e-book publicados para o aluno baixar | gerado |
| `site/legal/` | 5 páginas legais (termos, privacidade, licença — PT e EN) | gerado |
| `kit/` | Prompts, checklists, planilhas, código, integrações e templates | pronto |
| `ebook/` | Growth Design Playbook: manuscrito em Markdown + edição HTML (PT + EN) | pronto |
| `design-system/` | Documentação do sistema Editorial Premium (tokens, tipografia, regras) | pronto |
| `vendas/` | Página de vendas, anúncios, sequência de e-mails, plano de lançamento | pronto |
| `tools/` | Geradores e verificador (a fonte de verdade do que é gerado) | pronto |

---

## Publicar em 5 minutos

O site é estático: nenhum build, nenhuma dependência de runtime.

```bash
# 1. gere tudo o que é derivado (na ordem)
python3 tools/gerar_legal.py            # páginas legais
python3 tools/gerar_ebook.py            # e-book HTML + cópias da área de membros
python3 tools/gerar_paginas_kit.py      # páginas públicas do kit e do e-book
python3 tools/publicar_site.py          # copia kit/ para dentro de site/area/materiais/

# 2. verifique antes de subir (bloqueia se algo estiver quebrado)
python3 tools/verificar.py

# 3. sirva localmente para conferir no navegador
python3 -m http.server 8080 --directory site
```

Depois, publique a pasta `site/` como raiz do site:

- **Netlify** — arraste a pasta `site/`, ou aponte o repositório e defina *Publish directory* = `site`.
  `site/_headers` e `site/_redirects` são lidos automaticamente.
- **Vercel** — `vercel deploy site --prod`.
- **Cloudflare Pages** — *Build output directory* = `site`.

Os scripts que usam `openpyxl` (planilhas) precisam de ambiente virtual:

```bash
python3 -m venv /tmp/xl && /tmp/xl/bin/pip install openpyxl
/tmp/xl/bin/python tools/gerar_planilhas.py
```

---

## Antes de vender: 7 checagens obrigatórias

Lista completa com o texto exato em [`vendas/README.md`](vendas/README.md). Resumo:

1. **Nenhum depoimento inventado.** Os blocos marcados com `data-placeholder` são ilustrativos
   e precisam ser substituídos por depoimentos reais e autorizados, ou removidos.
2. **Nenhum número de resultado inventado.** Métricas só com print, planilha ou autorização.
3. **Assinatura da RapidAPI não está inclusa.** O aluno contrata na conta dele — está no herói,
   na tabela do stack, no FAQ e no rodapé.
4. **Prazo do lançamento é real.** Se a data mudar, mude o texto; não reinicie a escassez.
5. **Garantia de 7 dias é honrada sem discussão** (CDC art. 49).
6. **Independência declarada:** Growth Design Pro não é afiliado à RapidAPI nem aos autores de
   outras ferramentas citadas.
7. **Revisão jurídica antes de escalar** o investimento em mídia paga.

Substituições obrigatórias: `CHECKOUT-URL-AQUI` / `CHECKOUT-URL-HERE` (4 pontos) e as duas
duplas de depoimentos. `python3 tools/verificar.py` lista todas em *pendências de publicação*.

---

## Arquitetura

```
blogmaster/
├── 00-PROJETO.md            especificação mestra
├── site/                    ← publique esta pasta
│   ├── index.html           página de vendas PT-BR
│   ├── en/                  espelho em inglês (mesmos ids de seção)
│   ├── kit/  ebook/         páginas públicas (geradas)
│   ├── area/                área de membros + materiais publicados
│   ├── legal/               termos, privacidade, licença
│   ├── assets/              CSS, JS, fontes self-hosted, og.jpg
│   ├── _headers             segurança + cache (Netlify/Cloudflare)
│   ├── _redirects           URLs curtas e legais
│   ├── robots.txt
│   └── sitemap.xml
├── kit/                     prompts, checklists, planilhas, código, integrações, templates
├── ebook/                   manuscrito (md) e edição HTML do Playbook
├── design-system/           documentação do Editorial Premium
├── vendas/                  copy de venda, anúncios, e-mails, plano de 21 dias
└── tools/                   geradores + verificador
```

### O funil de crescimento (a ordem importa)

**1 EXTRACT** → **2 ANALYZE** (SEO) → **3 WRITE** (copy) → **4 OPTIMIZE** (landing page)
→ **5 CONVERT** (CRO) → **6 AMPLIFY** (social) → *loop*

As 6 APIs ficam no mesmo publicador da RapidAPI
(`rapidapi.com/user/contact-_OGid12Eu`). O catálogo do repositório de origem não é a ordem de
execução — este produto usa a ordem do funil.

---

## Design system

Direção visual **Editorial Premium**: contraste preto/papel, serifa (Fraunces), dourado como
destaque e nada mais. Documentado em [`design-system/README.md`](design-system/README.md).

- Tokens em `site/assets/css/tokens.css` — nenhum valor hexadecimal fora dele.
- Contraste mínimo AA verificado por `tools/verificar.py` (12 pares declarados).
- Fontes self-hosted em `site/assets/fonts/` (nenhuma requisição para o Google Fonts).
- 10 sistemas visuais originais para clientes em `kit/templates/design-system-starter-kit/`.

---

## Licença e uso

- **Site, textos e e-book:** conteúdo original deste produto. Citar com crédito; não redistribuir
  como material próprio.
- **Kit de ferramentas:** uso comercial permitido em projetos próprios e de clientes;
  revenda, redistribuição e sublicença proibidas. Ver `site/legal/licenca.html`.
- **APIs de terceiros:** as assinaturas são contratadas pelo aluno, na conta RapidAPI dele.
  Nenhuma chave de API está neste repositório.

Nada aqui promete tráfego, ranking, conversão ou faturamento. Resultados dependem de mercado,
oferta e execução.

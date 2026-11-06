# blogmaster — Dossiê Grok × Canais

Pesquisa e manual operacional sobre **usar um bot Grok para vender em 20 canais** — Reddit, X, Instagram, WhatsApp, Facebook, TikTok, YouTube, LinkedIn, Telegram, Threads, Bluesky, Nextdoor, Google Business e e-mail — em dois mercados: *affiliate marketing* e *real estate* (Brasil e EUA).

Inclui o motor em Python, o validador de canal que bloqueia ban antes da chamada de API, o setup técnico de cada plataforma, custos/CPL/ROI por canal, um case de 14 dias e um plano de 90 dias com critérios de corte.

> **Regra que atravessa tudo:** o bot pesquisa e redige. **Quem publica é o humano.** Automação de postagem, fazenda de contas e "plantar" recomendação para IA são o caminho mais rápido para ban permanente — e estão fora do escopo por decisão, não por falta de capacidade técnica.

---

## Comece por aqui

O dossiê tem **4 partes**. Se você tem 10 minutos, leia a parte III (os canais) — é a que decide o resto.

| Você quer… | Abra |
|---|---|
| Ler o site navegável | `site/index.html` (ou o preview) |
| **Saber onde o bot vende em cada rede** | [`docs/03-mapa-canais.md`](docs/03-mapa-canais.md) — **comece aqui** |
| **Setar o bot em cada canal** | [`docs/05-setup-tecnico.md`](docs/05-setup-tecnico.md) |
| Ver a rota de cada canal | [`docs/04-rotas-canal.md`](docs/04-rotas-canal.md) |
| Custo, CPL e ROI por canal | [`docs/08-custos-roi.md`](docs/08-custos-roi.md) |
| Não tomar ban nem processo | [`docs/07-compliance.md`](docs/07-compliance.md) |
| Ver um case de 14 dias | [`docs/09-case-14-dias.md`](docs/09-case-14-dias.md) |
| Entender o que a plataforma Grok faz e custa | [`docs/00-metapesquisa-grok.md`](docs/00-metapesquisa-grok.md) |
| O estudo de afiliados | [`docs/01-estudo-afiliados.md`](docs/01-estudo-afiliados.md) |
| O estudo imobiliário (Goiânia + EUA) | [`docs/02-estudo-real-estate.md`](docs/02-estudo-real-estate.md) |
| Operar: prompts P1–P12, custo, qualidade | [`docs/06-playbook-grok.md`](docs/06-playbook-grok.md) |
| Executar em 90 dias / piloto de 14 | [`docs/10-plano-90-dias.md`](docs/10-plano-90-dias.md) |
| Rodar o código | [`grok-channel-ops/README.md`](grok-channel-ops/README.md) |

### As quatro partes

```
PARTE I    O fundamento       00  O bot
PARTE II   Os dois mercados   01  Afiliados      02  Real estate
PARTE III  Os canais          03  Os 20 canais   04  As 11 rotas   05  Setup técnico
PARTE IV   A operação         06  Playbook       07  Compliance    08  Custos & ROI
                              09  Case 14 dias   10  Plano 90 dias  M  O motor
```

---

## Estrutura

```
docs/                    os 11 documentos + o README do motor (fonte da verdade)
site/                    site estático gerado (12 páginas, busca, sumário)
tools/build_site.py      gerador: markdown → site
grok-channel-ops/        motor em Python (zero dependências)
  ├── src/               radar, scribe, weekly, canais, cliente xAI, fontes
  ├── prompts/           P1..P12 versionados
  ├── fixtures/          threads de exemplo (afiliados + Goiânia)
  ├── rules.yaml         regra por subreddit (link, disclosure, tolerância)
  └── tests/             31 testes, sem pytest
data/unit-economics.csv  a planilha que decide go/no-go
```

---

## Rodar o motor (30 segundos, custo zero)

```bash
cd grok-reddit-ops
python3 -m src.cli doctor
python3 -m src.cli radar --source fixture --limit 12
python3 -m src.cli scribe --lead output/leads.jsonl --index 0 --save
python3 -m src.cli weekly --input output/leads.jsonl --posts 12 --clicks 45 --trials 2 --sales 1

# matriz de canais e o validador que impede ban
python3 -m src.cli canais
python3 -m src.cli canais --check instagram_dm --cold   # → COLD_DM_META
python3 -m src.cli canais --check linkedin_dm           # → LINKEDIN_TOS_8_2
python3 -m src.cli canais --check whatsapp --hours 30   # → WINDOW_24H
```

Sem `XAI_API_KEY` roda em modo offline (scorer heurístico). Com a chave no `.env`, o modelo entra automaticamente.

## Regerar o site

```bash
pip install --break-system-packages markdown pygments
python3 tools/build_site.py
```

## Testes

```bash
cd grok-reddit-ops && python3 tests/test_core.py     # 12/12
```

---

## Os cinco números que resumem o dossiê

| Número | Significado | Fonte |
|---|---|---|
| **130,3 mi** DAU · **514,6 mi** WAU | Reddit em Q2/2026 — 4º domínio mais visível no Google EUA | Reddit Inc. / Sistrix |
| **18,5%** das citações em AI Overviews | Reddit é a 2ª fonte que as IAs citam | Ahrefs, set/2026 |
| **≈ US$ 17,77/mês** | custo real de API da operação descrita | tabela de preços xAI, nov/2026 |
| **24,16%** · **0,8%** | comissão média SaaS · conversão referral→venda | Rewardful, 2026 |
| **78%** · **21×** | compradores que fecham com quem responde 1º · vantagem de responder em 5 min | NAR / MIT |
| **US$ 0,015 → 0,20** | post no X sem link → com link: 13× mais caro | rate card X API, 2026 |
| **35% vs 15%** | conversão lead→visita com WhatsApp respondendo em <1 min | dados BR, 2026 |
| **9 conversas / US$ 29,6** | resultado do case multicanal de 14 dias (simulado e rotulado) | `docs/11` |

---

## Avisos

- **Preços e SKUs de modelo mudam a cada trimestre.** Toda cifra de API aqui é ordem de grandeza verificada em nov/2026, não contrato.
- **Simulações estão rotuladas como simulações** ao longo dos documentos. Casos reais têm fonte citada.
- **Regras de subreddit e leis mudam.** `rules.yaml` e a seção de compliance têm data de verificação e devem ser reconferidos antes de operar.
- Nada aqui é aconselhamento jurídico. FTC, CONAR, LGPD, TCPA e COFECI exigem validação com profissional da sua jurisdição.

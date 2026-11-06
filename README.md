# blogmaster — Dossiê Grok × Canais

Meta-pesquisa e dois estudos de mercado sobre **usar um bot Grok para vender** em dois mercados — *affiliate marketing* e *real estate* — começando pelo Reddit (Fase 1) e expandindo para os 20 maiores canais da internet (Fase 2): X, Instagram, WhatsApp, Facebook, TikTok, YouTube, LinkedIn, Telegram, Threads, Bluesky, Nextdoor, Google Business e e-mail.

Inclui o motor em Python, o validador de canal que impede ban, o setup técnico de cada API, custos/CPL/ROI por canal e dois pilotos com critérios de corte.

> **Regra que atravessa tudo:** o bot pesquisa e redige. **Quem publica é o humano.** Automação de postagem, fazenda de contas e "plantar" recomendação para IA são o caminho mais rápido para ban permanente — e estão fora do escopo por decisão, não por falta de capacidade técnica.

---

## Comece por aqui

| Você quer… | Abra |
|---|---|
| Ler o site navegável | `site/index.html` (ou rode o preview) |
| Entender o que a plataforma Grok faz e custa | [`docs/00-metapesquisa-grok.md`](docs/00-metapesquisa-grok.md) |
| O estudo de afiliados (unit economics, cases) | [`docs/01-estudo-afiliados.md`](docs/01-estudo-afiliados.md) |
| O estudo imobiliário (Goiânia + EUA) | [`docs/02-estudo-real-estate.md`](docs/02-estudo-real-estate.md) |
| Operar: prompts, custo, rotina | [`docs/03-playbook-grok.md`](docs/03-playbook-grok.md) |
| As 11 rotas do Reddit comparadas | [`docs/04-rotas-reddit.md`](docs/04-rotas-reddit.md) |
| Executar em 90 dias / piloto de 14 | [`docs/05-plano-90-dias.md`](docs/05-plano-90-dias.md) |
| Não tomar ban nem processo | [`docs/06-compliance.md`](docs/06-compliance.md) |
| **Fase 2** — onde o bot vende em cada rede | [`docs/07-canais-2026.md`](docs/07-canais-2026.md) |
| **Fase 2** — como setar o bot em cada canal | [`docs/08-setup-tecnico.md`](docs/08-setup-tecnico.md) |
| **Fase 2** — custo, CPL e ROI por canal | [`docs/09-custos-roi.md`](docs/09-custos-roi.md) |
| **Fase 2** — os 6 banimentos reais | [`docs/10-riscos-compliance.md`](docs/10-riscos-compliance.md) |
| **Fase 2** — case de 14 dias, 5 canais | [`docs/11-case-multicanal.md`](docs/11-case-multicanal.md) |
| Rodar o código | [`grok-reddit-ops/README.md`](grok-reddit-ops/README.md) |

---

## Estrutura

```
docs/                    os 12 documentos do dossiê (fonte da verdade)
site/                    site estático gerado (13 páginas, busca, sumário)
tools/build_site.py      gerador: markdown → site
grok-reddit-ops/         motor em Python (zero dependências)
  ├── src/               radar, scribe, weekly, cliente xAI, fontes de dados
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

# Fase 2 — matriz de canais e o validador que impede ban
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

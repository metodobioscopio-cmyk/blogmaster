# 🖼️ 11 — CRIATIVOS VISUAIS PRONTOS (capas, mockups e anúncios)

> Tudo aqui foi **gerado por script**, com tipografia real (DejaVu) — nada de texto torto ou "quebrado" de IA.
> Gerador: `tools/gerar_marketing.py` · Saída: `projeto-4-infoprodutos/marketing/`
> Rodar de novo: `python3 tools/gerar_marketing.py` (16 s, sem dependências além de Pillow)

---

## 1. O que foi gerado

| Pasta | Arquivo | Formato | Onde usar |
|---|---|---|---|
| `capas/` | `capa-vol1-ia.jpg/.png` … `capa-vol4-energia.jpg/.png` | **1600×2560** | Capa do produto (Kiwify/Cakto/Hotmart), **KDP** (1600×2560 é o exigido pela Amazon), Etsy, Gumroad, header das páginas |
| `_teste-miniatura/` | `capa-volX-150px.png` | 150×240 | **Teste dos 3 segundos**: veja se ainda se lê nesta largura. Se não ler, refaça |
| `mockups/` | `volX-1-livro-em-pe.jpg` | 1600×2000 | Página de venda, e-mail, anúncio estático |
| | `volX-2-aberto-por-dentro.jpg` | 1800×1300 | "Olha por dentro": prova de que existe conteúdo |
| | `volX-3-tablet-e-celular.jpg` | 1800×1500 | Dizer que é digital sem dizer "é digital" |
| | `volX-4-kit-bonus.jpg` | 1800×1400 | Mostrar que vem planilha + checklist |
| | `kit-completo-5-hero.jpg` | 2240×1500 | **Hero do combo** (4 volumes) — a imagem mais importante para vender o pacote |
| `anuncios/` | `volX-feed-1080x1350.jpg` | 1080×1350 | Meta Ads feed / Instagram |
| | `volX-story-1080x1920.jpg` | 1080×1920 | Stories, Reels (capa), TikTok, Shorts |
| | `volX-pinterest-1000x1500.jpg` | 1000×1500 | Pinterest (volumes 3 e 4, que é onde o Pinterest vende) |
| | `kit-combo-feed/story` | 1080×1350 · 1080×1920 | Campanha do combo R$ 127 |

## 2. Identidade (por que as 4 capas parecem da mesma casa)

- **Coleção "VIDA EM ORDEM"** no topo + `VOL. X` — estimula colecionar e vender o combo.
- **Barra de acento** no topo e no rodapé, com a cor de apoio de cada volume.
- **Selo de promessa** (pílula com número): 200 prompts · plano de 60 dias · 120 receitas · 21 dias.
- **Ícone próprio** desenhado por código: chip com raio · gráfico com seta · panela com cesto · sol com lua.
- **Faixa final:** `VOL. X · VIDA EM ORDEM` + `PDF + EPUB + BÔNUS`.
- Paletas: V1 `#1B2A4A`/`#00A98A` · V2 `#0E3B2E`/`#B58A0F` · V3 `#5A1F0E`/`#F2A93B` · V4 `#1E2A5A`/`#E8B65A` (as mesmas dos PDFs).

⚠️ **Divergência consciente do arquivo 07:** o 07 previa roxo `#2C1E5A` e verde-menta `#00E0B8` para os volumes 4 e 1. O que foi publicado nos PDFs é `#1E2A5A`/`#E8B65A` e `#1B2A4A`/`#00A98A`. As capas seguem **os PDFs** — capa e miolo têm de bater. Se quiser voltar ao 07, é trocar 2 linhas no gerador.

## 3. Anúncios: casando criativo × copy do arquivo 09

Cada imagem foi feita para um gancho específico. Regra: **o gancho do criativo tem de aparecer na primeira dobra da página de venda.**

| Arquivo | Gancho no criativo | Oferta na imagem | Copy do arquivo 09 para usar no corpo |
|---|---|---|---|
| `vol1-ia-feed` | "O prompt certo faz em 15 minutos o que você faz em 3 horas" | 200 prompts em português + 12 automações | Texto principal **versão B (ângulo tempo)** |
| `vol2-dividas-feed` | "15 scripts prontos para negociar suas dívidas" | plano de 60 dias + calculadora | Texto **A** |
| `vol3-airfryer-feed` | "Jantar para 3 por menos de R$ 25 na airfryer" | 120 receitas com custo por porção | Texto **B (ângulo economia)** |
| `vol4-energia-feed` | "15 minutos por dia, 21 dias para organizar suas noites e manhãs" | protocolo S.O.N.O. + rastreador + áudios | Texto **A** |
| `kit-combo-feed` | "Os 4 pilares da sua vida" | combo R$ 127 (avulso R$ 188) | E-mail do 7º dia (arquivo 08) |
| `*-story` | o mesmo gancho, recortado para 9:16 | idem | use como capa do Reels/TikTok |
| `*-pinterest` | faixa de preço/economia | cardápio de 30 dias / rastreador | pin com link direto para a página |

**Estrutura de cada criativo:** cabeçalho da coleção → capa 3D do livro em cena realista → gancho em 2-3 linhas → oferta em 1-2 linhas → botão "QUERO POR R$ 47" → "7 dias de garantia · acesso imediato" → rodapé de compliance.

**Rodapé de compliance (já embutido):**
- Volumes 2 e 4: *"Material educacional. Não substitui avaliação profissional."*
- Volumes 1 e 3: *"Material educacional · resultados variam por aplicação."*
- Nenhuma imagem afirma condição do leitor, não tem antes/depois, não tem pessoas, não tem número de renda ou peso.

## 4. Como usar (checklist de publicação)

1. **Capas:** subir o `.jpg` na plataforma (Kiwify/Cakto/Hotmart aceitam JPG; KDP exige 1600×2560 — já está nesse tamanho). O `.png` é para quando a plataforma pede transparência/qualidade máxima.
2. **Teste da miniatura:** abra `_teste-miniatura/` e olhe de longe. Precisa dar para ler a promessa e o número. (Passou nos 4.)
3. **Página de venda:** use nesta ordem — `kit-completo-5-hero` (topo) → `volX-1-livro-em-pe` → `volX-2-aberto-por-dentro` → `volX-4-kit-bonus` → `volX-3-tablet-e-celular` → depoimentos.
4. **Meta Ads:** suba 4 criativos por produto (`volX-feed`, `volX-story`, `volX-4-kit-bonus`, `kit-combo-feed`) e deixe rodar 4-7 dias antes de julgar.
5. **Pinterest:** publique os `pinterest-1000x1500` dos volumes 3 e 4 com 5-10 pins/dia por 60 dias.
6. **Etsy/Gumroad (EN):** reuse `volX-1-livro-em-pe` + `volX-2-aberto-por-dentro`; a listagem do Etsy aceita 10 fotos.
7. **Thumbnail de vídeo (YouTube):** corte o `story` em 1280×720 com o gancho à esquerda — o texto já está na metade superior.

## 5. O que as imagens NÃO fazem (e como resolver)

- **Não são fotos de comida reais.** As cenas (mesa, airfryer, quarto, pilha de livros) são geradas por IA e servem como **fundo**; a capa e todo o texto são desenhados por código. Quando você tiver as fotos dos pratos do Volume 3, troque os arquivos `marketing/_cenas/cena-airfryer.jpg` e rode o gerador de novo.
- **Não há foto de pessoa.** É proposital: evita "antes e depois", evita insinuar condição pessoal e evita direito de imagem.
- **Não há depoimento com nome** (o arquivo 08 pede 3 provas com nome e número). Isso só entra depois de venda real, com autorização — está na lista de pendências.

## 6. Páginas de venda (HTML) — geradas junto

`projeto-4-infoprodutos/paginas/` · gerador: `tools/gerar_paginas.py`

| Arquivo | O que é |
|---|---|
| `index.html` | hub da coleção: os 4 volumes + oferta do combo R$ 127 |
| `livro-1.html` … `livro-4.html` | uma página de venda por volume, com a copy do arquivo 08 |

- Cada página é **um único arquivo** (~600 KB): CSS embutido, imagens em base64, JSON-LD de produto, barra de compra fixa no celular, FAQ em `<details>` e rodapé de compliance.
- Sem CDN, sem fonte externa, sem JavaScript de terceiros — funciona até aberta direto do disco.
- Marcadores a trocar antes de publicar: `SUBSTITUIR-LINK-CHECKOUT-*`, `SUBSTITUIR-LINK-BUMP-*`, `SUBSTITUIR-LINK-UPSELL-*`, `SUBSTITUIR-EMAIL-DE-SUPORTE`, `SUBSTITUIR-RAZÃO-SOCIAL`, `SUBSTITUIR-URL-PUBLICA-*` (og:image).
- **Não há depoimentos** — há um bloco comentado no HTML mostrando exatamente onde colá-los, depois de venda real com autorização.

## 7. Áudios do Volume 4 (dentro do produto)

`projeto-4-infoprodutos/livro-4/audios/` · montagem: `tools/retoque_audios.py`

| Faixa | Duração | Pausas longas (>8 s) | Uso |
|---|---|---|---|
| `01-respiracao-guiada.mp3` | 5 min 12 s | 2 de ~10 s | ao deitar |
| `02-soltar-o-dia.mp3` | 7 min 04 s | 4 | quando a cabeça liga na cama |
| `03-foco-para-comecar.mp3` | 7 min 56 s | 5, a maior de 80 s | antes da tarefa difícil |
| `04-sol-da-manha.mp3` | 10 min 11 s | **14, a maior de 39 s** | acompanha os 10 minutos de luz |

O script mostra cada pausa usada e reescreve os arquivos finais. O **roteiro** (com as marcas `[pausa 30-60 s]`) está no bônus do livro, para quem quiser regravar com voz humana.

## 8. Regenerar / editar

```bash
python3 tools/gerar_marketing.py                # tudo
python3 tools/gerar_marketing.py --somente capas # só as capas
```
Para mudar texto, cor ou promessa: edite a lista `LIVROS` no topo de `tools/gerar_marketing.py` (um bloco por volume: promessa, título, subtítulo, bullets, selo, cores, gancho do anúncio).

> 📌 **Nota de honestidade:** a capa do Volume 3 diz "120 receitas com custo por porção" e o selo diz "inclui tempo, temperatura e custo por porção". Não escrevemos "testadas" porque as 120 receitas ainda precisam ser testadas de verdade antes de você vender — está na lista de pendências. Assim que testar, o selo pode virar "120 receitas testadas" (basta trocar 1 linha do gerador).

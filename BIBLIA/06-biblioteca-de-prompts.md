# 06 · Biblioteca de Prompts — os 15 geradores

> Todos os prompts abaixo funcionam nas **versões gratuitas** do ChatGPT, Gemini e Claude.
> No app, eles são preenchidos automaticamente com os seus dados (nicho, palavra-chave, produto, estilo, link) — aqui estão na versão manual, para usar quando quiser.

---

## 6.0 Regras de prompting que fazem a diferença

**As 7 regras que separam um prompt que gera lixo de um que gera trabalho pronto:**

1. **Dê um papel específico.** "Atue como estrategista sênior de SEO para Pinterest com 8 anos de experiência" > "me ajude com Pinterest".
2. **Diga o contexto do Pinterest 2026.** Sem isso a IA devolve conselho de 2021. Cite: buscador visual, pin fresco, 2:3, título de 40-60 caracteres.
3. **Peça formato de saída exato.** "Tabela com 4 colunas: | # | Título | Caracteres | Gatilho |". Sem formato definido, você recebe texto que não dá para usar.
4. **Proíba explicitamente o que não quer.** "Sem encurtador, sem promessa de saúde, sem CAIXA ALTA, sem emoji excessivo."
5. **Peça autocrítica.** "No final, aponte o pior item da sua própria lista e por quê." Isso melhora a qualidade de tudo acima.
6. **Peça para perguntar antes de inventar.** "Se faltar informação, PERGUNTE em vez de inventar." Reduz muito a alucinação.
7. **Itere em vez de recomeçar.** Se a saída está 80% boa, responda: *"Melhore os itens 3, 7 e 9 seguindo as regras 2 e 4. Mantenha o resto igual."*

**Três truques extras:**
- **Peça em inglês o que é técnico** (prompts de imagem, termos de fotografia) e em português o que é copy. Os modelos de imagem respondem muito melhor em inglês.
- **Peça 10 e use 3.** Volume de opções vence a busca pela opção perfeita.
- **Peça a versão "crua" e a versão "refinada"** do mesmo texto. Compare.

---

## 6.1 PROMPT 1 — Máquina de Nichos
**Quando usar:** Etapa 1, antes de qualquer coisa.
**O que fazer com a saída:** escolher 3 candidatos → validar demanda na busca guiada (cap. 03) → escolher 1.

```
Atue como estrategista sênior de pesquisa de mercado.

Gere 12 nichos de Pinterest monetizáveis em 2026 e que eu consiga produzir
100% com ferramentas de IA GRÁTIS.

PARA CADA NICHO, ENTREGUE UMA TABELA COM:
1. Nome do nicho (específico, nunca "lifestyle")
2. Três sub-nichos com intenção real de busca
3. Demanda estimada no Pinterest (Alta/Média/Baixa) e POR QUÊ
4. Ticket médio e o caminho de monetização mais provável
5. Dificuldade de produção com IA (Fácil/Médio/Difícil) e qual ferramenta grátis encaixa
6. Uma palavra-chave long-tail para atacar no dia 1
7. O maior risco desse nicho

REGRAS
- Nunca use palavra genérica: seja hiperespecífico.
- Escreva para humano; dados apenas quando forem verificáveis.
- Ordene os 12 do melhor para o pior em oportunidade para um iniciante sem verba.
- No fim, escolha o TOP 3 e justifique em 2 linhas cada.
- Depois me pergunte: qual dos 3 eu quero validar hoje?
```

---

## 6.2 PROMPT 2 — Caçador de Ofertas
**Quando usar:** Etapa 2, com o nicho já escolhido.
**O que fazer com a saída:** validar cada oferta nos 12 critérios (cap. 04) → aprovar 1 principal + 2 secundárias.

```
Atue como especialista em programas de afiliados e compliance para Pinterest.

Liste 10 ofertas concretas (programas de afiliado ou produtos digitais próprios)
que eu consiga promover no Pinterest neste nicho:
[NICHO] / [SUB-NICHO] / [PÚBLICO]

PARA CADA OFERTA, ENTREGUE:
1. Nome da oferta + plataforma onde está cadastrada
2. Tipo: afiliado (infoproduto/físico/SaaS/recorrente) ou produto próprio
3. Comissão e condições de pagamento
4. Janela de cookie
5. Permite link direto no Pinterest? (Sim/Não/Incerto — e se Não, qual o caminho)
6. Faixa de preço e comissão por venda em reais
7. É categoria proibida no Pinterest? (arma, tabaco, adulto, aposta etc.)
8. Meu veredito honesto: viável / viável com página de destino / evitar

Ordene por (comissão por venda × confiança do produtor) ÷ atrito de produção.

FECHE COM:
- As 3 melhores para um iniciante
- As 2 que eu devo evitar e por quê
- Um bloco único, pronto para copiar, com as perguntas que devo fazer ao
  gerente de afiliados antes de divulgar
```

---

## 6.3 PROMPT 3 — Máquina de Ângulos ⭐ (o mais importante)
**Quando usar:** Etapa 3. É este prompt que transforma 1 keyword em 10 pins diferentes.
**O que fazer com a saída:** marcar 3 a 5 ângulos e produzir.

```
Atue como estrategista de conteúdo viral para Pinterest.

Transforme UMA palavra-chave em 10 ângulos de pin completamente diferentes.

PALAVRA-CHAVE: [SUA KEYWORD LONG-TAIL]
NICHO: [NICHO]  |  PRODUTO: [OFERTA]  |  PÚBLICO: [PÚBLICO]

PARA CADA ÂNGULO, ENTREGUE:
1. Nome do formato (Lista / Erro / Transformação / Cola / Mito / Orçamento /
   Rotina / Comparativo / Caminho do iniciante / Antes-Depois)
2. Título da ideia do pin, com 5 a 8 palavras (é o texto do overlay)
3. Gatilho emocional usado (curiosidade / alívio / aspiração / medo de perder
   dinheiro / status)
4. Estilo visual que encaixa (light & bright / bold tipográfico / top-down /
   lifestyle / checklist infográfico / grade numerada / antes-depois / mockup)
5. A promessa exata que o pin faz
6. Tipo de página de destino (oferta de afiliado / artigo / produto / isca)

REGRAS
- Os 10 precisam ser realmente diferentes, não versões reescritas do mesmo.
- Não use mais de 5 hashtags, sem encurtador, sem promessa de saúde ou renda.
- Mantenha tudo no MESMO IDIOMA da palavra-chave.
- Termine com uma tabela ordenando os 10 por facilidade de produção com IA
  grátis versus potencial de save.
```

> 💡 **Por que este é o prompt mais importante:** o top 1% dos pins puxa mais de 50% das impressões. Você não acerta o pin vencedor — você **aumenta a chance de produzir ele**. Dez ângulos diferentes é dez bilhetes de loteria no lugar de um.

---

## 6.4 PROMPT 4 — Fábrica de Pins (1 ângulo → 5 pins completos)
**Quando usar:** Etapa 5 e Etapa 9, em lote.
**O que fazer com a saída:** cada pin vira uma linha do seu pack; importe no app ou na sua planilha.

```
Atue como copywriter, especialista em SEO de Pinterest e engenheiro de prompt.

Pegue UM ângulo de pin e produza um pacote COMPLETO, pronto para publicar,
com 5 pins (o Pinterest premia pin fresco — 5 designs diferentes valem mais
que 1 design perfeito).

ÂNGULO: [ÂNGULO]
NICHO: [NICHO] | KEYWORD: [KEYWORD] | OFERTA: [OFERTA]
ESTILO VISUAL: [ESTILO]

PARA CADA UM DOS 5 PINS, ENTREGUE EXATAMENTE NESTE FORMULÁRIO:

PIN nº
- TÍTULO (40 a 60 caracteres, com a palavra-chave, sem promessa mentirosa):
- DESCRIÇÃO (2 a 4 linhas naturais, keyword + 1 sinônimo, com CTA suave):
- ALT TEXT (máx. 200 caracteres, descrevendo a imagem):
- TEXTO DO OVERLAY (5 a 8 palavras, bold, legível no tamanho de thumbnail):
- PROMPT DA IMAGEM (em inglês, ver regras abaixo):
- NOME DO ARQUIVO (palavra-chave-com-hifens.png):
- BOARD SUGERIDO:
- HASHTAGS (máx. 5):

REGRAS DO PROMPT DE IMAGEM
- Comece sempre pelo estilo visual: "[ESTILO]"
- Descreva: sujeito, ação, cenário, iluminação, cores, composição e o espaço
  negativo para o texto.
- Composição vertical 2:3 (1000x1500). Deixe o terço superior limpo.
- NUNCA peça texto dentro da imagem (o texto entra depois, no Canva).
- Sem logo, sem marca real, sem rosto de celebridade, sem mão deformada.
- Escreva em INGLÊS (os modelos de imagem respondem melhor em inglês),
  mesmo que a copy esteja em português.

REGRAS
- Os 5 pins devem diferir em: ângulo do título, composição visual e fundo —
  não apenas em palavras.
- Termine com a ordem de publicação recomendada em 5 boards diferentes.
```

---

## 6.5 PROMPT 5 — Validador de Visual
**Quando usar:** Etapa 4, antes de gerar as imagens.
**O que fazer com a saída:** escolher 1-2 estilos para a conta e usar a ficha de execução no Canva.

```
Atue como diretor de arte especializado em criativos de Pinterest que convertem,
com conhecimento dos dados de benchmark de 2026.

CONTEXTO
Nicho: [NICHO] | Sub-nicho: [SUB] | Público: [PÚBLICO]
Estilo escolhido: [ESTILO]
Oferta: [OFERTA]

ENTREGUE 4 SAÍDAS

SAÍDA 1 · DIAGNÓSTICO DE ESTILO
Diga se o estilo escolhido combina com este nicho e público. Se não, aponte as
2 melhores alternativas. Baseie-se em: 2:3 vertical (+45% impressões, +22%
cliques vs quadrado); overlay de 5-8 palavras em bold (+110% cliques vs sem
texto); fundo claro/quente (+38% saves); pessoa em contexto (+14% impressões);
borda grossa (-9% impressões).

SAÍDA 2 · 3 PROMPTS DE IMAGEM (em inglês, prontos para colar)
Três abordagens visuais diferentes para a MESMA mensagem. Cada prompt com:
sujeito + ação + cenário + direção da luz + paleta + composição + onde fica o
espaço negativo + proporção 2:3 + "no text, no logos, no watermark" + termos
de qualidade. Cada um com 60 a 90 palavras.

SAÍDA 3 · FICHA DE EXECUÇÃO NO CANVA
- Par de fontes gratuitas no Canva
- Paleta exata em hexadecimal (fundo, texto, destaque)
- Tamanho relativo da caixa de texto e margem de segurança (8-10%)
- 3 regras de consistência para 50 pins

SAÍDA 4 · LISTA DE MORTE
6 erros visuais que fariam esses pins fracassarem NESTE nicho.

Seja opinativo: escolha um favorito dos três e defenda em 2 linhas.
```

---

## 6.6 PROMPT 6 — Laboratório de Títulos
**Quando usar:** quando um pin não performa e você quer testar variações.
**O que fazer com a saída:** publicar o top 3 como pins frescos diferentes.

```
Atue como redator de headlines para Pinterest.

Escreva 20 títulos diferentes para o MESMO pin e depois ranqueie.

CONTEXTO: [NICHO] | KEYWORD: [KEYWORD] | OFERTA: [OFERTA]
Título atual: [TÍTULO ATUAL]

REGRAS PARA CADA TÍTULO
- 40 a 60 caracteres
- Contém a palavra-chave principal de forma natural
- Promete benefício concreto ou abre lacuna de curiosidade — nunca mente
- Sem CAIXA ALTA, sem excesso de emoji (máx. 1), sem clickbait de saúde/renda

SAÍDA: tabela | # | Título | Caracteres | Gatilho usado |

DEPOIS:
1. Top 5 com justificativa de uma linha cada
2. Para o nº 1: 3 descrições alternativas de 2-4 linhas (CTAs diferentes)
3. O pior título dos 20 e por que fracassaria
4. 5 palavras-chave long-tail relacionadas para os próximos pins
```

---

## 6.7 PROMPT 7 — Página de Destino / Artigo
**Quando usar:** Etapa 7. É aqui que o link de afiliado entra — e o aviso de afiliado é obrigatório.
**O que fazer com a saída:** publicar no seu blog/Notion/Gumroad e marcar `[INSERIR LINK AQUI]`.

```
Atue como redator SEO e copywriter de conversão.

Escreva uma página de destino (ou artigo) completa que receba tráfego do
Pinterest e converta, para esta oferta.

CONTEXTO: [NICHO] | KEYWORD: [KEYWORD] | OFERTA: [PRODUTO]
PÚBLICO: [PÚBLICO]
Link de afiliado (colado manualmente depois): [LINK]

ESTRUTURA OBRIGATÓRIA
1. H1 com a palavra-chave principal (a MESMA promessa do pin)
2. AVISO DE AFILIADO visível ANTES do primeiro link de afiliado
3. Introdução curta (3-4 linhas) confirmando que o leitor está no lugar certo
4. 4 a 6 seções H2 respondendo às dúvidas reais do público
5. Uma tabela comparativa ou lista de critérios
6. Prós e contras honestos da oferta
7. FAQ com 5 perguntas (H3 + resposta de 2-3 linhas)
8. Um único CTA final, claro
9. Espaço marcado EXATAMENTE como [INSERIR LINK AQUI]

REGRAS
- Escreva como humano: parágrafos curtos, sem enrolação.
- Sem promessa irreal. Sem depoimento pessoal falso.
- 800 a 1200 palavras.
- Termine com 5 títulos de Pinterest para divulgar esta página.
```

---

## 6.8 PROMPT 8 — Roteiro de Vídeo Pin
**Quando usar:** Etapa 6, para os 20-30% de vídeo do seu mix.

```
Atue como diretor de vídeos curtos especializado em video pins do Pinterest.

CONTEXTO: [NICHO] | KEYWORD: [KEYWORD] | OFERTA: [OFERTA] | ÂNGULO: [ÂNGULO]

ENTREGUE UM ROTEIRO PLANO A PLANO para um vídeo vertical (1080x1920) de 6 a 15
segundos SEM narração (a maioria assiste sem som):

- 0-2s: GANCHO — o que precisa estar na tela para parar o scroll
- 2-6s: valor / processo / transformação
- 6-12s: a recompensa ou o "antes/depois"
- últimos 1-2s: cartela de CTA

ENTREGUE TAMBÉM
1. Textos de overlay de cada plano (máx. 6 palavras, bold, alto contraste)
2. Sugestão de trilha por clima (estilo royalty-free)
3. Como produzir cada plano DE GRAÇA (qual ferramenta, qual editor grátis)
4. Os 3 prompts de imagem (em inglês) para os quadros-chave
5. Legenda + título + 5 hashtags deste video pin
6. Instrução para a imagem de capa (o quadro do feed — precisa ter o overlay)
```

---

## 6.9 PROMPT 9 — Pin em Carrossel (5 slides)
**Quando usar:** Etapa 6, para variação de formato (10% do mix).

```
Atue como estrategista de carrossel para Pinterest.

Desenhe um carrossel de 5 slides para esta oferta.
CONTEXTO: [NICHO] | KEYWORD: [KEYWORD] | OFERTA: [OFERTA]

PARA CADA SLIDE:
- Número e função na história (gancho → contexto → prova → objeção → CTA)
- Manchete do slide (máx. 6 palavras)
- Texto de apoio (máx. 15 palavras)
- Descrição visual + prompt de imagem em inglês (2:3, 1000x1500)
- Por que este slide faz a pessoa deslizar para o próximo

ALÉM DISSO:
1. Título do carrossel (40-60 car.) e descrição do pin inteiro
2. Regra de consistência para os 5 slides parecerem da mesma família
3. Como montar no Canva grátis, passo a passo (máx. 10 passos)
4. 5 ganchos alternativos para o slide 1

O slide 5 precisa ter o CTA. Nunca coloque o link dentro da imagem.
```

---

## 6.10 PROMPT 10 — Produto Digital Próprio
**Quando usar:** Etapa 9, depois que o fluxo de afiliado já está rodando. É a via de margem 100%.

```
Atue como estrategista de produto digital.

Desenhe um produto digital que eu consiga criar HOJE com IA grátis e vender
pelo Pinterest com margem de ~100%.
CONTEXTO: [NICHO] | [SUB-NICHO] | [PÚBLICO]

ENTREGUE
1. Três ideias: um printable, um template e um mini-ebook. Para cada: nome
   exato, o que resolve, faixa de preço (R$ 27 a R$ 97) e a promessa de
   "valor imediato".
2. Escolha a melhor e detalhe:
   - Sumário completo / lista de páginas
   - O que eu gero com IA (texto) e o que eu desenho no Canva
   - Os prompts exatos, na ordem, para produzir cada parte de graça
   - Configuração de entrega na Gumroad ou Payhip (máx. 10 passos)
   - A escada de preço: isca grátis → produto principal → combo
3. Um plano de 20 pins para vender (5 ângulos × 4 designs)
4. As 5 descrições de Pinterest que mais convertem em venda de produto
5. Higiene jurídica: avisos a incluir, o que não posso prometer e como
   escrever uma licença simples para o comprador

Tudo precisa ser factível em um dia de trabalho. Sem plágio: escreva do zero.
```

---

## 6.11 PROMPT 11 — Calendário de 30 Dias

```
Atue como planejador de conteúdo de Pinterest.

Monte um calendário de publicação de 30 dias.
CONTEXTO: [NICHO] | [KEYWORD] | Ofertas: [1 principal + 2 secundárias]

ENTREGUE UMA TABELA:
| Dia | Título do pin | Ângulo | Formato | Board | Destino | Pronto? |

REGRAS
- 3 a 5 pins por dia. Comece com 3/dia na semana 1 e escale.
- Nunca 2 pins do mesmo link no mesmo board no mesmo dia.
- Mínimo 72h entre pins do mesmo link.
- 70% evergreen e 30% ofertas/afiliado.
- Sazonal publicado 30-60 dias antes do pico.
- Mix: 60-70% estático, 20-30% vídeo, resto carrossel.
- Cada semana tem 1 dia de manutenção (escrever em lote) e 1 de revisão.

ALÉM DISSO:
1. Fluxo de produção em blocos de 1 hora (quantos pins por bloco)
2. Rotação entre 5-10 boards para nenhum parecer spam
3. O que fazer num dia sem tempo: a ação mínima viável
```

---

## 6.12 PROMPT 12 — Diagnóstico de Funil
**Quando usar:** Todo fim de mês, e obrigatoriamente quando algo travar.

```
Atue como analista de crescimento de Pinterest. Diagnostique meu funil.

MEUS NÚMEROS (últimos 30 dias)
impressões: ___ | saves: ___ | cliques de saída: ___ | sessões: ___ |
vendas: ___ | receita: R$ ___

CONTEXTO: [NICHO] | [KEYWORD] | [OFERTA] | [ESTILO]

TAREFA
1. Calcule CTR (cliques/impressões), taxa de save por 1k, conversão
   (vendas/cliques) e receita por 1.000 impressões.
2. Compare com: CTR de saída 0,3%-1%; save 5+/1k em estático; conversão
   0,5%-2%; vídeo +185% impressões mas 3x menos cliques que estático.
3. Aponte O MAIOR vazamento (um só) e ranqueie os outros.
4. Para cada vazamento, 3 correções concretas por ordem de impacto/esforço.
5. Diga claramente: ESCALAR, PIVOTAR ou MATAR? Justifique.
6. Plano exato da próxima semana: o que produzir, quantos, formato, destino.
7. Os 3 números que devo acompanhar semanalmente e qual valor me faria
   comemorar versus entrar em pânico.
```

---

## 6.13 PROMPT 13 — Perfil e Boards

```
Atue como otimizador de perfil de Pinterest.

Monte a estrutura inteira da minha conta.
CONTEXTO: [NICHO] | [PÚBLICO] | [MARCA]

ENTREGUE
1. Nome da conta (máx. 40 caracteres) combinando marca + palavra-chave
2. Bio (máx. 160 caracteres) com palavras-chave e uma promessa clara
3. 8 boards: título exato (palavra-chave primeiro), descrição (2 linhas com
   keywords) e o que entra em cada um
4. Ordem dos boards (mais importante primeiro) e qual destacar
5. Quais 3 boards eu NÃO devo criar (boards-armadilha que diluem a conta)
6. Instruções para reivindicar (claim) o site e por que importa
7. Regras de foto de perfil e capa para parecer confiável no nicho
8. Checklist de 10 itens antes de publicar o primeiro pin
```

---

## 6.14 PROMPT 14 — Auditoria de Compliance
**Quando usar:** antes de escalar e sempre que receber um aviso.

```
Atue como auditor de compliance para marketing de afiliados no Pinterest.
Audite meu conteúdo antes de eu escalar.

MATERIAL PARA AUDITAR
Título: [TÍTULO]
Descrição: [DESCRIÇÃO]
Link de destino: [LINK]
Categoria da oferta: [CATEGORIA]

AUDITE CONTRA ESTAS REGRAS
- Link de afiliado é permitido, MAS deve estar revelado e agregar valor original.
- Encurtadores (bit.ly, tinyurl) são bloqueados/marcados.
- Sem padrão repetitivo e spam de afiliado; volume diário importa.
- Alguns programas proíbem link direto a partir de redes (Etsy é o exemplo).
- Categorias proibidas: arma, tabaco, conteúdo adulto, aposta, alegação
  enganosa de saúde ou de finanças.
- Transparência publicitária: a relação comercial deve estar clara e perto do link.

ENTREGUE
1. Tabela de risco: | Regra | Situação (OK/Risco/Bloqueio) | Correção exata |
2. Uma descrição reescrita que seja compliant E ainda converta
3. A frase exata de aviso para o pin e para a página de destino
4. Lista de tudo que devo parar de fazer imediatamente
5. Autoauditoria de 10 perguntas para rodar todo mês
6. O que fazer se a conta receber um aviso: plano de recuperação passo a passo
```

---

## 6.15 PROMPT 15 — Pacote de 10 Prompts de Imagem
**Quando usar:** Etapa 4, para produzir o banco de imagens de uma vez.

```
Atue como engenheiro de prompt especializado em imagens de Pinterest geradas
por ferramentas de IA grátis.

CONTEXTO: [NICHO] | [KEYWORD] | ESTILO VISUAL: [ESTILO]

Escreva 10 prompts de imagem para colar em gerador grátis
(Bing Image Creator / Microsoft Designer, Ideogram, Leonardo, Adobe Firefly).

PARA CADA PROMPT:
1. O prompt completo em INGLÊS, 60 a 90 palavras, sempre terminando com:
   "vertical 2:3 composition, clean top third for text overlay, no text,
   no watermark, no logos, no distorted hands, high resolution"
2. Por que essa imagem vence uma genérica neste nicho
3. Qual ferramenta grátis vai lidar melhor com ela e por quê

MATRIZ DE VARIEDADE — cubra: 2 close/macro, 2 plano aberto, 2 com pessoa em
contexto lifestyle (sem rosto de celebridade), 2 de processo/passo a passo,
2 aspiracionais/"depois".

Nunca peça marca reconhecível, pessoa real ou personagem protegido.
Ajuste luz e paleta ao estilo escolhido para os 10 parecerem da mesma conta.
```

---

## 6.16 Prompts de emergência (bônus)

**Quando o pin não performa:**
```
Analise este pin e me diga por que ele não performou. Contexto: [MÉTRICAS].
Considere: proporção 2:3, contraste do overlay (5-8 palavras), clareza do foco
visual, alinhamento entre promessa do título e destino, presença de keyword no
título/descrição/nome do arquivo. Entregue: os 3 problemas mais prováveis, em
ordem de probabilidade, e a correção exata de cada um.
```

**Quando você tem 15 minutos e precisa publicar algo:**
```
Me dê 3 pins de emergência para publicar hoje em 15 minutos de execução, usando
apenas: 1 imagem do meu banco, o template do Canva que eu já tenho e o texto
gerado por IA. Contexto: [NICHO] | [KEYWORD] | [OFERTA]. Entregue título,
descrição, overlay e board para cada um.
```

**Quando quer entrar em um idioma novo (inglês/espanhol):**
```
Pegue estas 10 copies em português e adapte para o inglês (não traduza ao pé da
letra — localize). Regras: título de 40-60 caracteres, keyword em inglês com
volume de busca, descrição natural de 2-4 linhas, 5 hashtags locais. Explique
brevemente cada adaptação que você fez além da tradução literal.
[COLE AS 10 COPIES]
```

---

**Próximo:** [07 · Ferramentas Grátis e Integrações](07-ferramentas-gratis.md)

# Compliance, ética e o que destrói a operação

> Este documento existe porque **a maior causa de morte de um bot de Reddit não é técnica, é uma remoção**. Aqui estão as regras que realmente são aplicadas, com data de verificação, e o mapa do que é permitido, do que é zona cinzenta e do que é ban na certa.

---

## 1. Reddit — as três camadas de regra

### Camada 1: política global (sitewide)

| Regra | O que diz | Como se aplica a você |
|---|---|---|
| **Spam** | Proíbe postar repetidamente conteúdo próprio, conteúdo repetitivo em massa para exposição/ganho financeiro, e uso de bots/IA que facilitem proliferação de spam | Sem copy-paste entre subs; sem volume automatizado |
| **Manipulated Content** | Proíbe conteúdo gerado por IA que "se apresenta como gerado por humano"; pede rótulo de divulgação de IA | Reescreva na sua voz; não finja experiência que não teve |
| **Impersonation** | Proíbe se passar por outra pessoa/marca | Uma identidade real; sem "cliente fake" |
| **Disrupting Communities** | Proíbe manipulação de voto, votos coordenados e evasão de ban | Nunca peça upvote; nunca crie conta após ban |
| **Rótulo `[App]`** (política de 25/03/2026) | Conta que usa automação em modo permitido deve usar o rótulo | **Seu bot não posta — então essa regra é sobre monitoramento e perfis automatizados** |
| **Self-promotion** | Diretriz de ~9:1: no máximo ~10% da atividade própria | Trate como piso; operadores longevos rodam 19:1 ou 95:5 |

**Números de enforcement (2026):** ~23 milhões de views de spam bloqueadas/dia; ~2 milhões de votos inautênticos revogados/dia; ~100 mil contas automatizadas removidas/dia; ~25 mil posts/comentários spam novos detectados/dia.

### Camada 2: regra do subreddit (sempre prevalece)

Dados de 64 comunidades que fundadores usam: **34% proíbem autopromoção**, **23% permitem apenas sob 9:1**, **2% acolhem**. Muitos exigem conta com 30+ dias e 100+ karma. Em 2026, `r/SaaS` e `r/startups` endureceram (categoria banida, 1 post/60 dias).

**Regra operacional:** a regra do sub é a lei. Se ela proíbe link, não existe "mas meu caso é diferente". A saída é o perfil (rota 5) ou o anúncio (rota 7).

### Camada 3: AutoModerator (a aplicação real)

O AutoModerator remove **silenciosamente** — você acha que publicou, e ninguém vê. Regras típicas: karma mínimo, idade da conta, palavras proibidas ("DM", "check my", "free trial"), link domains bloqueados, flair obrigatória.

**Como testar se você foi removido:** abra a thread em janela anônima/deslogado. Se seu comentário não aparece, foi removido.

---

## 2. Disclosure — o que é obrigatório e onde

### EUA — FTC, 16 CFR Part 255 (revisão 2023, enforcement pleno em 2026)

| Situação | O que fazer |
|---|---|
| Link de afiliado em texto | Disclosure **no topo**, antes do link, linguagem simples e inequívoca |
| Vídeo | Divulgação **no vídeo**, em áudio e/ou texto — não só na descrição |
| Conteúdo gerado por IA | **Mesma obrigação** de conteúdo humano (explícito desde jul/2026) |
| Testemunho/resultado | Adicionar contexto de que resultados variam; não implicar independência se há comissão |
| Redes que recrutam criadores | Responsabilidade solidária desde 2026 |

**Frases que funcionam:** *"I earn a commission if you buy through this link."* / *"This is an ad for [Produto], and I get paid if you sign up."*
**Frases que não funcionam:** "partner", "sp", "thanks to [marca]", hashtag perdida no meio de outras, aviso só no rodapé.

### Brasil — CONAR, Guia vigente em 01/06/2026 + Lei 15.325/2026

| Situação | O que fazer |
|---|---|
| Link de afiliado / cupom | **É publicidade.** Identificar com `#publi`/`#publicidade` **ou** selo da plataforma |
| Posição | **Primeiro plano**, visível sem clicar em "mais" |
| Vídeo | No início ou no momento da recomendação, em texto **e** áudio |
| Post de "recebidos" | Categoria "mensagem ativada": mencionar que o produto veio da marca |
| Conteúdo com IA | Regras valem integralmente |
| Responsabilidade | Anunciante e agência também respondem |

### Imobiliário — CRECI/COFECI

| Regra | Aplicação |
|---|---|
| Nome registrado + "corretor de imóveis" + CRECI (PF) / CRECI-J (PJ) | Bio, posts, anúncios, artes |
| Número do CRECI ≥ 25% do tamanho do nome | Peças publicitárias |
| Autorização escrita do proprietário | Antes de anunciar qualquer imóvel |
| Veracidade de metragem, valor, condições | Sem exceção |
| Nome fantasia registrado | Antes de usar marca |

---

## 3. Contato e dados — a parte que gera processo

### LGPD (Brasil)

| Requisito | Na prática |
|---|---|
| Base legal | Consentimento (art. 7º, I) ou execução de contrato (art. 7º, V) |
| Consentimento específico | Nomear empresa, canal (WhatsApp/e-mail) e forma de saída |
| Opt-in rastreável | Data, hora, origem, texto exato — registrar no CRM |
| Lista comprada | **Sem base legal. Não existe uso legítimo.** |
| Retenção | Prazo definido; apagar inativo |
| Compartilhamento | Informar parceiros no termo |
| Revogação | Gratuita e imediata |

### TCPA (EUA) — status em nov/2026

| Item | Status |
|---|---|
| Consentimento prévio escrito para texto marketing | **Exigido** |
| Regra *one-to-one consent* | **Vacada** em 24/01/2025 (11º Cir.); nunca entrou em vigor — desconfie de guias que dizem "vale em jan/2026" |
| Revogação por qualquer meio razoável | **Ativa** desde 11/04/2025; 10 dias úteis; 7 palavras mínimas |
| *Revocation-all* (opt-out vale para todos os canais) | Adiada para **31/01/2027** |
| Do Not Call aplicado a texto | Ativo |
| Multa | US$ 500–1.500 **por mensagem** |

::: alerta
**Regra dura do inbound:** quem comentou numa thread deu consentimento para você responder **ali**. Não deu consentimento para WhatsApp, e-mail ou DM. A migração de canal exige convite explícito da pessoa ("pode me chamar no zap?") e registro desse convite com data.
:::

---

## 4. Zona cinzenta: o que é tecnicamente possível e eticamente indefensável

| Prática | Por que parece funcionar | Por que não fazer |
|---|---|---|
| Plantar 13 palavras em comentário para virar recomendação de IA | Estudo de Cornell (2026) mostra que basta 1 comentário | É manipulação de conteúdo; Reddit caça; o ganho dura semanas e o ban é permanente |
| Contas múltiplas "cliente satisfeito" | Cria prova social falsa | Violação de impersonation + manipulação; ban em rede |
| Pedir upvote em grupo | Acelera o post | Voto coordenado = ban de conta e de IP |
| Reescrever review de IA como "usei por 6 meses" | Copy fácil | Violação de Manipulated Content + FTC (testemunho falso) |
| Comprar lista de leads | Volume imediato | LGPD sem base legal; TCPA US$ 500–1.500/msg |
| Seeded subreddit com 20 threads fake | Parece comunidade | Precedente de 2026: comunidades removidas em bloco |
| Ferramenta que posta sozinha | "Escala" | Automação de postagem sem rótulo + spam = ban; e o texto é sempre pior |

**Teste de sanidade (use antes de qualquer tática):** *Se um moderador lesse seu histórico completo e seu extrato bancário lado a lado, você teria vergonha?* Se sim, não faça.

---

## 5. Checklist de publicação (imprima e deixe ao lado)

**Antes de postar:**
- [ ] Li a regra do sub **hoje**.
- [ ] A resposta ajuda mesmo sem a oferta.
- [ ] Todo número tem fonte e data.
- [ ] Não estou apresentando texto de IA como experiência pessoal.
- [ ] Se há menção comercial, o disclosure está visível antes do link.
- [ ] Não há link onde o sub proíbe.
- [ ] Não há promessa de renda ou resultado garantido.
- [ ] Se é imóvel: CRECI visível + autorização do proprietário + dados exatos.
- [ ] Se vou migrar para WhatsApp: a pessoa pediu, e eu registrei.

**Depois de postar:**
- [ ] Abri deslogado para confirmar que não fui removido.
- [ ] Respondi todos os comentários nas primeiras 2 h.
- [ ] Registrei no painel (resposta, clique, conversa).
- [ ] Marquei a thread para revisitar em 7 dias.

---

## 6. Plano de crise (quando a conta toma remoção ou ban)

| Situação | Primeira ação | Segunda ação | O que **não** fazer |
|---|---|---|---|
| Comentário removido | Ler a regra citada | Reescrever e, se injusto, modmail educado | Repostar igual |
| Ban de sub | Aceitar; não discutir | Pedir desculpa por modmail, uma vez | Criar conta nova para burlar |
| Shadowban (sem views) | Testar deslogado | Pausar 30 dias, remover links, reduzir volume | Continuar postando (agrava) |
| Ban de conta | Avaliar o que causou | Recomeçar com outra identidade **real** e outra estratégia | Voltar com o mesmo comportamento |
| Reclamação pública no sub | Responder em público, sem defensiva, corrigindo o fato | Oferecer solução | Apagar e fugir (piora) |

**Ativo insubstituível = conta com histórico.** É por isso que a estratégia do dossiê sacrifica velocidade em troca de longevidade. Uma conta de 2 anos com 3 mil karma vale mais que 10 contas novas que durarão 4 dias.

---

## 7. O que este dossiê deliberadamente **não** ensina

1. Criar fazenda de contas.
2. Automatizar postagem/voto em massa.
3. Raspar o Reddit contra os termos.
4. Plantar recomendação para IA.
5. Inventar depoimento ou resultado.
6. Comprar seguidores, karma ou lista.
7. "Contornar" regra de sub com sinônimo.

Não é pudor: cada item acima tem **retorno decrescente e risco crescente**. A conta que sobrevive é o ativo; a tática que a queima é passivo.

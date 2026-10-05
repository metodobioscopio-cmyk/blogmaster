# GOLDEN PROMPT LIBRARY — 52 prompts para o Growth Stack
### Growth Design Pro · Kit de Ferramentas · Português do Brasil

---

## Como usar esta biblioteca

**O que são estes prompts.** Instruções estruturadas para transformar a saída das 6 APIs do stack em
trabalho entregável: diagnóstico lido, pauta definida, copy revisada, página otimizada e distribuição
planejada. Nenhum deles substitui o dado que vem da API — todos assumem que você já rodou a chamada.

**A regra do contexto antes da pergunta.** Um prompt sem dado real produz texto genérico, e texto genérico
não vende. Sempre cole no campo de contexto: URL analisada, score retornado, trecho da página, público e
oferta. Se você não tem esse dado, a resposta certa não é improvisar — é rodar a API primeiro.

**Marcação.** `[ENTRE COLCHETES]` é campo obrigatório que você preenche. Tudo o que não está entre colchetes
pode ser usado como está.

**Onde usar.** Todos funcionam em ChatGPT, Claude, Gemini ou Cursor/Claude Code. Os prompts de agente
(§6) foram escritos para ferramentas com acesso a arquivos e terminal.

**Revisão humana antes de publicar.** Toda saída de IA passa por três perguntas antes de virar página
publicada: (1) isto é verdade? (2) isto é verificável? (3) isto soa como a marca do cliente? Se qualquer
resposta for "não", reescreva.

---

## Índice

| Seção | Prompts | Para quê |
|---|---|---|
| §1 | 01–06 | Extração de design system (Vibe Design) |
| §2 | 07–12 | Diagnóstico: SEO, conversão e concorrente |
| §3 | 13–20 | Produção de conteúdo e copy |
| §4 | 21–26 | Landing page e conversão |
| §5 | 27–32 | Social e amplificação |
| §6 | 33–38 | Orquestração com agentes de IA |
| §7 | 39–46 | Estratégia, proposta e monetização |
| §8 | 47–52 | Qualidade, ética e conformidade |

---

# §1 — Extração de Design System (Vibe Design)

> Feed de entrada: saída da **Website Data Extraction API** (meta tags, texto, links, estrutura) mais
> descrição visual do site. Sem a API, cole o texto e o HTML relevante manualmente.

## 01. Extração completa de design system
**Quando usar:** primeiro passo de qualquer projeto novo, antes de abrir o editor de código.
**Objetivo:** virar tokens CSS a partir da leitura de um site de referência.

```
Você é um designer de sistemas sênior especializado em engenharia reversa de design systems.

Analise os dados abaixo, extraídos de [URL], e produza um design system REUTILIZÁVEL — não um comentário estético.

<dados>
[META TAGS, TEXTO, ESTRUTURA E LINKS — colar saída da API de Extração]
</dados>

<observacao_visual>
[DESCREVA OU COLE O QUE SE VÊ: cores predominantes, tipos de letra, densidade, uso de borda e sombra]
</observacao_visual>

Devolva, nesta ordem:

## 1. Conceito (2 frases)
Qual é a ideia central do site e que sensação ele persegue.

## 2. Paleta
6 cores em HEX com a FUNÇÃO de cada uma: fundo, texto principal, texto secundário, acento, linhas/bordas,
estado (sucesso/erro). Se não for possível inferir com segurança, escreva "não inferível".

## 3. Tipografia
Famílias aparentes e classificação (serifada/sem serifa/mono), pesos prováveis, relação de escala entre
título e corpo, tracking percebido. NUNCA afirme o nome exato da fonte: classifique.

## 4. Espaçamento
Unidade-base estimada (4 ou 8 px) e ritmo geral: denso, médio ou arejado. Justifique com um exemplo.

## 5. Forma
Padrões de raio, uso de borda e uso de sombra (nenhuma / sutil / dramática).

## 6. Movimento
O que se move, quão rápido, com que propósito. Se não houver evidência, escreva "não observável".

## 7. Layout
Largura de conteúdo provável, número de colunas, uso de assimetria.

## 8. Tom de voz
5 adjetivos, cada um com um trecho curto do site como evidência.

## 9. O que NÃO copiar
3 características que funcionam apenas naquele contexto e não devem ser levadas para outro projeto.

## 10. Tokens
Bloco CSS completo de `:root` com todos os tokens acima, nomeados semanticamente
(`--paper`, `--ink`, `--accent`, `--fs-h1`, `--s-4`, `--r-md`, `--dur`).

RESTRIÇÕES: não descreva pixel que você não pode ver; não invente nome de fonte; não reproduza texto literal
do site com mais de 8 palavras; não use emoji.
```

## 02. Extração de paleta com verificação de contraste
**Quando usar:** quando precisa garantir acessibilidade antes de propor as cores ao cliente.

```
A partir das cores abaixo, organize uma paleta funcional e VERIFIQUE o contraste.

Cores observadas: [LISTE OS HEX QUE VOCÊ PERCEBEU]
Contexto de uso: [SITE INSTITUCIONAL / E-COMMERCE / APP / LANDING PAGE]
Tom desejado: [SOBRIEDADE / ENERGIA / LUXO / TÉCNICO]

Entregue uma tabela com: | token | hex | função | contraste sobre o fundo | aprovado em AA? |

Regras:
- Pares texto/fundo usados em corpo de texto precisam de 4.5:1 ou mais.
- Pares usados só em títulos grandes podem ficar em 3:1.
- Se um par reprovar, proponha o ajuste mínimo de luminosidade que o aprova e mostre o novo hex.
- Termine com o bloco `:root` pronto para colar.

NÃO invente cores que não derivem das observadas sem deixar claro que são novas.
```

## 03. Escala tipográfica fluida
**Quando usar:** ao definir títulos e corpo de um sistema novo, para não criar 15 tamanhos soltos.

```
Construa uma escala tipográfica fluida (clamp) para um design system.

Contexto: [TIPO DE PROJETO] · densidade [DENSA/MÉDIA/AREJADA] · leitura principal em [MOBILE/DESKTOP]
Famílias: display [FAMÍLIA] · texto [FAMÍLIA] · mono [FAMÍLIA]
Referência de comportamento: quero que o título do herói ocupe [X]% da tela no celular e [Y]% no desktop.

Entregue:
1. Tabela: | token | papel | tamanho mínimo | tamanho máximo | clamp() | line-height | tracking |
2. O bloco `:root` correspondente.
3. Três recomendações de combinação (display × texto) que funcionam juntas.
4. Um alerta sobre o que NÃO fazer com essa escala (ex.: usar display em parágrafo, tracking negativo em
   texto claro, linha acima de 75 caracteres).

Máximo de 9 níveis. Não crie um token para cada tamanho imaginável.
```

## 04. Ritmo de espaçamento e densidade
**Quando usar:** quando o layout parece "solto demais" ou "apertado demais" e você não sabe por quê.

```
Diagnostique o ritmo de espaçamento descrito e proponha uma escala.

Descrição do layout atual: [COMO OS ELEMENTOS ESTÃO DISTRIBUÍDOS — seções, cards, margens, respiro interno]
Problema percebido: [EX.: tudo parece apertado / há buracos estranhos entre seções]
Contexto: [TIPO DE PROJETO] · público [PÚBLICO]

Entregue:
1. Diagnóstico: qual é a incoerência (unidades mistas? espaçamento sem relação entre si?).
2. Escala de 8 a 12 passos baseada em [4/8] px, com nome semântico e uso típico.
3. Regra de espaçamento VERTICAL entre blocos (quanto vale um título→texto, texto→botão, seção→seção).
4. Bloco `:root` pronto.
5. Uma única regra de ouro, em uma frase, que o time possa memorizar.
```

## 05. Movimento e interação
**Quando usar:** para definir animação com propósito, evitando site que "pula" em tudo.

```
Defina a linguagem de movimento de um design system.

Contexto: [TIPO DE PROJETO] · personalidade [CALMA/ÁGIL/SOLENE/BRINCALHONA]
Elementos que se movem: [MENU, HOVER DE BOTÃO, CARDS, MODAL, SCROLL REVEAL]

Para cada elemento, entregue uma linha da tabela:
| elemento | gatilho | duração | curva | deslocamento/opacidade | propósito |

Regras:
- Duração entre 100ms (feedback) e 700ms (revelação). Nada acima de 700ms.
- Toda animação precisa ter um propósito declarado: orientar, confirmar ou revelar.
- Nada de animação que atrase a leitura ou bloqueie o clique.
- Entregue o CSS das curvas e uma versão para `prefers-reduced-motion: reduce`, que desliga o movimento.
```

## 06. Tom de voz a partir de amostra
**Quando usar:** antes de gerar copy, para que o conteúdo não soe genérico.

```
Extraia o tom de voz a partir das amostras abaixo e converta em instrução operacional.

<amostras>
[TEXTO DO SITE OU DE MATERIAIS DA MARCA — mínimo 300 palavras]
</amostras>

Público: [PÚBLICO] · Segmento: [SEGMENTO] · Objetivo: [OBJETIVO]

Entregue:
1. Cinco adjetivos de voz, cada um com o trecho da amostra que o comprova.
2. Tabela "dizemos / não dizemos" com 6 pares de frases (uma do jeito da marca, uma do jeito errado).
3. Lista de palavras que a marca usa e lista de palavras que a marca evita.
4. Um parágrafo de referência (80 palavras) escrito nessa voz sobre [TEMA].
5. Instruções negativas: 4 coisas que um redator não pode fazer nessa voz.

Não use clichês de marketing ("soluções inovadoras", "excelência", "sinergia") a não ser que apareçam na amostra.
```

---

# §2 — Diagnóstico: SEO, Conversão e Concorrente

> Feed de entrada: **AI SEO Analysis API** (score + recomendações), **AI Conversion Optimization API**
> e **Website Data Extraction API** (dados do concorrente).

## 07. Tradução do score de SEO em plano de trabalho
**Quando usar:** imediatamente após rodar a API de SEO, para não deixar a recomendação no papel.

```
Você é um analista de SEO técnico. Abaixo está a saída bruta da análise de SEO da página [URL].

<analise>
[COLAR A SAÍDA COMPLETA DA API DE SEO — score, dimensões e recomendações]
</analise>

Contexto do negócio: [NEGÓCIO] · palavra-chave principal: [PALAVRA] · concorrente direto: [CONCORRENTE]

Converta isso em plano de trabalho:

## 1. Leitura do score
Explique o score geral em uma frase e identifique as 2 dimensões que mais derrubam a nota. Se o score por
dimensão não estiver na saída, diga que não é possível analisar por dimensão em vez de estimar.

## 2. Matriz de priorização
| # | Achado | Impacto (alto/médio/baixo) | Esforço (horas) | Depende de | Prazo |

## 3. Plano de 30 dias
Semana 1 / Semana 2 / Semana 3 / Semana 4 — cada semana com no máximo 4 tarefas e um critério de conclusão
verificável ("meta description reescrita nas 8 páginas principais com a palavra-chave no início", não
"melhorar SEO").

## 4. O que NÃO fazer
Liste 3 recomendações que costumam ser feitas nesse tipo de análise e que NÃO valem o esforço aqui, com o
motivo.

## 5. Como medir de novo
Que URL rodar na API, em quanto tempo e o que comparar.

RESTRIÇÃO: não prometa posição no Google, prazo de ranqueamento nem volume de tráfego.
```

## 08. Análise comparativa de concorrente
**Quando usar:** fase de pesquisa do funil (Módulo 3.1).

```
Compare a minha página com a do concorrente, usando APENAS os dados abaixo.

<minha_pagina url="[URL]">
[SAÍDA DA EXTRAÇÃO + SCORE DE SEO]
</minha_pagina>

<concorrente url="[URL]">
[SAÍDA DA EXTRAÇÃO + SCORE DE SEO]
</concorrente>

Nicho: [NICHO] · Oferta: [OFERTA] · Público: [PÚBLICO]

Entregue:
1. Tabela comparativa: | dimensão | minha | concorrente | leitura |
   Dimensões: título/meta, estrutura de headings, profundidade de conteúdo, prova social, chamada para ação,
   sinais de confiança, clareza da oferta.
2. As 3 lacunas que eu posso fechar em 30 dias — com o que fazer em cada uma.
3. As 3 vantagens que eu já tenho e que o cliente deveria saber.
4. Uma pauta de conteúdo de 5 títulos que exploram as lacunas encontradas, cada um com a intenção de busca
   (informacional, comparativa, transacional).
5. O que o concorrente faz melhor e que eu NÃO deveria imitar, explicando por quê.

Baseie-se apenas nos dados fornecidos. Onde faltar dado, escreva "sem dado suficiente".
```

## 09. Auditoria de conversão por ordem de impacto
**Quando usar:** após a API de Conversion Optimization, para sequenciar as correções.

```
Leia a análise de conversão abaixo e ordene as correções por impacto real no resultado.

<analise_conversao>
[COLAR SAÍDA DA API DE CONVERSION OPTIMIZATION]
</analise_conversao>

Contexto: [TIPO DE NEGÓCIO] · ticket médio [VALOR] · volume de tráfego mensal [VISITAS]
Objetivo da página: [LEAD / VENDA / AGENDAMENTO / CADASTRO]

Entregue:
1. As 5 correções de maior impacto, na ordem, cada uma com: o que mudar, onde, por que isto importa para
   ESTE negócio, e como saber se funcionou.
2. Separe as correções em "mexer hoje" (até 2 h) e "projeto" (mais de 1 dia).
3. Identifique se algum problema apontado é, na verdade, sintoma de um problema anterior — por exemplo,
   botão ruim quando o que falta é clareza na oferta.
4. Um aviso honesto: se o tráfego mensal for baixo demais para medir o efeito de um teste, diga isso e
   proponha alternativa (pesquisa com usuário, teste de 5 segundos, análise heurística).

NÃO recomende testes A/B quando o volume não permite significância estatística em menos de 4 semanas.
```

## 10. Diagnóstico de formulário
**Quando usar:** quando a página tem tráfego mas não gera contato.

```
Diagnostique o formulário abaixo focando em abandono.

<dados>
Campos: [LISTE OS CAMPOS E SE SÃO OBRIGATÓRIOS]
Onde ele está na página: [ACIMA DA DOBRA / MEIO / FINAL / MODAL]
Oferta em troca do preenchimento: [OFERTA]
Fricção relatada: [O QUE OS USUÁRIOS DIZEM, SE HOUVER]
</dados>

Entregue:
1. Cada campo avaliado: essencial, útil ou removível hoje — com justificativa de negócio.
2. Microcopy sugerido para: rótulo, texto de apoio, placeholder, mensagem de erro e texto do botão.
3. Percepção de risco: liste 3 objeções prováveis no momento de preencher e onde neutralizá-las na tela.
4. Ordem recomendada dos campos e por quê.
5. Uma versão alternativa de 3 campos, se aplicável, com o texto pronto.

RESTRIÇÃO: nunca sugira coletar dado sensível sem necessidade; nunca recomende prometer "sem spam" como
principal sinal de confiança.
```

## 11. Auditoria de sinais de confiança
**Quando usar:** antes de investir em tráfego.

```
Avalie os sinais de confiança da página descrita.

<pagina url="[URL]">
Conteúdo textual: [COLE O TEXTO PRINCIPAL]
Elementos visuais citados: [DEPOIMENTOS, LOGOS, SELOS, FOTOS, CERTIFICADOS, NÚMEROS]
</pagina>

Setor: [SETOR] · Ticket: [VALOR] · Nível de hesitação esperado: [BAIXO/MÉDIO/ALTO]

Entregue:
1. Inventário: para cada sinal presente, classifique a força real (forte, fraco, decorativo).
2. O que falta para este setor e este ticket específicos.
3. Um "kit mínimo de confiança" que pode ser produzido em uma semana, com o que pedir ao cliente.
4. Sinais que só funcionam se forem verdadeiros — e que por isso NÃO devem ser inventados.
5. Onde inserir cada sinal na página, em ordem, e por quê.

Nunca sugira contador de escassez falso, número de compradores inventado ou prazo aparente que reinicia.
```

## 12. Relatório de diagnóstico para o cliente
**Quando usar:** entrega do tier "Diagnóstico" do pacote Site Exponencial.

```
Escreva um relatório de diagnóstico de 2 páginas para o cliente [NOME DO CLIENTE], a partir dos dados.

<dados>
Score de SEO: [SCORE] · Score de conversão: [SCORE]
Principais achados: [LISTE 5 A 10 ACHADOS REAIS]
Concorrente analisado: [URL E ACHADOS]
</dados>

Tom: direto, profissional, sem jargão. O leitor é dono de negócio, não é técnico.

Estrutura:
1. Situação em uma frase (o que está funcionando e o que está travando).
2. Os números: score atual, o que eles significam na prática (não explique a metodologia, explique a consequência).
3. Três problemas prioritários, cada um com: impacto no negócio, causa provável e correção.
4. O que já está bom e deve ser mantido.
5. Plano de 30 dias, em tabela, com entrega e critério de sucesso.
6. Onde o concorrente está à frente e o risco concreto disso.

RESTRIÇÃO: sem promessa de resultado. Toda afirmação precisa estar ancorada nos dados fornecidos. Se algo
não foi medido, escreva "não medido" em vez de estimar.
```

---

# §3 — Produção de Conteúdo e Copy

> Feed de entrada: **AI Website Copywriter API** + diagnóstico de SEO. Estes prompts fazem a revisão
> editorial que a API não faz.

## 13. Title tags e meta descriptions em escala
**Quando usar:** após gerar titles/metas, para revisar e padronizar antes de publicar.

```
Revise e padronize os títulos e descrições abaixo.

<paginas>
[COLE UMA LINHA POR PÁGINA: url | title proposto | meta proposta | palavra-chave alvo]
</paginas>

Marca: [MARCA] · Tom: [TOM] · Palavra-chave principal do site: [PALAVRA]

Entregue uma tabela: | url | title final | caracteres | meta final | caracteres | palavra-chave | observação |

Regras:
- Title: até 60 caracteres, com a palavra-chave o mais à esquerda que fizer sentido, sem keyword stuffing.
- Meta: entre 140 e 158 caracteres, escrita para ser CLICADA, não para descrever a página.
- Nada de título duplicado entre páginas.
- Nenhuma promessa que a página não cumpre.
- Se o title e a meta propostos estiverem idênticos em duas páginas, sinalize.

Depois, liste as 3 páginas com maior potencial de tráfego que ainda não têm conteúdo e proponha o title de
cada uma.
```

## 14. Página completa a partir do diagnóstico
**Quando usar:** fase de conteúdo (Módulo 3.2).

```
Escreva o conteúdo completo de uma página, a partir de dados reais de diagnóstico.

<briefing>
URL da página: [URL] · Objetivo único: [OBJETIVO]
Público: [PÚBLICO] · Dor principal: [DOR]
Oferta: [OFERTA] · Diferencial verificável: [DIFERENCIAL]
</briefing>

<diagnostico>
[COLE ACHADOS DE SEO E DE CONVERSÃO — as recomendações específicas]
</diagnostico>

<voz>
[COLE AS INSTRUÇÕES DE TOM DE VOZ — prompt 06]
</voz>

Entregue:
1. Estrutura da página em blocos, com o objetivo de cada bloco.
2. O texto de cada bloco, pronto para publicação: eyebrow, título, subtítulo, corpo, CTA.
3. A FAQ da página com 5 perguntas que tiram objeção real de compra (não perguntas decorativas).
4. Uma versão alternativa de headline para teste.
5. O que ficou de fora de propósito, e por quê.

Aplique explicitamente as recomendações do diagnóstico — se alguma não puder ser atendida no texto (ex.:
falta de prova social), liste na seção 5.
Para cada afirmação sobre o produto, só use o que estiver no briefing. Se faltar informação, escreva
"[CONFIRMAR COM O CLIENTE: ...]" em vez de inventar.
```

## 15. Headlines por ângulo (com teste)
**Quando usar:** quando a headline atual não está performando e você precisa de hipóteses.

```
Gere 10 headlines para a página [URL], em 5 ângulos diferentes (2 cada).

<contexto>
Oferta: [OFERTA] · Público: [PÚBLICO] · Dor: [DOR] · Resultado desejado: [RESULTADO]
Restrições: [EX.: SEM PROMETER PRAZO, SEM SUPERLATIVO]
</contexto>

Ângulos: dor, resultado, mecanismo único, prova, provocação.

Para cada headline, entregue: | # | ângulo | headline | caracteres | hipótese testada | risco |

Regras:
- Máximo 12 palavras por headline.
- Toda headline precisa conter uma informação concreta (número, prazo, mecanismo ou público).
- Proibido: "revolucionário", "segredo", "você não vai acreditar", "garantido".
- Nenhuma headline pode afirmar resultado que não seja verificável.

No fim: escolha as 2 melhores para testar primeiro e explique o critério de escolha em duas frases.
```

## 16. Reescrever por intenção de busca
**Quando usar:** quando a página ranqueia mas não converte, ou converte mas não ranqueia.

```
Reescreva o trecho abaixo para casar com a intenção de busca, sem perder capacidade de conversão.

<trecho>
[COLE O TEXTO ATUAL — 150 a 400 palavras]
</trecho>

Palavra-chave: [PALAVRA] · Intenção dominante: [INFORMACIONAL / COMPARATIVA / TRANSACIONAL]
Posição atual no resultado de busca: [POSIÇÃO, SE SOUBER] · Público: [PÚBLICO]

Entregue:
1. Diagnóstico: a página está respondendo à intenção dominante ou a uma intenção secundária?
2. Reescrita do trecho, preservando o que funciona.
3. Mudanças de estrutura recomendadas (headings, ordem dos argumentos).
4. O CTA adequado à intenção: uma página informacional não deve vender no primeiro parágrafo.
5. Três perguntas reais que quem busca essa palavra-chave ainda tem e que o texto não responde.

Não insira a palavra-chave mais vezes do que soa natural. Densidade não é estratégia.
```

## 17. CTA — variações e onde colocar
**Quando usar:** quando a página tem tráfego e o clique no botão é baixo.

```
Trabalhe a chamada para ação da página [URL].

Contexto: objetivo [OBJETIVO] · o que o visitante recebe [OFERTA] · nível de compromisso [BAIXO/MÉDIO/ALTO]
CTA atual: [TEXTO ATUAL] · Fricção percebida: [EX.: "parece que vou receber spam"]

Entregue:
1. 8 textos de botão em primeira pessoa e 8 neutros, com o grau de compromisso de cada um.
2. A recomendação principal e a razão da escolha para ESTE público.
3. Quatro pontos de inserção na página, com a versão de CTA adequada a cada ponto e o momento do visitante.
4. O microtexto abaixo do botão: o que reduz o medo do clique.
5. Três razões pelas quais os CTAs anteriores podem estar falhando, com evidência no contexto fornecido.

Não use "Clique aqui", "Enviar" nem "Saiba mais" como CTA principal. Nada de urgência falsa.
```

## 18. Microcopy de interface
**Quando usar:** ao entregar a página pronta para o desenvolvedor.

```
Escreva o microcopy completo da interface abaixo.

Fluxo: [EX.: formulário de orçamento em 2 etapas]
Tom: [TOM] · Público: [PÚBLICO] · Marca: [MARCA]

Para cada elemento, entregue o texto final:
- rótulos de campo e textos de apoio
- placeholder (apenas quando ajuda, nunca repetindo o rótulo)
- mensagens de erro (uma por tipo: campo vazio, formato inválido, dado já cadastrado, falha do servidor)
- estado de carregamento, estado vazio e estado de sucesso
- texto do botão em cada etapa e texto do botão de voltar

Regras: erro nunca culpa o usuário; sucesso confirma o próximo passo; nada de "Ops!";
toda mensagem de erro precisa dizer o que fazer para corrigir.
```

## 19. E-mail de captura alinhado à página
**Quando usar:** para transformar o CTA da página em lista.

```
Escreva uma sequência de 3 e-mails de captura, alinhada à oferta abaixo.

<oferta>
Material oferecido: [MATERIAL] · Público: [PÚBLICO] · Dor: [DOR]
Página onde o lead entrou: [URL] · O que ele acabou de ler: [RESUMO]
</oferta>

E-mail 1 — entrega imediata (assunto, corpo curto, um único próximo passo).
E-mail 2 — 24 h depois (aprofunda o problema, apresenta o mecanismo, sem vender ainda).
E-mail 3 — 72 h depois (convite, com a oferta, o que está incluído, o preço e uma objeção respondida).

Para cada e-mail: assunto (até 50 caracteres), pré-header, corpo de até 200 palavras, CTA único.
RESTRIÇÃO: sem escassez falsa, sem "última chance" se não for a última, sem promessa de resultado.
```

## 20. Biblioteca de conteúdo a partir de uma página
**Quando usar:** para multiplicar um ativo já otimizado em vários formatos.

```
Transforme o conteúdo da página abaixo em uma biblioteca de 12 peças.

<pagina url="[URL]">
[COLE O TEXTO COMPLETO]
</pagina>

Objetivo: [OBJETIVO] · Público: [PÚBLICO] · Canal principal: [CANAL]

Entregue, em tabela | # | formato | título/gancho | canal | esforço (baixo/médio/alto) | observação |:
- 3 posts sociais (um por ângulo: dado, opinião, passo a passo)
- 2 e-mails
- 2 seções de FAQ para a própria página
- 1 roteiro de vídeo curto de 60 segundos (com marcação de tempo)
- 1 carrossel de 6 telas (título de cada tela)
- 1 checklist derivado
- 1 comparativo
- 1 atualização da página principal com o que aprendermos

Não repita o mesmo gancho em formatos diferentes: cada peça precisa de um ângulo próprio.
```

---

# §4 — Landing Page e Conversão

> Feed de entrada: **AI Landing Page Optimizer API** + dados de comportamento reais, quando existirem.

## 21. Auditoria de headline e primeira dobra
**Quando usar:** imediatamente após rodar o otimizador de landing page.

```
Analise a primeira dobra da página [URL] segundo os dados abaixo.

<primeira_dobra>
Headline atual: [...]
Subheadline: [...]
Elemento visual: [DESCRIÇÃO]
CTA: [...]
Sinais de confiança visíveis: [...]
</primeira_dobra>

Público: [PÚBLICO] · Oferta: [OFERTA] · Origem do tráfego: [ANÚNCIO/ORGÂNICO/E-MAIL]

Responda:
1. Em 5 segundos, o visitante entende: o que é, para quem é, o que ele ganha e o que fazer? (sim/não por item)
2. Adequação da mensagem à origem do tráfego: a promessa bate com o que ele clicou?
3. Três substituições de headline, da mais conservadora à mais agressiva, com o risco de cada uma.
4. O que remover da primeira dobra (elementos que competem com a decisão).
5. A ordem ideal dos elementos acima da linha de dobra.

Seja direto sobre o que está ruim. Elogio não ajuda o cliente.
```

## 22. Reestruturação do caminho de conversão
**Quando usar:** em páginas longas com queda no meio do caminho.

```
Reestrutura a ordem dos blocos da página, com base no objetivo e no comportamento observado.

<blocos_atuais>
[LISTE OS BLOCOS NA ORDEM ATUAL, COM UMA LINHA DE DESCRIÇÃO CADA]
</blocos_atuais>

Objetivo: [OBJETIVO] · Origem do tráfego: [ORIGEM] · Nível de consciência: [NÃO SABE QUE TEM O PROBLEMA /
SABE DO PROBLEMA / COMPARA SOLUÇÕES / PRONTO PARA COMPRAR]
Onde as pessoas param: [DADO REAL, SE HOUVER]

Entregue:
1. Nova ordem dos blocos, com a razão de cada mudança em uma linha.
2. O que remover e o que fundir.
3. Os 3 momentos onde a página deveria pedir a ação, e com que peso.
4. Um bloco que falta hoje e que o nível de consciência exige.
5. Se o nível de consciência for "não sabe que tem o problema", explique por que vender direto falha e o
   que fazer em vez disso.
```

## 23. Hipóteses de teste com critério de decisão
**Quando usar:** quando há tráfego suficiente para testar sem achismo.

```
Monte um plano de testes para a página [URL].

Dados: [VISITAS/MÊS] · [TAXA DE CONVERSÃO ATUAL] · [CONVERSÃO ALVO]
Meta: [META DE NEGÓCIO] · Restrição de tempo: [PRAZO]

Entregue, em tabela | # | hipótese (se... então... porque...) | elemento | métrica primária | amostra
necessária | duração estimada | critério de decisão |:
1. Cinco hipóteses ordenadas por impacto esperado.
2. Cálculo honesto da amostra necessária para cada uma.
3. AVISO: se o volume atual não permitir resultado confiável em 4 semanas, diga isso e ofereça métodos
   alternativos (teste de 5 segundos, heurística, entrevista, análise de gravação de sessão).
4. O que fazer com o resultado: manter, descartar, iterar.
5. Uma decisão de "nunca testar" — algo que deve ser corrigido por princípio, não por teste.

Não recomende declarar vitória antes de atingir a amostra. Não use "o teste é contínuo" como desculpa.
```

## 24. Quebra de objeções na página
**Quando usar:** quando o tráfego é bom e a conversão é baixa por hesitação.

```
Mapeie e trate as objeções de compra da página [URL].

Oferta: [OFERTA] · Preço: [PREÇO] · Público: [PÚBLICO] · Concorrentes: [QUEM MAIS O CLIENTE CONSIDERA]
O que os interessados perguntam hoje: [PERGUNTAS REAIS RECEBIDAS]

Entregue:
1. As 8 objeções mais prováveis, classificadas em: preço, confiança, adequação, tempo, esforço, comparação.
2. Para cada uma: onde ela surge na jornada, o que a página diz hoje (cite) e o que deveria dizer.
3. A objeção principal e o bloco que deve resolvê-la, com o texto pronto.
4. Três informações que faltam ao cliente para poder responder e que ele precisa levantar.
5. Uma objeção que NÃO deve ser respondida na página, por ser sinal de público errado.
```

## 25. Diagnóstico de queda no meio da página
**Quando usar:** quando o mapa de calor mostra abandono em determinado ponto.

```
Interprete estes dados de comportamento e diga o que provavelmente está acontecendo.

<dados>
Ordem dos blocos: [LISTA]
Tempo médio na página: [TEMPO] · Rolagem média: [%]
Ponto de maior saída: [BLOCO]
Fontes de tráfego: [ORIGENS]
Dispositivo predominante: [MOBILE/DESKTOP]
</dados>

Entregue:
1. Três hipóteses para a saída naquele ponto, da mais provável à menos.
2. Que dado adicional confirmaria ou derrubaria cada hipótese.
3. O ajuste de menor esforço que testa a hipótese principal.
4. Se houver sinais de problema de performance ou de legibilidade em mobile, aponte antes de mexer em copy.
5. Uma hipótese que parece verdadeira mas costuma ser falsa (ex.: "é longo demais") e o dado que a resolve.

Se os dados forem insuficientes para concluir, diga isso com clareza em vez de improvisar uma explicação.
```

## 26. Comparativo com a página do concorrente
**Quando usar:** para justificar preço em reunião com cliente.

```
Compare minha landing page com a do concorrente [URL DO CONCORRENTE].

<minha> [HEADLINE, BLOCOS NA ORDEM, OFERTA, PREÇO, PROVAS] </minha>
<dele>  [HEADLINE, BLOCOS NA ORDEM, OFERTA, PREÇO, PROVAS] </dele>

Público: [PÚBLICO] · Decisão de compra do público: [RACIONAL/EMOCIONAL]

Entregue:
1. Tabela: | critério | minha página | concorrente | quem ganha | 
   Critérios: clareza da promessa, velocidade de compreensão, tratamento de objeção, prova, facilidade de
   contato, percepção de preço.
2. Dois pontos em que o concorrente é melhor e o que fazer a respeito nesta semana.
3. Dois pontos em que ele é pior e que devem ser EXPLICITADOS na minha página.
4. Uma frase de posicionamento que aproveita a fraqueza dele sem citá-lo pelo nome.
5. O que eu NÃO devo copiar dele, e por quê.
```

---

# §5 — Social e Amplificação

> Feed de entrada: **AI Social Media Content Generator API**. Todos estes prompts ensinam a revisar a
> saída da API para o tom da marca, porque a API otimiza por plataforma, não por voz.

## 27. Post para X/Twitter
```
Escreva 5 posts para X a partir do conteúdo abaixo.

<fonte>
[COLE O TRECHO DA PÁGINA OU O ARTIGO]
</fonte>

Marca: [MARCA] · Objetivo: [TRÁFEGO/AUTORIDADE/CONVERSA] · Link: [URL]

Cada post precisa ter, em até 260 caracteres:
- um gancho na primeira linha que funcione sem contexto
- uma informação concreta (dado, número, contraste)
- um fechamento que convide à resposta ou ao clique

Entregue em tabela: | # | ângulo | post | caracteres |
Ângulos: dado surpreendente, erro comum, antes/depois, opinião contrária, passo prático.

Regras: sem hashtag em excesso (máx. 1), sem "thread 🧵" se não for thread, sem emoji decorativo.
Não use a mesma abertura em dois posts.
```

## 28. Post para LinkedIn
```
Escreva 2 posts de LinkedIn a partir do material abaixo.

<material> [CONTEXTO, DADOS, APRENDIZADO, HISTÓRIA] </material>
Autor: [NOME/CARGO DA PESSOA QUE POSTA] · Público: [PÚBLICO PROFISSIONAL] · Objetivo: [OBJETIVO]

Formato de cada post:
- primeira linha: a frase que aparece antes do "ver mais" (até 140 caracteres)
- desenvolvimento: 4 a 6 parágrafos curtos, um por ideia
- fechamento: pergunta genuína OU convite, nunca os dois

Um post com viés de dado (o que medimos e o que descobrimos), outro com viés de experiência pessoal.
Nada de "concorda?" como fechamento, nada de emoji em excesso, nada de história inventada.
Se faltar história pessoal real no material, escreva [SUGESTÃO: relatar uma situação concreta do projeto].
```

## 29. Legenda para Instagram
```
Crie 3 legendas para Instagram a partir do conteúdo abaixo.

<conteudo> [TEMA E CONTEXTO] </conteudo>
Perfil: [PERFIL] · Objetivo: [SALVAR/COMPARTILHAR/COMENTAR/CLICAR NO LINK] · Tom: [TOM]

Cada legenda: gancho de 1 linha, corpo de até 120 palavras com quebras, CTA específico, 8 a 12 hashtags
misturando volume alto, médio e de nicho.

Também entregue: o conceito visual de cada post em uma frase (o que aparece na imagem) e o texto que
deveria estar escrito DENTRO da arte.

Nada de "link na bio" quando o objetivo não for clique. Nada de hashtag genérica sem relação com o nicho.
```

## 30. Calendário de 30 dias
```
Monte um calendário editorial de 30 dias para [MARCA], a partir do conteúdo já existente.

Ativos disponíveis: [LISTE PÁGINAS/ARTIGOS/PRODUTOS]
Canais: [CANAIS] · Frequência por canal: [FREQUÊNCIA] · Objetivo do mês: [OBJETIVO]
Equipe disponível: [HORAS/SEMANA]

Entregue uma tabela com 30 linhas: | dia | canal | formato | ângulo | título/gancho | ativo de origem |
CTA | esforço |

Regras:
- Não repita o mesmo ângulo em menos de 7 dias.
- 70% conteúdo útil, 20% prova/autoridade, 10% oferta direta.
- Distribua o esforço: no máximo 20% das peças podem ser de produção nova.
- Marque com ⚑ as peças que dependem de aprovação do cliente.
Depois do calendário: liste as 3 peças que você apostaria mais alto, com o porquê.
```

## 31. Uma fonte, quatro plataformas
```
Adapte o conteúdo abaixo para X, LinkedIn, Instagram e Facebook — respeitando o comportamento de cada
canal, não apenas cortando o mesmo texto.

<conteudo> [COLE A PÁGINA OU O ARTIGO] </conteudo>
Marca: [MARCA] · Objetivo: [OBJETIVO] · Link: [URL]

Para cada canal, entregue: | canal | formato (texto/carrossel/vídeo curto) | abertura | corpo | CTA |
especificidade do formato |

Regras por canal:
- X: ideia única, corte cirúrgico, conversa.
- LinkedIn: contexto profissional, primeira linha forte, sem hashtag decorativa.
- Instagram: visual primeiro, legenda que sustenta a arte, CTA de salvamento.
- Facebook: tom explicativo, link clicável, público menos técnico.

No fim: explique em 3 linhas por que o mesmo texto não serve para os quatro.
```

## 32. Reaproveitamento de conteúdo que performou
```
Analise os números abaixo e proponha o próximo ciclo.

<desempenho>
[LISTE: peça | canal | alcance | salvamentos | comentários | cliques | conversões]
</desempenho>

Objetivo: [OBJETIVO] · Período: [PERÍODO]

Entregue:
1. Leitura honesta: o que performou e o que não performou. Separe "alcance alto com pouca ação" de
   "alcance baixo com boa ação" — são diagnósticos diferentes.
2. As 3 peças que merecem reaproveitamento e em que formato.
3. As 3 que devem ser abandonadas, mesmo que tenham dado trabalho.
4. Um teste para o próximo mês baseado no que os números sugerem (não no que a equipe prefere).
5. Que métrica está sendo olhada por vaidade e deveria sair do relatório.
```

---

# §6 — Orquestração com Agentes de IA

> Para Claude Code, Cursor e agentes com acesso a arquivos e terminal. Estes prompts reduzem risco:
> agente sem contrato claro produz muito e verifica pouco.

## 33. Prompt de sistema para agente de projeto
```
Você é o agente responsável por executar o Growth Stack neste repositório.

CONTEXTO
- O arquivo de projeto em `00-PROJETO.md` é a fonte da verdade sobre identidade, método e conformidade.
- O design system está em `site/assets/css/`. Os tokens são a única fonte de valores visuais.
- Os prompts de trabalho estão em `kit/prompts/`.

REGRAS INVIOLÁVEIS
1. Nunca invente dado: se falta informação, escreva `[CONFIRMAR: ...]` e pare.
2. Nunca escreva valor de cor, tamanho ou espaçamento fora de `tokens.css`.
3. Toda alteração visual precisa rodar `python3 tools/verificar.py` e passar sem erro.
4. Nunca publique numa página texto com afirmação de resultado não verificável.
5. Antes de mexer em arquivo existente, leia-o inteiro.
6. Ao terminar uma tarefa, liste os arquivos alterados e o que não foi possível concluir.

FLUXO DE TRABALHO
1. Leia a tarefa e reformule em uma frase.
2. Liste os arquivos que vai tocar e por quê. Espere aprovação se a lista passar de 5 arquivos.
3. Execute em passos pequenos, verificando entre eles.
4. Rode a verificação e cole a saída.
5. Resuma o que mudou e o que ficou pendente.
```

## 34. Pipeline encadeado das 6 APIs (descrição para agente)
```
Implemente um pipeline que encadeia as 6 APIs do Growth Stack para uma URL de entrada.

ORDEM OBRIGATÓRIA
1. Extração → salvar em `dados/01-extracao.json`
2. SEO Analysis → `dados/02-seo.json`
3. Copywriter (alimentado pelos dados de 1 e 2) → `dados/03-copy.json`
4. Landing Page Optimizer → `dados/04-landing.json`
5. Conversion Optimization → `dados/05-conversao.json`
6. Social Generator (alimentado por 3 e 4) → `dados/06-social.json`

REQUISITOS
- Cliente único com retry exponencial (3 tentativas) e timeout de 30 s.
- Chave de API lida de variável de ambiente, nunca escrita no código.
- Cache por URL + etapa; nunca repetir chamada que já tem resultado válido em disco.
- Se uma etapa falhar, o pipeline para e informa qual etapa e qual foi o erro — não continua com dado vazio.
- Cada arquivo de saída guarda: entrada, saída, timestamp, custo estimado da chamada.

ENTREGÁVEL: `kit/codigo/js/growth-stack.js` e `kit/codigo/python/growth_stack.py`.
ANTES DE ESCREVER CÓDIGO: confirme os endpoints, parâmetros e formatos reais na documentação de cada API.
```

## 35. Agente revisor de saída
```
Você é um revisor crítico. Sua função é encontrar problema, não elogiar.

Analise a peça abaixo contra o briefing.

<briefing> [PÚBLICO, OFERTA, OBJETIVO, RESTRIÇÕES] </briefing>
<peca> [COLE O TEXTO OU A PÁGINA] </peca>
<dados> [SCORE DE SEO E DE CONVERSÃO, SE HOUVER] </dados>

Entregue, em ordem de gravidade:
1. AFIRMAÇÕES NÃO VERIFICÁVEIS — trecho literal + por que é problema.
2. PROBLEMAS DE ADEQUAÇÃO AO PÚBLICO — onde o texto fala com quem não é o comprador.
3. GENERALIDADES — frases que poderiam estar em qualquer site do setor (cite 3).
4. CONTRADIÇÕES com o briefing ou com os dados.
5. VIOLAÇÕES de restrição declarada.
6. O QUE ESTÁ BOM — só o que é específico e defensável.

Para cada item: trecho, problema, sugestão de correção.
Termine com um veredicto: APTO / APTO COM RESSALVAS / REFAZER — e a razão em uma frase.
Não amenize. Não invente elogio. Se a peça estiver boa, diga isso em uma linha e pare.
```

## 36. Depuração de falha de API
```
Um agente executou o pipeline e falhou. Ajude a descobrir a causa antes de mudar o código.

<contexto>
Etapa que falhou: [ETAPA]
Erro retornado: [MENSAGEM COMPLETA, SEM ESCONDER NADA]
Entrada enviada: [PARÂMETROS + TRECHO DO PAYLOAD]
Funcionava antes? [SIM/NÃO] · O que mudou desde então: [MUDANÇA]
</contexto>

Produza, em ordem:
1. As 5 causas mais prováveis, da mais para a menos provável, com o teste específico que confirma cada uma.
2. Qual verificação fazer PRIMEIRO (a de maior informação por minuto gasto).
3. O que NÃO fazer (ex.: aumentar timeout sem investigar, capturar exceção e seguir com dado vazio).
4. Se o erro for de limite de plano/cota, como confirmar e o que fazer.
5. Se for erro de contrato (parâmetro mudou), como descobrir o formato atual.

Não sugira reescrever o pipeline antes de identificar a causa.
```

## 37. Revisão de plano antes de executar
```
Antes de executar, revise o plano abaixo e aponte o que vai dar errado.

<plano> [DESCREVA O QUE O AGENTE PRETENDE FAZER, EM PASSOS] </plano>
Restrições: [ORÇAMENTO DE CHAMADAS, PRAZO, ARQUIVOS QUE NÃO PODEM SER TOCADOS]

Entregue:
1. Passos que dependem de informação que ainda não existe.
2. Chamadas de API repetidas ou desnecessárias (custo evitável).
3. Ações irreversíveis sem ponto de retorno.
4. Onde a revisão humana é obrigatória antes de seguir.
5. Uma versão corrigida do plano, em passos menores, com pontos de verificação.
6. Estimativa de custo e tempo.
```

## 38. Extração de aprendizados de um projeto
```
Transforme este projeto em conhecimento reutilizável.

<projeto>
Cliente/tipo: [...] · Objetivo: [...] 
O que foi feito: [LISTA DE AÇÕES]
O que funcionou: [COM DADO]
O que não funcionou: [COM DADO]
Scores antes e depois: [SEO E CONVERSÃO]
</projeto>

Entregue:
1. Cinco regras reutilizáveis, escritas no imperativo, que qualquer projeto parecido deveria seguir.
2. Três armadilhas específicas deste tipo de projeto.
3. Uma atualização de prompt/checklist do kit que o aprendizado justifica.
4. O que era específico deste cliente e NÃO deve virar regra.
5. Estudo de caso em 200 palavras, pronto para virar conteúdo — com os números reais e sem exagero.
```

---

# §7 — Estratégia, Proposta e Monetização

## 39. Estrutura de proposta comercial
```
Monte a proposta comercial para o projeto abaixo.

<contexto>
Cliente: [NOME E SETOR] · Objetivo declarado: [OBJETIVO]
Diagnóstico já feito: [ACHADOS PRINCIPAIS COM SCORE]
Restrições: [PRAZO, ORÇAMENTO INFORMADO, EQUIPE DO CLIENTE]
</contexto>

Estrutura:
1. Situação atual em 5 linhas (o problema em número, não em adjetivo).
2. O que vamos fazer, em 3 fases, com entregável verificável em cada uma.
3. O que NÃO está incluído (escopo negativo explícito).
4. Cronograma realista, com o que depende do cliente e prazo de resposta esperado.
5. Investimento: três opções (essencial, recomendada, completa) com o que muda entre elas.
6. Como medimos o sucesso: métricas, prazo de leitura e o que faremos se não melhorar.
7. Próximos passos com data.

Tom: claro, sem jargão, sem promessa de resultado. Máximo 2 páginas.
Se alguma informação essencial faltar, escreva `[CONFIRMAR: ...]` em vez de estimar.
```

## 40. Precificação por valor
```
Ajude a precificar o serviço abaixo com base em valor, não em horas.

<contexto>
Serviço: [DESCRIÇÃO] · Perfil do cliente: [PORTE E SETOR]
Nível de execução: [DIAGNÓSTICO / PROJETO COMPLETO / RECORRENTE]
Meu custo direto: [APIS, FERRAMENTAS, HORAS]
Minha experiência: [ANOS E CARTEIRA]
Mercado local: [OBSERVAÇÃO SOBRE CONCORRENTES E FAIXAS QUE VOCÊ CONHECE]
</contexto>

Entregue:
1. Três faixas de preço (entrada, núcleo, premium), com o escopo de cada.
2. A lógica de valor: o que muda na vida do negócio do cliente com esse trabalho.
3. Como apresentar o preço para ser aprovado sem desconto: ancoragem, comparação com o custo do problema,
   divisão por resultado.
4. Cinco perguntas para descobrir o orçamento sem perguntar sobre orçamento.
5. Como responder às objeções "está caro", "vou pensar" e "meu primo faz mais barato".
6. O que eu faria se o mercado praticar metade desse valor, sem destruir a margem.

RESTRIÇÃO: o cliente prático deste trabalho é você. Estes números são referência para conversa, não
promessa de faturamento — reforce isso no material que você usar com o comprador do curso.
```

## 41. Briefing de cliente em uma página
```
Estruture o briefing abaixo em uma página, para alinhar antes de começar.

<informacoes_coletadas> [TRANSCRIÇÃO DA CONVERSA OU NOTAS BRUTAS] </informacoes_coletadas>

Entregue:
1. Objetivo de negócio (não de site) em uma frase.
2. Público: quem decide a compra e quem influencia. Dois perfis.
3. Oferta: o que vende, ticket, ciclo de decisão.
4. Concorrentes diretos e a razão de o cliente os ver como concorrentes.
5. Restrições: prazo, ferramenta atual, quem aprova, quem executa, o que não pode mudar.
6. O que o cliente acha que é o problema e o que os dados mostraram.
7. Critério de sucesso acordado, em número.
8. LACUNAS: lista de informações que faltam, com a pergunta exata a fazer.

Não preencha lacuna com suposição. Liste na seção 8.
```

## 42. Plano de 90 dias para o cliente
```
Construa um plano de 90 dias de crescimento para [CLIENTE].

Ponto de partida: [SCORES DE SEO E CONVERSÃO, TRÁFEGO ATUAL, CONVERSÃO ATUAL]
Objetivo de negócio: [OBJETIVO] · Capacidade semanal: [HORAS DO CLIENTE + SUAS]
Ferramentas disponíveis: [FERRAMENTAS]

Entregue:
- Dias 1–30 (fundação): o que consertar, medir e publicar. Critério de saída.
- Dias 31–60 (produção): o que produzir em escala. Critério de saída.
- Dias 61–90 (amplificação): como distribuir e o que testar. Critério de saída.
Para cada fase: entregáveis, quem faz, horas estimadas, dependência, métrica de acompanhamento.

Regras: não agende produção de conteúdo antes de a fundação técnica estar pronta; toda fase termina com
rodada de API para comparar score; preveja uma semana de folga em cada 30 dias.
Termine com os 3 riscos que podem travar o plano e o plano B de cada um.
```

## 43. Descrição de escopo e limite
```
Escreva o escopo deste projeto de forma que proteja o profissional de cliente ansioso.

<projeto> [DESCRIÇÃO DO QUE SERÁ ENTREGUE] </projeto>

Entregue:
1. Escopo incluído, item por item, com formato de entrega e prazo.
2. Escopo EXCLUÍDO, explícito — liste pelo menos 8 itens que o cliente pode presumir que estão incluídos
   e não estão (hospedagem, redação ilimitada, gestão de tráfego, suporte a plataforma, alterações após
   aprovação, criação de identidade visual, integração com sistemas internos, garantia de ranking).
3. Regras de alteração: quantas rodadas de revisão estão incluídas e como funciona o pedido extra.
4. O que depende do cliente e o efeito do atraso.
5. Critério de conclusão: como se encerra formalmente o trabalho.
Tom: firme e educado. Não peça desculpa por limitar escopo.
```

## 44. Programa de recorrência
```
Desenhe uma oferta recorrente a partir do serviço pontual já entregue.

Projeto entregue: [DESCRIÇÃO] · Resultado obtido: [DADOS] · Cliente: [PERFIL]
Minha capacidade: [HORAS/MÊS] · Custo de API mensal estimado: [VALOR]

Entregue:
1. O que faz sentido cobrar mensalmente (e o que não faz): trabalho que se desgasta se parar.
2. Três formatos de recorrência, de entrada a completo, com entregáveis mensais.
3. Cronograma do primeiro trimestre de recorrência, mês a mês.
4. Como apresentar a transição para o cliente — a conversa, não o e-mail.
5. Como encerrar caso o cliente queira parar, sem perder a referência.
6. Uma armadilha comum: cobrar mensalidade por entrega que não gera valor percebido todo mês.
```

## 45. Vender o serviço para quem não conhece o método
```
Escreva a explicação do serviço em três camadas de profundidade.

Serviço: [SERVIÇO] · Interlocutor: [DONO DE NEGÓCIO / GESTOR DE MARKETING / DESENVOLVEDOR]

1. Em 20 segundos (para a conversa de elevador): o que é, para quem, que problema resolve.
2. Em 2 minutos (primeira reunião): problema → método → o que ele recebe → em quanto tempo.
3. Em uma página (proposta enviada por e-mail): com os entregáveis e o critério de sucesso.

Regras: nada de sigla sem explicação; nada de "IA" como argumento principal (o argumento é o problema
resolvido); nenhuma promessa de resultado. Cada camada tem que fazer sentido lida em sequência, mas ser
compreensível sozinha.
```

## 46. Argumento contra a objeção "já uso ChatGPT"
```
Prepare a resposta para a objeção abaixo, em três formatos.

Objeção: "já uso ChatGPT, não preciso disso"
Interlocutor: [PERFIL] · Contexto: [ONDE ELE USA HOJE]

Entregue:
1. Resposta curta (30 segundos, para conversa): a diferença entre gerar e medir, com um exemplo concreto.
2. Resposta média (2 minutos): o que a página ganha com uma análise por dimensão que o chatbot não faz.
3. Resposta técnica: o que a API retorna (score, dimensões, recomendações específicas) que um modelo
   conversacional não devolve por falta de acesso à página.
4. Uma demonstração de 5 minutos para fazer ao vivo com a página do próprio interlocutor.
5. O que reconhecer como verdade na objeção (ser honesto sobre quando ChatGPT é suficiente).
```

---

# §8 — Qualidade, Ética e Conformidade

## 47. Auditoria de honestidade de copy (CONAR / FTC)
```
Você é um revisor de conformidade publicitária. Analise o material abaixo.

<material> [COLE O TEXTO DA PÁGINA, ANÚNCIO, E-MAIL OU POST] </material>

Liste:
A) Toda afirmação de resultado (número, prazo, comparação) — com o trecho literal.
B) Para cada uma: é verificável por terceiro? Há fonte? Há ressalva?
C) Promessas implícitas de renda, ranking, tráfego ou prazo.
D) Depoimentos sem identificação rastreável e sem menção de autorização.
E) Urgência ou escassez que não seja real.
F) Superlativo sem comprovação ("o melhor", "o único", "definitivo").
G) Problemas de transparência: preço escondido, assinatura não avisada, inclusão não declarada.

Para cada item: trecho, risco, e reescrita sugerida que preserve o poder comercial mas troque garantia
por condição ("se você fizer X, tende a Y" em vez de "você vai ganhar Y").

Termine com veredicto: PUBLICÁVEL / PUBLICÁVEL COM AJUSTES / NÃO PUBLICAR — e a razão em uma frase.
```

## 48. Auditoria de acessibilidade da página
```
Audite a página abaixo quanto a acessibilidade, com foco no que dá para corrigir hoje.

<pagina url="[URL]">
[TEXTO E ESTRUTURA — headings em ordem, textos dos links, textos alternativos, rótulos de formulário]
</pagina>

Verifique e reporte:
1. Estrutura de headings: está em ordem? há mais de um h1? hierarquia faz sentido fora de contexto?
2. Contraste: liste os pares texto/fundo e o resultado (aprovado/reprovado em AA).
3. Texto de link: funciona fora de contexto? ("clique aqui" reprovado)
4. Imagens: quais precisam de alt descritivo, quais precisam de alt vazio.
5. Formulários: rótulos associados, mensagens de erro, ordem de foco.
6. Texto que não é só imagem: alguma informação crítica está dentro de imagem?
7. Navegação por teclado: o que provavelmente está inacessível a partir da estrutura.

Entregue uma lista de correções ordenada por severidade, com o código ou o texto corrigido.
Não invente resultado de auditoria automatizada: se não dá para verificar com o que foi fornecido, diga.
```

## 49. Verificação técnica básica de SEO
```
Faça a verificação técnica de SEO da página [URL] a partir dos dados abaixo.

<dados>
Title: [...] · Meta: [...] · H1: [...] · H2s: [...]
URL e estrutura: [...] · Canonical: [...] · Robots: [...]
Imagens sem alt: [...] · Links internos: [...] · Velocidade percebida: [...]
Dados estruturados: [...] · Sitemap informado: [...]
</dados>

Entregue:
1. Erros que impedem indexação ou causam canibalização.
2. Problemas de estrutura que atrapalham o entendimento do conteúdo.
3. Problemas de experiência (velocidade, layout instável, excesso de script) — só o que foi possível observar.
4. O que está correto e deve ser preservado.
5. Ação imediata: no máximo 5 itens, em ordem, com o responsável provável (redator, dev, designer).
6. O que NÃO dá para avaliar com os dados fornecidos.

Não afirme posição de ranking nem volume de busca. Nada de recomendação genérica ("produza conteúdo de
qualidade") — toda recomendação precisa ser executável.
```

## 50. Avaliação crítica de saída de IA
```
Avalie a saída de IA abaixo antes de eu publicá-la.

<saida> [COLE A SAÍDA COMPLETA DA API OU DO MODELO] </saida>
<contexto> [PÚBLICO, OFERTA, RESTRIÇÕES, DADOS REAIS DISPONÍVEIS] </contexto>

Entregue:
1. Fatos que podem estar errados e como verificar cada um.
2. Números inventados ou inflados.
3. Frases genéricas que servem para qualquer empresa (cite 5, literalmente).
4. Onde o texto contradiz o contexto fornecido.
5. Onde o tom não é o da marca.
6. O que está aproveitável e o que deve ir para o lixo.
7. Versão corrigida dos 3 trechos piores.

Seja cético por padrão: a saída de IA costuma ser mais confiante do que precisa ser.
```

## 51. Reescrita de texto para legibilidade
```
Reescreva o texto abaixo para legibilidade, sem perder informação nem precisão.

<texto> [COLE O TRECHO] </texto>
Público: [PÚBLICO] · Nível de familiaridade com o tema: [LEIGO / INFORMADO / TÉCNICO]
Formato final: [PÁGINA / PDF / E-MAIL / APRESENTAÇÃO]

Regras:
- Uma ideia por parágrafo. Parágrafos de até 4 linhas.
- Frases de até 25 palavras. Voz ativa. Sem "no sentido de", "com o intuito de", "faz-se necessário".
- Troque abstração por exemplo concreto sempre que houver exemplo disponível no texto.
- Mantenha todo número e afirmação técnica exatamente como estão.
- Não simplifique a ponto de tornar a informação incorreta.

Entregue: (1) o texto reescrito; (2) tabela com "antes / depois / o que mudou" para os 5 piores trechos;
(3) termos que precisam de explicação rápida e a explicação de uma linha para cada.
```

## 52. Revisão final antes de publicar
```
Faça a revisão final de publicação da página [URL] e emita um veredicto.

<checklist_preenchido>
[COLE A SAÍDA DO CHECKLIST DE CONVERSÃO E DE SEO ON-PAGE, COM MARCADOS E NÃO MARCADOS]
</checklist_preenchido>

<contexto> [OBJETIVO DA PÁGINA, PÚBLICO, RESTRIÇÕES LEGAIS] </contexto>

Entregue:
1. Bloqueadores: o que impede a publicação (link quebrado, promessa não verificável, formulário sem
   mensagem de erro, ausência de política de privacidade onde há coleta de dado).
2. Riscos: o que pode ser publicado mas deve ser corrigido em 7 dias.
3. Pendências de conteúdo: o que está com [CONFIRMAR] ou vazio.
4. Verificações que faltam: o que não foi testado e deveria ser.
5. Veredicto: PUBLICAR / PUBLICAR COM RESSALVA / NÃO PUBLICAR — com a lista de ações obrigatórias antes
   do clique final.

Nunca aprove uma página que colete dado pessoal sem política de privacidade acessível, ou que prometa
resultado não verificável.
```

---

## Anexo — Meta-prompt (gerar novos prompts)

Use quando precisar de um prompt que não existe aqui.

```
Você é um engenheiro de prompts. Gere [N] prompts para [OBJETIVO], a serem usados por
[NÍVEL DE EXPERIÊNCIA] dentro de [FERRAMENTA].

Contexto do domínio: [DESCREVA O STACK, O PÚBLICO E O FUNIL]

Requisitos de cada prompt:
1. Papel explícito ("Você é..."), uma única tarefa.
2. Entradas nomeadas entre [COLCHETES] que o usuário preenche.
3. Formato de saída declarado (JSON, tabela markdown, lista numerada).
4. Uma restrição negativa explícita — o que NÃO fazer.
5. Uma regra para quando faltar dado essencial: escrever [CONFIRMAR: ...] em vez de inventar.
6. Nenhuma promessa de resultado que a ferramenta não possa entregar.
7. Idioma: português do Brasil. Até [N] palavras por prompt. Sem preâmbulo.

Entregue em tabela markdown: | # | Nome | Prompt completo | Quando usar | Não faça |
```

---

## Licença de uso

Este material é entregue sob a **Licença de uso do kit de ferramentas** do Growth Design Pro: uso pessoal e
profissional liberado, inclusive em projetos de clientes; vedada revenda, redistribuição ou publicação como
produto próprio. Texto completo em `site/legal/licenca.html`.

Dúvidas de suporte: suporte@growthdesignpro.com.br

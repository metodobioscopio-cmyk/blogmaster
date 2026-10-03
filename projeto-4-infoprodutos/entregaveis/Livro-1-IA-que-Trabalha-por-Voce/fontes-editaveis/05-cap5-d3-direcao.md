# CAPÍTULO 5 — D3: DIREÇÃO — transformando o prompt em rotina

Prompt resolve uma tarefa. Rotina resolve a sua semana. É aqui que a IA deixa de ser algo que você "lembra de usar" e passa a ser um sistema que trabalha sem você pensar.

---

## 5.1 A anatomia de uma rotina

Toda rotina tem quatro partes. Se faltar uma, ela morre em uma semana.

| Parte | Pergunta | Exemplo |
|---|---|---|
| **Gatilho** | O que faz você começar? | "Cheguei e abri o computador" |
| **Passo** | O que exatamente você faz? | "Colei os 8 e-mails da caixa no prompt de triagem" |
| **Saída** | O que fica pronto? | "Lista priorizada + respostas rascunhadas" |
| **Arquivo** | Onde isso é salvo? | "Pasta 03-Saídas/2026-03-14" |

Sem gatilho, você esquece. Sem arquivo, você perde. Sem saída clara, você não sabe se funcionou.

---

## 5.2 Rotina 1 — Caixa de Entrada Zero em 15 minutos

**O problema:** você abre o e-mail e é sugado por ele. Responde o que apareceu primeiro, esquece o que importa, termina a manhã sem ter feito nada do seu trabalho.

**A rotina:**
1. Não responda nada ao abrir. Copie os e-mails recebidos até agora (sem dados sigilosos) em um único bloco.
2. Rode o **Prompt de Triagem** (abaixo).
3. A IA devolve três listas: **responder agora**, **responder depois**, **descartar/arquivar** — e rascunhos das respostas dos três primeiros.
4. Você revisa, ajusta o tom e envia. O que é decisão fica para a segunda rodada.

**Prompt de Triagem (copie):**

```
Você é meu assistente de triagem de e-mail.

OBJETIVO: organizar minha caixa de entrada e rascunhar respostas.

CONTEXTO: abaixo estão os e-mails recebidos hoje. Meu contexto: [cole a Ficha de Contexto Mestre].

FORMATO: 1) tabela com remetente | assunto | categoria (responder agora / depois / arquivar) | motivo em 5 palavras. 2) Rascunho de resposta para os 3 mais urgentes, cada um com até 90 palavras.

RESTRIÇÕES: não invente informação que não está no e-mail; se faltar dado, escreva "confirmar com [pessoa]" em vez de preencher.

E-MAILS:
[cole aqui]
```

**Tempo:** 15 minutos por dia. **Ganho típico:** 30 a 50 minutos.

---

## 5.3 Rotina 2 — Relatório em 5 minutos

**O problema:** relatório é sempre a mesma estrutura, muda só o número — e você o monta do zero toda semana.

**A rotina:**
1. Você mantém uma planilha simples com os dados da semana (vendas, atendimentos, prazos, indicadores).
2. Cola os números no prompt.
3. A IA devolve o relatório no formato padrão: **resumo em 3 linhas, o que melhorou, o que piorou, o que fazer na próxima semana**.
4. Você ajusta a interpretação (a parte que exige você) e envia.

**Prompt (copie):**

```
Você é analista de dados de uma [área/empresa].

OBJETIVO: transformar meus números da semana em relatório de 1 página.

CONTEXTO: [dados da semana]. Comparação com a semana anterior: [dados].

FORMATO: 1) resumo em 3 linhas; 2) tabela de indicadores (valor | variação | leitura); 3) "o que melhorou"; 4) "o que pede atenção"; 5) três ações sugeridas para a próxima semana.

RESTRIÇÕES: não invente números; se algum dado estiver faltando, diga o que falta em vez de estimar. Linguagem simples, sem jargão.
```

**Regra de ouro:** a IA faz o texto; **você assina a interpretação**. Nunca envie análise que você não concorda.

---

## 5.4 Rotina 3 — Conteúdo para redes em 30 minutos

**O problema:** você sabe o que quer dizer, mas trava na hora de escrever — e acaba não publicando.

**A rotina (uma sessão por semana, gerando 7 posts):**
1. Escolha 3 temas da semana (uma dica, uma história, uma prova).
2. Rode o prompt pedindo 7 variações: 3 dicas curtas, 2 histórias, 1 prova com número, 1 oferta.
3. Para cada post, gere a legenda e a primeira linha do vídeo (o gancho).
4. Revise tudo com a sua voz, ajuste 20% e agende.

**Prompt (copie):**

```
Você é social media especialista em conteúdo que vende sem parecer anúncio.

OBJETIVO: 7 ideias de post para uma semana, a partir dos temas abaixo.

CONTEXTO: minha área é [área], meu público é [público], meu tom é [tom]. Temas da semana: [3 temas].

FORMATO: para cada post: (a) formato (vídeo curto, carrossel, foto), (b) primeiro segundo falado (gancho, até 8 palavras), (c) roteiro em 5 linhas, (d) legenda de até 40 palavras, (e) chamada para ação.

RESTRIÇÕES: sem promessa de resultado; sem clichê motivacional; sem "você que está [problema]" — o Meta reprova esse tipo de frase e soa invasivo; evite emoji a cada linha.
```

---

> 🟨 **ERRO COMUM**
> Criar 6 rotinas de uma vez. Regra prática: **uma rotina nova por semana.** As três acima já resolvem boa parte do dia. Se você adicionar a quarta antes de automatizar a primeira, nenhuma sobrevive.

---

## 5.5 Instruções personalizadas: seu assistente com memória

Em quase toda ferramenta de IA existe um lugar para você deixar instruções permanentes (GPT personalizado, "Gem", "Projeto", "Instruções personalizadas"). Preencha com:

```
1. Meu contexto: [Ficha de Contexto Mestre]
2. Meu padrão de resposta: direto, sem preâmbulo, em tópicos quando houver lista.
3. Sempre que faltar informação, pergunte antes de responder.
4. Nunca invente número, lei ou citação sem avisar que é suposição.
5. Ao final de tarefas longas, sugira o próximo passo em uma linha.
```

Isso elimina a repetição mais burra do seu dia: explicar de novo quem você é.

---

## 5.6 Ensinando a IA o seu jeito

Três movimentos que deixam a saída com a sua cara:

1. **Dê exemplos.** Cole dois textos seus que você considera perfeitos e diga: "escreva no estilo destes aqui".
2. **Crie um glossário.** Liste 10 palavras que você **não** quer (ex.: "alavancar", "robusto", "sinergia") e 10 que quer.
3. **Defina o molde de saída.** Se você sempre entrega no mesmo formato, ensine o formato uma vez e reuse sempre.

---

> 🟦 **FAÇA AGORA (30 min)**
> 1. Escolha **uma** das três rotinas (comece pela que dói mais).
> 2. Configure as instruções personalizadas com a sua Ficha de Contexto Mestre.
> 3. Rode a rotina hoje do início ao fim, cronometrando.
> 4. Anote: tempo antes, tempo depois, o que precisou de ajuste.
> 5. Agende o gatilho no celular (ex.: todos os dias às 8h20 — "triagem").

---

> 🟪 **CHECKLIST DO CAPÍTULO 5**
> - [ ] Entendi a anatomia de uma rotina (gatilho, passo, saída, arquivo)
> - [ ] Configurei as instruções personalizadas
> - [ ] Escolhi UMA rotina e rodei hoje
> - [ ] Cronometrei o ganho
> - [ ] Programei o gatilho para amanhã

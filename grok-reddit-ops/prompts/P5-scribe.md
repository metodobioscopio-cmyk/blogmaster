# P5 — Scribe (redação da resposta)

Este é o prompt mais sensível do sistema: é ele que separa "conselho útil" de "anúncio disfarçado". O `src/pipeline.py::SCRIBE_SYSTEM` implementa esta versão.

## Prompt base

```
Você escreve respostas para fóruns (Reddit) que soam humanas, específicas e úteis —
nunca como anúncio.

CONTEXTO RECEBIDO
- lead card (intenção, persona, dor, ângulo)
- regra do subreddit (link permitido? disclosure obrigatório? tolerância?)
- idioma e mercado

REGRAS INVIOLÁVEIS
1. A primeira frase responde diretamente a pergunta feita. Sem rodeio.
2. Dê critério de decisão verificável, não opinião vaga.
3. Se mencionar produto/serviço, inclua a divulgação da relação comercial em
   linguagem simples, na mesma tela, ANTES de qualquer link.
4. Se o subreddit proíbe links, NÃO inclua link. O destino é o perfil.
5. Marque com [VERIFICAR] qualquer número, prazo ou preço que o humano precise confirmar.
6. Proibido: superlativos, emojis, CAIXA ALTA, "game changer", promessa de renda ou
   resultado garantido, contagem de dinheiro, "DM me" como CTA principal.
7. Máximo 250 palavras para comentário; 1.500 para post.
8. A resposta precisa ser útil mesmo se a pessoa nunca clicar em nada.

SAÍDA (JSON estrito)
{
  "text": "...",
  "link_allowed": true|false,
  "disclosure": "...",
  "checklist": ["..."],
  "warnings": ["..."]
}
```

## Biblioteca de aberturas (não use sempre a mesma)

| Situação | Abertura que funciona |
|---|---|
| Comparação | "A diferença real entre as duas é [critério] — o resto é cosmético." |
| Pedido de indicação | "Sou [credencial] em [cidade]. Antes de indicar qualquer coisa, dois números que mudam a decisão: ..." |
| Dúvida de timing | "Ninguém sabe o momento certo. O que dá para calcular é [custo de esperar vs. custo de comprar]." |
| Recomendação de ferramenta | "Já rodei as três em produção. Se seu caso é X, vai de A; se é Y, B resolve e cobra menos." |
| Desconfiança | "Sou suspeito porque sou afiliado — por isso vou te dar o caminho gratuito primeiro." |

## Biblioteca de fechamentos (CTA sem parecer CTA)

| Rota | Fechamento |
|---|---|
| 1 (resposta-âncora) | "Se quiser, tenho a planilha com os números de 6 bairros — está no meu perfil." |
| 2 (post de caso) | "Os dados completos estão no post; quem quiser a planilha, comenta aqui que eu atualizo." |
| 3 (educar) | Nenhum. Termine com a resposta e uma pergunta de acompanhamento. |
| Imobiliário | "Se fizer sentido, monto um comparativo de 3 imóveis com custo total (ITBI, condomínio, financiamento) — sem compromisso." |

## Validação automática (o código já faz)

| Checagem | Ação se falhar |
|---|---|
| Promessa de retorno ("garantido", "renda certa") | warning + bloqueio |
| Link em sub `link_allowed: false` | warning + bloqueio |
| Sem disclosure com menção comercial | warning |
| Texto > 2.600 caracteres | warning: publicar como post de perfil |
| Números sem [VERIFICAR] | revisão humana obrigatória |

## O passo que ninguém pode pular

O rascunho **não** vai para o Reddit. Ele volta para você, que:

1. Confere os `[VERIFICAR]` na fonte.
2. Reescreve na sua voz (gíria local, uma imperfeição, uma opinião pessoal).
3. Remove qualquer frase que você não diria numa mesa de bar.
4. Publica do seu usuário, com seu nome e sua responsabilidade.

Sem o passo 2, você está violando a política de conteúdo manipulado do Reddit e a regra de disclosure da FTC/CONAR. Com o passo 2, você está usando IA para pensar mais rápido — que é exatamente o ponto.

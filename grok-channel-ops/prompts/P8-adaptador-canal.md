# P8 — Adaptador multicanal

**Quando usar:** depois de ter um lead ou um tema aprovado, antes de qualquer publicação em canal que não seja o Reddit.
**O que faz:** transforma uma ideia em peça nativa do canal — formato, tamanho, tom, CTA e disclosure no lugar certo.
**Regra dura:** o modelo **não** opina sobre onde publicar. Você já decidiu; ele só adapta.

---

## Prompt (copie inteiro)

```text
Você é redator de canais da [EMPRESA]. Sua tarefa é adaptar UM conteúdo para UM
canal, respeitando limites técnicos e de política.

ENTRADAS
- canal: {CANAL}          # x_post | instagram_post | threads | bluesky | telegram
                          # linkedin_post | youtube | facebook_page | gbp | tiktok
- objetivo: {OBJETIVO}    # autoridade | clique | conversa | agendamento
- tema: {TEMA}
- fatos verificados: {FATOS}      # só use o que está aqui
- link (opcional): {LINK}
- afiliado: {sim|não}

LIMITES TÉCNICOS DO CANAL (não negocie)
- x_post: 280 caracteres; link custa US$ 0,20 (13x) → prefira link na resposta
- instagram_post: 2.200 caracteres; 1ª linha é o gancho; até 30 hashtags
- threads: 500 caracteres; tom de conversa, sem hashtag
- bluesky: 300 caracteres; sem hashtag; tom direto
- telegram: 4.096 caracteres; pode usar negrito e link
- linkedin_post: 3.000 caracteres; 1ª linha antes do "ver mais" precisa prender
- youtube: descrição com 2 primeiros parágrafos visíveis
- gbp: 1.500 caracteres; 1 imagem; expira em 7 dias → inclua prazo
- tiktok: 2.200 caracteres; hook nos 2 primeiros segundos
- facebook_page: até 63.206 caracteres, mas ninguém lê > 300

REGRAS
1. Nunca invente número, preço, prazo ou nome. Se faltar fato, escreva [FALTA].
2. Disclosure ANTES do link, na primeira pessoa:
   - afiliado: "sou afiliado" / "#publi" / "link de afiliado"
   - próprio: "trabalho com isso"
3. Zero emoji em WhatsApp/template; máximo 2 no Instagram.
4. Sem "clique aqui", "não perca", "última chance". Sem CAIXA ALTA gritada.
5. Um CTA só, específico, de baixo atrito.
6. Se o objetivo é "conversa", o CTA pede que a PESSOA escreva primeiro
   (nunca sugira DM frio).
7. Se o canal não permite link (bluesky/threads), coloque o link na bio.

SAÍDA (JSON)
{
  "canal": "...",
  "texto": "...",
  "cta": "...",
  "disclosure_no_texto": true,
  "caracteres": 0,
  "link_no_post": false,
  "custo_estimado_usd": 0.0,
  "risco": "por que este post pode ser removido, se houver",
  "variante_b": "uma segunda versão com outro ângulo"
}
```

---

## Exemplo aplicado — mesmo tema, quatro canais

**Tema:** "3 erros que fazem um imóvel ficar 90 dias sem visita."

| Canal | Versão |
|---|---|
| **X (280)** | "Imóvel parado há 90 dias quase nunca é preço. São 3 erros: 1) foto de celular torta 2) anúncio sem custo total 3) corretor que responde em 4h. Qual dos três é o seu?" |
| **Instagram (gancho)** | "Seu imóvel está há 90 dias sem visita e você acha que é o preço. Não é." *(primeira linha; o resto explica os 3 erros e termina com "comenta IMÓVEL que eu mando o checklist")* |
| **Threads (500)** | Texto corrido, sem bullet, terminando em pergunta aberta. Sem hashtag, sem link. |
| **Bluesky (300)** | "90 dias sem visita raramente é preço. É foto, é anúncio e é tempo de resposta. Se for seu caso, me diz qual dos três." |

**Note o que mudou:** nada de conteúdo, tudo de forma. **O erro do operador solo é escrever um texto e colar em seis canais** — o resultado é ruim em todos e penalizado em alguns.

---

## Checklist de saída

- [ ] cabe no limite do canal (contado, não estimado)
- [ ] disclosure antes do link (se houver link)
- [ ] um CTA só
- [ ] nenhum número inventado
- [ ] nenhuma palavra proibida ("última chance", "clique aqui")
- [ ] o CTA de conversa pede inbound, nunca outbound
- [ ] variante B existe (para A/B de 1 semana)

# P1 — Escolha de nicho (afiliados)

**Uso:** uma vez, no início. Cole no Grok (app ou API) junto com seu perfil real.

```
Você é um analista de negócios de afiliados com acesso a dados de mercado de 2026.

MEU PERFIL
- Tempo disponível: [X h/dia]
- Capital para mídia: [US$ X/mês]
- Experiência: [nenhuma / 1 ano / 5 anos]
- Habilidades: [escrever / programar / design / vendas]
- Idioma: [português / inglês / ambos]
- Público que consigo alcançar hoje: [ ]

TAREFA
Avalie 5 nichos de afiliado ranqueados por (a) LTV de comissão realista, (b) dificuldade de
moderação no Reddit, (c) fit com meu perfil, (d) tempo até a primeira venda.

Para cada nicho, devolva em tabela:
| Nicho | Comissão típica | LTV estimado por cliente (US$) | EPC de referência | Tolerância no Reddit | Tempo até 1ª venda | Risco | Veredito |

Depois da tabela:
1. Qual você escolheria e por quê (3 frases).
2. Qual o erro mais comum de quem escolhe esse nicho.
3. Dois programas concretos com comissão e cookie declarados.

REGRAS
- Se não tiver certeza de um número, escreva "estimativa" e não invente precisão.
- Não recomende nada que dependa de lista comprada, e-commerce de ticket baixo ou curso.
- Considere que o canal principal será Reddit + busca por intenção.
```

**Critério de sucesso:** você consegue explicar em 1 frase por que o nicho nº 1 paga suas contas em 12 meses.

---

# P2 — Mapeamento de subreddits

```
Você é um pesquisador de comunidades online. Preciso de um mapa de subreddits para o
nicho [NICHO] no mercado [PAÍS/IDIOMA].

Devolva uma tabela com 8 subreddits:
| Subreddit | Membros (aprox.) | Tolerância a autopromoção (low/medium/high) | Regra de autopromoção citada | Rota recomendada (1-11) | Risco | Por que esse sub |

REGRAS CRÍTICAS
- Só cite a regra se você tiver certeza; caso contrário escreva "verificar no sidebar"
  e marque needs_manual_check = true.
- NUNCA invente número de membros. Use faixas aproximadas.
- Priorize subs de 20k a 500k membros: grandes demais enterram o post, pequenos demais
  não têm volume.
- Inclua pelo menos 2 subs com tolerância "medium" (é onde o teste é possível hoje).

No final:
- 3 ângulos de conteúdo que funcionam em pelo menos dois desses subs.
- 2 subs que eu deveria EVITAR no primeiro mês e o motivo.
```

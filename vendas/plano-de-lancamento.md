# Plano de Lançamento — 21 dias
### Growth Design Pro

**Premissa.** Lançamento enxuto, sem equipe, sem lançamento de "mil ingressos". O objetivo dos 21 dias
não é faturar o máximo possível: é **validar a promessa com público real** e produzir os primeiros
depoimentos verificáveis que vão sustentar o preço cheio depois.

**Meta realista para a turma 01:** 20 a 60 alunos. Acima disso, o suporte fica insustentável para quem
está lançando sozinho — e a primeira turma precisa de atenção, não de volume.

---

## Semana 1 — Preparação (dias 1 a 7)

| Dia | Tarefa | Responsável | Critério de conclusão |
|---|---|---|---|
| 1 | Substituir todos os placeholders (`python3 tools/verificar.py` deve passar limpo) | você | zero pendências no relatório |
| 1 | Definir preço cheio e preço de lançamento, com data de encerramento | você | data no calendário, informada em todos os materiais |
| 2 | Revisar textos legais com advogado | advogado | termos, privacidade e licença aprovados |
| 2 | Criar o produto na plataforma (Hotmart/Kiwify/Eduzz) com área de membros | você | link de checkout funcionando, testado com compra real de R$ 1 |
| 3 | Configurar as 6 APIs na sua conta e rodar o funil completo uma vez | você | 6 arquivos JSON gerados em `dados/` |
| 3 | Rodar o funil em 3 páginas de clientes/amigos para ter casos reais | você | 3 dossiês com antes e depois |
| 4 | Publicar o site da landing page com o link de checkout | você | página no ar, verificada no celular |
| 4 | Instalar analytics com evento de clique no botão de compra | você | evento aparece no relatório em tempo real |
| 5 | Montar a lista de espera: post + guia gratuito | você | 50+ inscritos ou 3 dias de conteúdo publicado |
| 6 | Gravar o Módulo 1 completo (4 aulas) | você | vídeos publicados na área de membros |
| 7 | Gravar o Módulo 2 completo (6 aulas) com screencast das APIs | você | screencasts com chamada real, não simulação |

**Ponto de decisão no dia 7.** Se você não conseguiu gravar os Módulos 1 e 2, **não abra o carrinho**.
Adie uma semana. Vender sem produto entregue é o caminho mais rápido para reembolso e reclamação.

---

## Semana 2 — Abertura (dias 8 a 14)

| Dia | Tarefa | Canal | Observação |
|---|---|---|---|
| 8 | Publicar o conteúdo de aquecimento ("rodei na minha própria página") | blog/redes | e-mail 1 da sequência |
| 9 | Publicar o conteúdo de mecanismo ("gerar x medir") | redes + lista | e-mail 2 |
| 10 | **Abrir o carrinho** | lista + redes | e-mails 3 e 4 |
| 11 | Publicar o comparativo concorrente × sua página (estudo de caso real) | redes | conteúdo que gera salvamento |
| 12 | Sessão ao vivo ou vídeo de 20 min respondendo dúvidas | redes | responda as objeções reais, não as que você imaginou |
| 13 | Publicar o "o que dá para fazer em uma tarde" | redes | e-mail 5 |
| 14 | Primeira leitura de métricas | interno | conversão da página, custo por lead, dúvidas mais frequentes |

**Métrica de leitura no dia 14:** a página converte acima de 1%? Se sim, comece a investir em tráfego.
Se não, o problema é clareza — volte à seção de oferta e à primeira dobra antes de gastar em anúncio.

---

## Semana 3 — Fechamento e entrega (dias 15 a 21)

| Dia | Tarefa | Observação |
|---|---|---|
| 15 | E-mails 6 e 7 (tempo/perfil e últimas 48 h) | escassez real, com data |
| 16 | **Fechar o carrinho** na hora anunciada | cumpra o horário; lista que confia compra de novo |
| 17 | E-mail 8 de encerramento + instruções de acesso | onboarding no mesmo dia |
| 18 | Gravar Módulos 3 e 4 (o núcleo do curso) | publique por módulo, não tudo de uma vez |
| 19 | Gravar Módulo 5 | o que transforma habilidade em receita |
| 20 | Publicar todos os arquivos do kit e conferir os links | teste cada download |
| 21 | Pedir os primeiros depoimentos | peça número, prazo e contexto; autorização por escrito |

**Sobre o pedido de depoimento.** Não peça "um depoimento". Peça três coisas específicas: qual era o
problema, o que a pessoa fez, qual foi o número antes e depois. Depoimento vago não vende e parece
falso. Depoimento com número e contexto vende sozinho.

---

## Depois do dia 21

| Prazo | Ação |
|---|---|
| 30 dias | Rodar auditoria nos 3 sites dos primeiros alunos que autorizarem; publicar como estudo de caso |
| 30 dias | Levantar as 5 dúvidas mais frequentes do suporte e gravá-las como aula de atualização |
| 60 dias | Reprecificar para R$ 497 (preço cheio) e medir a queda de conversão |
| 60 dias | Publicar os depoimentos reais, com nome, cargo e autorização arquivada |
| 90 dias | Abrir a turma 02 com o método refinado pelos aprendizados da turma 01 |

---

## Riscos e plano B

| Risco | Probabilidade | Plano B |
|---|---|---|
| Uma API muda de preço ou de endpoint antes da gravação | alta | regravar o screencast do Módulo 4; o método sobrevive à ferramenta |
| Conversão da página abaixo de 0,5% | média | revisar a primeira dobra e a seção de oferta; pedir 5 leituras externas |
| Reembolso acima de 10% | média | a promessa está desalinhada: usar a auditoria de honestidade (prompt 47) em todos os materiais |
| Poucas vendas na turma 01 | alta | normal: o objetivo é depoimento, não volume. Reprecificar só depois de ter prova |
| Suporte virando gargalo | média | transformar as dúvidas repetidas em aulas; responder em lote, em horário fixo |

---

## Checklist final antes de abrir o carrinho

- [ ] `python3 tools/verificar.py` sem pendências
- [ ] Seção de depoimentos removida (ou preenchida com prova real e autorizada)
- [ ] Preço e prazo de encerramento declarados e cumpridos
- [ ] "Assinaturas das APIs não estão inclusas" visível na página, no FAQ e na oferta
- [ ] Garantia de 7 dias descrita e operacionalmente possível
- [ ] Termos, privacidade e licença publicados e revisados
- [ ] Checkout testado com compra real (inclusive o e-mail de acesso e o cancelamento)
- [ ] Módulos 1 e 2 gravados e publicados
- [ ] Área de membros com todos os downloads testados
- [ ] Analytics com evento de conversão validado
- [ ] Plano de resposta ao suporte definido (quem responde, em quanto tempo)
- [ ] Você sabe dizer em uma frase qual é a promessa do produto — e ela não contém a palavra "garantido"

# CAPÍTULO 8 — As 12 automações que trabalham dormindo

Automação é diferente de prompt: o prompt você roda; a automação roda **sem você lembrar**. Aqui estão as 12 que fazem diferença na vida real, na ordem em que eu recomendo montar. Nenhuma exige programação.

**As ferramentas gratuitas que resolvem quase tudo:** n8n (código aberto, roda no navegador), Make (plano gratuito), Zapier (pago, mais simples), Google Apps Script (dentro do Google Sheets) e os assistentes de IA que você já usa.

---

## 8.1 Antes de montar: a regra dos 3 requisitos

Automatize apenas quando tiver: **repetição** (1x/semana ou mais), **padrão** (entrada e saída previsíveis) e **volume** (mais de 30 minutos por semana). Fora disso, rotina manual com prompt resolve melhor.

---

## 8.2 As 12 automações

### 1) Resumo diário de e-mails e tarefas
**O que faz:** recolhe os e-mails e recados do dia e envia um resumo às 8h com prioridades.
**Como montar:** gatilho de horário → leitura da caixa (ou colagem manual em um doc) → IA resume e classifica → envio por e-mail/WhatsApp para você mesmo.
**Tempo economizado:** 20-30 min/dia.

### 2) Relatório semanal automático
**O que faz:** toda sexta, pega os números da planilha, escreve o relatório no seu formato e salva em PDF.
**Como montar:** planilha padronizada → gatilho semanal → IA gera o texto → salva em pasta + envia para o gestor.
**Cuidado:** você revisa antes de enviar. Sempre.

### 3) Organizador de arquivos e nomes
**O que faz:** renomeia e organiza arquivos recebidos por padrão (data_assunto_versão).
**Como montar:** pasta monitorada → regra de nomenclatura → IA sugere nome e classificação.
**Ganho:** fim do "final_final_v3".

### 4) Calendário editorial de 30 dias
**O que faz:** gera 30 ideias de conteúdo no dia 1º do mês e distribui na agenda.
**Como montar:** planilha de temas → prompt de 30 ideias → IA preenche a planilha com data, formato, gancho e CTA.

### 5) Gerador de descrições de produto em lote
**O que faz:** recebe uma lista de produtos (nome + características) e devolve título otimizado + descrição + palavras-chave.
**Como montar:** planilha de entrada → prompt em lote (10 por vez) → salva na coluna de saída.
**Uso típico:** lojas com 50-300 itens.

### 6) Respostas padrão de atendimento
**O que faz:** mantém um "livro de respostas" para as 20 perguntas mais frequentes, pronto para copiar e colar, com variações de tom.
**Como montar:** liste as 20 dúvidas reais → IA gera 2 versões de cada → você revisa → guarda no atalho do teclado.

### 7) Transcrição + ata de reunião
**O que faz:** transforma o áudio da reunião em texto, extrai decisões, responsáveis e prazos.
**Como montar:** gravar (com autorização dos participantes) → transcrever → IA estrutura a ata → enviar ao grupo em até 1 hora.

> 🟨 **ERRO COMUM**
> Gravar reunião sem avisar. Peça autorização no início, sempre. E se houver dado sensível, revise o que será transcrito — LGPD vale também para áudio.

### 8) Tradução de material em lote
**O que faz:** traduz descrições, legendas e documentos para outro idioma mantendo o tom.
**Como montar:** planilha → prompt com "mantenha o tom e não traduza nomes próprios" → revisão por nativo quando o material for publicado.

### 9) Planilha de gastos alimentada por foto de nota
**O que faz:** você tira foto da nota fiscal; a IA extrai data, valor, categoria e lança na planilha.
**Como montar:** pasta de fotos → IA extrai os campos → Apps Script escreve na planilha.
**Ganho:** controle financeiro que ninguém abandona no segundo mês.

### 10) Alertas de prazos e vencimentos
**O que faz:** lê lista de obrigações (impostos, contratos, entregas) e avisa 7, 3 e 1 dia antes.
**Como montar:** planilha com datas → verificação diária → mensagem no WhatsApp/e-mail.

### 11) Banco de ideias de conteúdo por tema
**O que faz:** toda vez que você tem uma ideia, envia por mensagem; a IA classifica por tema e sugere formato.
**Como montar:** canal de mensagens → IA classifica e grava na planilha → consulta quando você for gravar.

### 12) Funil simples de captura + e-mail automático
**O que faz:** recebe o cadastro do interessado, envia o material gratuito na hora e coloca a pessoa em uma sequência de 3 e-mails.
**Como montar:** formulário → automação de envio → IA escreve as variações → você aprova uma vez e ela roda meses.

---

## 8.3 Por onde começar (a ordem que funciona)

| Semana | Monte | Por quê |
|---|---|---|
| 1 | #6 Respostas padrão | Mais rápido de montar, alívio imediato |
| 2 | #1 Resumo diário | Cria o hábito de começar o dia organizado |
| 3 | #7 Ata de reunião | Alto impacto visível para chefes e clientes |
| 4 | #4 Calendário editorial | Libera sua produção de conteúdo |

As outras sete podem esperar. **Automatizar é maratona, não corrida.**

---

## 8.4 Quando a automação não vale a pena

- Tarefa que acontece 1x por mês (faça na mão, com prompt)
- Processo que muda toda semana (a automação quebra e você gasta mais consertando)
- Qualquer coisa que envolva decisão com consequência ou relação humana
- Quando a ferramenta custa mais que o tempo economizado — faça a conta

---

> 🟦 **FAÇA AGORA (40 min)**
> 1. Escolha a automação #6 (respostas padrão).
> 2. Liste as 10 perguntas que você mais responde hoje.
> 3. Rode o prompt para gerar 2 versões de cada resposta.
> 4. Revise, salve os atalhos e use amanhã.
> 5. Marque no calendário: na próxima semana, monte a #1.

---

> 🟪 **CHECKLIST DO CAPÍTULO 8**
> - [ ] Entendi os 3 requisitos para automatizar
> - [ ] Montei a primeira automação (respostas padrão)
> - [ ] Agendei as próximas três na agenda
> - [ ] Sei reconhecer quando NÃO automatizar

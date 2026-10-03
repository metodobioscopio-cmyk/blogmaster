# 📎 BÔNUS — As 12 automações: manual de montagem

Cada automação aqui está descrita com **gatilho → ação → resultado**, tempo de montagem estimado e o nível de dificuldade. Nenhuma exige programação. Comece pela ordem sugerida (1 a 4) e só depois avance.

**Ferramentas gratuitas:** n8n (open source, roda no navegador), Make (plano gratuito), Google Apps Script (dentro do Sheets), além das ferramentas de IA que você já usa.

---

## ⭐ As 4 primeiras (comece por aqui)

### 1) Livro de Respostas Padrão
**Nível:** muito fácil · **Montagem:** 40 min · **Ganho:** 3-5 h/mês
- **Gatilho:** você recebe uma pergunta que já sabe responder
- **Ação:** abre o "livro" (documento com 20 perguntas e 2 versões de resposta cada) e copia/adapta
- **Resultado:** resposta em 30 segundos, tom consistente
- **Como montar:** liste as 20 perguntas → rode o prompt de geração → revise → salve no celular com atalho de teclado
- **Prompt:** "Você é redator de atendimento. Para cada pergunta abaixo, escreva 2 respostas (cordial e objetiva), até 60 palavras, sem prometer o que não posso cumprir. Perguntas: [lista]"

### 2) Resumo Diário de E-mails e Tarefas
**Nível:** fácil · **Montagem:** 30 min · **Ganho:** 20-30 min/dia
- **Gatilho:** horário (8h e 17h)
- **Ação:** IA resume e classifica o que chegou
- **Resultado:** mensagem com "responder agora / depois / arquivar" + rascunhos
- **Como montar:** use o prompt de triagem do capítulo 5; se a ferramenta permitir, conecte a caixa; se não, cole manualmente

### 3) Ata de Reunião Automática
**Nível:** fácil · **Montagem:** 25 min · **Ganho:** 45-60 min/reunião
- **Gatilho:** reunião terminou
- **Ação:** gravação → transcrição → IA estrutura
- **Resultado:** ata com decisões, responsáveis, prazos e próximos passos
- **Prompt:** "A partir da transcrição abaixo, monte uma ata com: 1) participantes; 2) temas; 3) decisões tomadas; 4) responsáveis e prazos; 5) pendências. Linguagem objetiva, em tópicos. Transcrição: [cole]"
- ⚠️ Peça autorização para gravar, sempre.

### 4) Calendário Editorial de 30 Dias
**Nível:** fácil · **Montagem:** 30 min · **Ganho:** 4-6 h/mês
- **Gatilho:** dia 1º do mês
- **Ação:** IA gera 30 ideias e distribui em datas
- **Resultado:** planilha com data, formato, gancho, CTA e status
- **Prompt:** "Monte um calendário de 30 dias para [área/público]. Distribua: 12 dicas, 8 demonstrações, 5 provas, 3 histórias, 2 ofertas. Para cada dia: formato, gancho (até 8 palavras), resumo em 1 linha e CTA. Sem promessa de resultado."

---

## 🔧 As 8 seguintes (depois do primeiro mês)

### 5) Relatório Semanal Automático
- **Nível:** médio · **Montagem:** 1 h
- **Gatilho:** sexta às 16h · **Ação:** lê a planilha de números → gera o texto no seu formato → salva em PDF
- **Cuidado:** você **revisa antes** de enviar. Não deixe envio automático para gestor/cliente sem revisão.

### 6) Organizador de Arquivos e Nomes
- **Nível:** médio · **Montagem:** 1 h
- **Gatilho:** arquivo novo em pasta monitorada · **Ação:** renomeia no padrão `AAAA-MM-DD_assunto_v1` e classifica em subpasta
- **Ganho escondido:** você passa a encontrar tudo em 5 segundos

### 7) Gerador de Descrições de Produto em Lote
- **Nível:** médio · **Montagem:** 1 h 30
- **Gatilho:** planilha com produtos preenchida · **Ação:** IA gera título otimizado, descrição e palavras-chave, 10 por vez
- **Prompt:** "Para cada produto abaixo, gere: título com palavra-chave, descrição de 60-90 palavras, 3 benefícios em tópicos e 5 palavras-chave de busca. Não invente característica que não esteja na lista. Produtos: [cole]"

### 8) Tradução em Lote com Revisão
- **Nível:** médio · **Montagem:** 1 h
- **Gatilho:** planilha de textos · **Ação:** traduz mantendo tom, marca termos que precisam de revisão humana
- **Regra:** material publicado → revise com nativo; material interno → ok direto

### 9) Controle de Gastos por Foto de Nota
- **Nível:** médio-alto · **Montagem:** 2 h
- **Gatilho:** foto na pasta · **Ação:** IA extrai data, valor, estabelecimento e categoria → lança na planilha
- **Prompt:** "Extraia destes comprovantes: data, estabelecimento, valor total e categoria provável. Devolva em tabela. Se algum campo estiver ilegível, escreva ILEGÍVEL em vez de adivinhar."

### 10) Alertas de Prazos e Vencimentos
- **Nível:** fácil · **Montagem:** 40 min
- **Gatilho:** verificação diária · **Ação:** compara datas da planilha com a data de hoje → envia aviso 7, 3 e 1 dia antes
- **Uso:** impostos, contratos, entregas, mensalidades, renovações

### 11) Banco de Ideias de Conteúdo
- **Nível:** fácil · **Montagem:** 40 min
- **Gatilho:** mensagem enviada para você mesmo · **Ação:** IA classifica por tema e formato → grava na planilha
- **Ganho:** nunca mais "não sei o que postar"

### 12) Funil de Captura + 3 E-mails Automáticos
- **Nível:** médio · **Montagem:** 2 h
- **Gatilho:** cadastro no formulário · **Ação:** envia o material na hora → 3 e-mails ao longo de 7 dias
- **Regra:** todo e-mail precisa de descadastro funcionando (LGPD)

---

## Regras de segurança das automações

- [ ] Nenhuma automação envia mensagem a cliente **sem** revisão sua
- [ ] Nenhum dado pessoal trafega em ferramenta sem contrato/consentimento
- [ ] Toda automação tem um "dono": você sabe onde ela está e como desligar
- [ ] Teste com dados fictícios antes de apontar para dados reais
- [ ] Uma automação por semana, no máximo

## Registro de automações (preencha)

| # | Automação | Data de montagem | Ferramenta | Tempo economizado/semana | Status |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |

# Checklist de Configuração do RapidAPI
### Growth Design Pro · Kit de Ferramentas · Módulo 4.1

**Objetivo:** sair de "zero conta" para "as 6 APIs respondendo no meu nome", sem susto na fatura.

> **Antes de começar:** as APIs deste stack são serviços de terceiros hospedados no RapidAPI. Elas têm planos
> gratuitos e pagos, com limites que mudam sem aviso. **Confira sempre a página do plano no dia da configuração**
> — este checklist cobre o processo, não os preços vigentes.

---

## 1. Preparação

- [ ] Conta criada no RapidAPI com o **e-mail profissional** (é o e-mail que recebe alerta de cota)
- [ ] Método de pagamento cadastrado **somente se** você for usar plano pago desde o início
- [ ] Se for usar plano gratuito: confirmado que **não há cobrança automática** ao estourar a cota
- [ ] Gerenciador de senhas com a credencial salva (você vai reusar a chave em vários lugares)
- [ ] Definida a **URL de teste**: um site seu ou público, estável, que não bloqueia robô
- [ ] Definido um teto de gasto mensal em mente (comece com o valor de um almoço, não de um salário)

## 2. Assinatura das 6 APIs

Para cada uma das seis, repita:

- [ ] Website Data Extraction API — assinada
- [ ] AI SEO Analysis API — assinada
- [ ] AI Conversion Optimization API — assinada
- [ ] AI Website Copywriter API — assinada
- [ ] AI Landing Page Optimizer API — assinada
- [ ] AI Social Media Content Generator API — assinada

Em cada assinatura, **anote antes de confirmar**:

| Item | Onde olhar | Sua anotação |
|---|---|---|
| Requisições incluídas no plano | tabela de planos | |
| Limite por segundo/minuto | tabela de planos | |
| Preço do plano acima do gratuito | tabela de planos | |
| O que acontece ao estourar a cota | FAQ / termos da API | |
| Cobrança por excesso? | tabela de planos | |
| Endpoint exato | aba "Endpoints" | |
| Parâmetros obrigatórios | aba "Endpoints" | |
| Formato da resposta | exemplo de resposta | |

## 3. Chave e segurança

- [ ] Chave de API copiada (`X-RapidAPI-Key`)
- [ ] Chave **NÃO** está em arquivo versionado (`.gitignore` conferido)
- [ ] Chave em variável de ambiente: `RAPIDAPI_KEY`
- [ ] Nenhuma chave colada em prompt, print, vídeo de aula ou mensagem de suporte
- [ ] Se for usar no front-end: ciente de que **chave no navegador é chave pública** — use proxy no servidor
- [ ] Plano de rotação: se a chave vazar, onde você regenera e o que precisa atualizar

## 4. Primeiro teste (faça com o navegador antes de automatizar)

- [ ] Teste executado direto no painel do RapidAPI (aba "Test Endpoint") com a URL de teste
- [ ] Resposta **200** recebida e corpo conferido
- [ ] Você entendeu qual campo da resposta contém o que você precisa
- [ ] Você identificou se o retorno é JSON ou texto dentro de JSON (comum em APIs de IA)
- [ ] Testado o **caso de erro**: uma URL inválida, para ver o formato da mensagem de erro
- [ ] Anotado: qual código HTTP e qual mensagem aparece quando o site alvo bloqueia robô

## 5. Controle de custo

- [ ] Estimativa por projeto: `nº de URLs × nº de APIs usadas por URL = chamadas`
- [ ] Estimativa mensal: `chamadas/mês × preço por 1.000 chamadas acima do plano`
- [ ] Cache planejado para não repetir chamada na mesma URL no mesmo dia
- [ ] Alertas de uso do RapidAPI ativados (se o painel oferecer)
- [ ] Revisão mensal da fatura agendada no calendário
- [ ] Definido o que fazer quando a cota acabar no meio de um projeto (fila, espera ou upgrade)

## 6. Integração

- [ ] Chave configurada no Make / n8n / Zapier (ou no arquivo `.env` do código)
- [ ] Um fluxo de teste ponta a ponta rodando (formulário → API → resultado salvo)
- [ ] Tratamento de erro implementado: falha de API **não** gera arquivo vazio nem segue o fluxo
- [ ] Log de cada chamada guardando: URL, etapa, horário, sucesso/falha, custo estimado
- [ ] Cache gravando em disco/planilha, com data de validade

---

## Erros clássicos (e o que fazer)

| Sintoma | Causa provável | Ação |
|---|---|---|
| `403` / `429` | Cota estourada ou plano sem acesso ao endpoint | Verificar o plano e o limite; conferir se assinou o plano certo |
| Resposta vazia com `200` | Site alvo bloqueia robô ou exige JavaScript | Trocar a URL de teste; documentar o comportamento |
| Texto de IA dentro de JSON | Campo aninhado com string escapada | Fazer `JSON.parse` do campo, não do todo |
| "Funcionou ontem, hoje não" | Mudança de contrato da API | Conferir a documentação atual antes de mexer no seu código |
| Fatura maior que o previsto | Repetição de chamada sem cache | Ativar cache por URL + etapa |

## 7. Higiene final

- [ ] Um documento (o Growth Stack Dashboard serve) com: nome da API, plano, limite, custo unitário, endpoint
- [ ] Esse documento está **fora** do material que você entrega ao cliente
- [ ] Você sabe dizer, em 30 segundos, quanto custa rodar o funil completo em uma página

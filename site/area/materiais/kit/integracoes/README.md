# Templates de Integração
### Growth Design Pro · Kit de Ferramentas

Três caminhos para colocar o funil rodando sem escrever aplicação: **n8n**, **Make** e **Zapier**.
Escolha um. Rodar os três ao mesmo tempo é retrabalho garantido.

---

## Qual escolher

| | n8n | Make | Zapier |
|---|---|---|---|
| **Melhor para** | quem quer controle e não pagar por tarefa | automações visuais de tamanho médio | integrações prontas com muitos apps |
| **Como cobra** | por execução do workflow (ou auto-hospedado grátis) | por operação | por tarefa |
| **Importar arquivo** | sim (JSON) | sim (blueprint) | não — montagem manual |
| **Auto-hospedável** | sim | não | não |
| **Curva** | média | baixa | a mais baixa |
| **Ideal quando** | você roda o funil para vários clientes | você quer montar visualmente e ajustar rápido | você já vive dentro do Zapier |

**Recomendação do curso:** n8n, auto-hospedado. O funil consome entre 6 e 12 chamadas por URL. Em
plataformas que cobram por tarefa, isso vira custo recorrente que cresce com o número de clientes — e
você repassa esse custo ao preço. Em n8n auto-hospedado, o custo marginal é o da API, apenas.

---

## O que está nesta pasta

```
integracoes/
├── n8n/funil-growth-stack.json      ← importável (Workflows → Import from File)
├── make/blueprint-funil.json        ← blueprint (Scenarios → Import Blueprint)
└── zapier/RECEITA.md                ← passo a passo, porque Zapier não importa JSON
```

---

## Antes de importar — os 4 ajustes obrigatórios

Nenhum dos arquivos funciona sem estes quatro ajustes. Eles estão marcados com `COLE-AQUI` no JSON.

1. **Host de cada API.** Cada uma das 6 APIs tem o seu próprio host no RapidAPI. Copie na aba
   "Endpoints" de cada uma. Eles mudam sem aviso — confira na data de hoje, não na data do vídeo.
2. **Caminho e nome dos parâmetros.** Um endpoint pode esperar `url`, `websiteUrl` ou `target`. O
   modelo usa `url` como padrão. Leia a documentação e ajuste.
3. **Credencial.** Crie uma credencial de cabeçalho HTTP com nome `X-RapidAPI-Key` e valor da sua
   chave. Nunca cole a chave direto no nó.
4. **Destino.** Troque o ID da planilha pelo seu `growth-dashboard` (versão Google Sheets).

---

## Ordem do fluxo (não inverta)

```
Webhook/Formulário
      ↓
  Validação da URL
      ↓
① Extração ──▶ ② SEO ──▶ ④ Copy ──▶ ⑤ Landing ──▶ ③ Conversão ──▶ ⑥ Social
                                                            ↓
                                                  Grava no dashboard
                                                            ↓
                                                     Responde ao usuário
```

A numeração acima é a **ordem de execução**, não a ordem de catálogo das APIs. Copy é gerada depois do
diagnóstico; social é gerado por último, a partir da copy e da página otimizada.

---

## Tratamento de erro — o item que quase todo mundo esquece

Configure em **cada** nó de API:

- **Retry:** 3 tentativas, com espera crescente (1 s, 2 s, 4 s).
- **Timeout:** 30 s para análise, 60 s para geração de texto.
- **On error:** *Stop workflow* — **nunca** "Continue". Um fluxo que segue adiante com resposta vazia
  produz um relatório bonito e falso, e o cliente descobre na reunião.
- **Notificação:** em caso de falha, mande um e-mail ou mensagem para você, com a etapa e o status HTTP.

| Status | Significado | O que fazer |
|---|---|---|
| 429 | Cota do plano estourada | Verificar o limite; esperar a janela ou fazer upgrade |
| 403 | Sem acesso ao endpoint | Conferir se o plano assinado inclui o endpoint |
| 404 | Endpoint mudou | Ler a documentação atual antes de mexer no fluxo |
| 200 com corpo vazio | Site alvo bloqueou robô | Trocar a URL de teste; documentar o caso |

---

## Cache e custo

O funil completo em uma URL consome entre 6 e 12 chamadas, dependendo de quantas APIs você usar.
Sem cache, rodar o mesmo diagnóstico três vezes no mesmo dia custa três vezes.

**Implementação simples:** antes de cada chamada, verifique na sua planilha de controle se já existe
resultado daquela URL naquele dia. Se existir, use o valor gravado.

**Implementação correta:** cache por `URL + etapa + data`, com validade de 24 h. O cliente de código
em `kit/codigo/` já faz isso — use-o como referência se quiser replicar no n8n.

---

## Segurança

- A chave do RapidAPI é uma **credencial de fatura**. Ela não vai para o front-end, não entra em print,
  não aparece em vídeo de aula e não é colada em prompt de IA.
- Se o seu fluxo precisa ser chamado pelo navegador, coloque um passo intermediário no servidor (ou no
  próprio n8n) que guarda a chave. Navegador fala com o seu servidor; o seu servidor fala com a API.
- Restrinja o webhook: exigir um cabeçalho secreto ou limitar por IP evita que qualquer pessoa use a sua
  cota.
- Se a chave vazar: regenere no painel do RapidAPI e atualize a credencial nos três lugares onde ela
  estiver (n8n, código, planilha).

---

## Teste antes de entregar ao cliente

1. Rode o fluxo com uma URL **sua** e confira cada saída em sequência.
2. Force um erro (URL inválida) e confirme que o fluxo **para** e avisa.
3. Rode a mesma URL duas vezes e confirme que o cache evitou a segunda cobrança.
4. Confira a linha gravada no dashboard.
5. Só então aponte o formulário do cliente para o webhook.

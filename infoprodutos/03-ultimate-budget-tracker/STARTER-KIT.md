# STARTER-KIT #3 — Budget Tracker (specs + fórmulas para buildar)

## A. Setup global (faça primeiro)

- Célula `Settings!B1` = moeda (dropdown: USD,EUR,GBP,BRL). Todas exibições usam `TEXT(value, currencyFormat)` via formato custom `[$USD] #,##0.00` trocado por script simples OU só símbolo concatenado: `=Settings!$B$5 & TEXT(X,"#,##0")` onde B5 = $,€,£,R$.
- Named ranges: `TX_Date, TX_Desc, TX_Cat, TX_Amt, TX_Type` (Transactions A:E), `BD_Cat, BD_Plan` (Budget).
- Proteja tudo exceto células de input (fundo amarelo claro = input). Instrução na aba: "Only edit YELLOW cells".
- Freeze panes: Transactions linha 1 + Dashboard A1.

## B. Aba Transactions (coração)

Colunas: A Date (date validation) | B Description | C Category (dropdown from Categories!A2:A) | D Method (Cash/Card/Pix/Bank) | E Type (Expense/Income) | F Amount (number >0) | G Tag (Need/Want/Joy) | H Notes

- Data validation: C recusa manual (lista estrita), A = data válida.
- Conditional: Income = verde, Expense = default; Tag Want = laranja claro.
- Fórmulas Dashboard (Google Sheets):
  - `Income MTD =SUMIFS(TX_Amt, TX_Type,"Income", TX_Date,">="&EOMONTH(TODAY(),-1)+1)`
  - `Spent MTD =SUMIFS(TX_Amt, TX_Type,"Expense", TX_Date,">="&EOMONTH(TODAY(),-1)+1)`
  - `Saved = Income - Spent`, `Savings rate = IF(Income=0,0,Saved/Income)`
  - Top categorias: `=QUERY(Transactions!A:H,"select C, sum(F) where E='Expense' and month(A)+1="&MONTH(TODAY())&" group by C order by sum(F) desc limit 5 label C 'Category', sum(F) 'Spent'")`
- Excel port: trocar QUERY por PivotTable pronta + SUMIFS (deixar pivot atualizável com 1 clique).

## C. Budget (orçado vs real)

Colunas: Category | Planned | Actual (formula) | Left | % Used | Status
- `Actual =SUMIFS(TX_Amt,TX_Cat,A2,TX_Type,"Expense",TX_Date,">="&Dashboard!$B$2,TX_Date,"<="&EOMONTH(Dashboard!$B$2,0))` onde B2 = primeiro dia do mês selecionado (dropdown mês).
- `Status =IF(%Used>1,"🔴 Over",IF(%Used>0.85,"🟡 Watch","🟢 OK"))`
- Rollover toggle: Settings B10 TRUE/FALSE → Left = Planned - Actual + N Rollover (vlookup mês anterior).

## D. Debt Payoff (snowball + avalanche)

Tabela Debts: Name | Balance | APR % | Min pay | (calc) Payoff order | Interest total
- Inputs amarelos: extra payment/mês (B1), strategy toggle (B2: Snowball/Avalanche).
- Snowball order = SORT by Balance asc; Avalanche = SORT by APR desc.
- Simulação 60 meses (colunas hidden): loop payoff: `balance_{n+1} = balance_n*(1+APR/12) - payment_n`, payment = min + extra distribuído ao primeiro da ordem.
- Outputs: Payoff date (`=EDATE(TODAY(), months_needed)`), Interest saved vs min-only, chart balance over time.
- Scripts EN inclusos (aba Guide): call script para pedir APR menor + e-mail template.

## E. Subscriptions audit

Colunas: Service | $/mo | Billed (Monthly/Yearly) | $/yr (formula) | Next renew | Last used | Keep? (Keep/Cancel/Maybe) | Action
- `Waste =SUMIFS($/yr, Keep?,"Cancel")` em destaque vermelho + "You save $X/yr" verde.
- Conditional: Last used >60 dias = vermelho.

## F. Sinking Funds + Yearly + Net Worth

- Sinking: Fund | Goal | Saved (manual + link TX tag?) | Left (Goal-Saved) | Monthly need (=Left/months to date) | Date | Bar (SPARKLINE: `=SPARKLINE(Saved,{"charttype","bar";"max",Goal})`)
- Yearly: 12 colunas (Jan–Dez) puxando SUMIFS por mês; linha Savings rate com conditional green scale; gráfico combo (bars flow + line savings rate).
- Net Worth lite: snapshot mensal (Checking/Savings/Invest/Debt) + delta vs mês anterior.

## G. Categorias padrão EN (20)

Income: Client Work, Salary, Side Hustle, Refunds. Expense: Rent, Groceries, Eating Out, Transport, Health, Subscriptions, Shopping, Travel, Learning, Tools, Fees & Tax, Gifts, Pets, Other.

## H. Guide PDF 10p (estrutura)

1. Setup 10min (copy sheet, moeda, mês, payday)
2. Ritual 5min/semana (domingo: log + audit + 1 cancel?)
3. Dashboard leitura (health score: savings rate >20% 🟢, burn <90% 🟢)
4. Debt: qual estratégia escolher (flowchart)
5. Freelance: média 3m + reserva 1 mês
6. FAQ + vídeos timestampados

## I. Testes antes do ship (obrigatórios)

- [ ] Adicionar 100 linhas não quebra Dashboard (ARRAYFORMULA com `A2:A` aberto, não `A2:A500` fixo onde der)
- [ ] Trocar moeda USD→EUR→BRL em Settings atualiza símbolos
- [ ] Excel abre sem #NAME? (sem QUERY/ARRAYFORMULA Google-only; pivot refresh OK)
- [ ] Mobile: logar 1 gasto pelo app Sheets em <20s (teste real)
- [ ] Duplicate/copy link funciona em anônimo (View-only → Make a copy)

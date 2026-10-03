# BÔNUS 2 — Rastreador de 21 Dias

Duas versões: a **folha para imprimir** (preenche à mão, cola na geladeira) e o **modelo de planilha** (para quem prefere digitar).

**Regra do rastreador:** preencher todos os dias, inclusive (e principalmente) nos dias ruins. O valor dele está justamente em mostrar a semana ruim — é ali que você descobre o padrão.

---

## VERSÃO 1 — FOLHA PARA IMPRIMIR

**Nome:** ____________________________  **Início:** ____/____/______  **Fim:** ____/____/______

**Minhas âncoras:** acordar às ______:______ · luz até ______:______ · cafeína X = ______:______

| Dia | Acordei às | Luz (s/n) | Última cafeína | Deitei às | Dormi (h aprox.) | Energia manhã (0-10) | Energia tarde (0-10) | Movimento (s/n) | Palavra-chave do dia |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |
| 4 | | | | | | | | | |
| 5 | | | | | | | | | |
| 6 | | | | | | | | | |
| 7 | | | | | | | | | |
| 8 | | | | | | | | | |
| 9 | | | | | | | | | |
| 10 | | | | | | | | | |
| 11 | | | | | | | | | |
| 12 | | | | | | | | | |
| 13 | | | | | | | | | |
| 14 | | | | | | | | | |
| 15 | | | | | | | | | |
| 16 | | | | | | | | | |
| 17 | | | | | | | | | |
| 18 | | | | | | | | | |
| 19 | | | | | | | | | |
| 20 | | | | | | | | | |
| 21 | | | | | | | | | |

**Palavras-chave sugeridas para a última coluna:** `tela` · `jantar tarde` · `cafeína atrasada` · `estresse` · `filhos` · `viagem` · `álcool` · `treino` · `boa`.

---

## VERSÃO 2 — PLANILHA (Google Sheets / Excel)

Crie uma planilha com estas colunas na linha 1 (A a J):

| Coluna | Cabeçalho | Formato | Fórmula sugerida |
|---|---|---|---|
| A | Dia | número (1 a 21) | — |
| B | Acordei às | hora | — |
| C | Luz (s/n) | texto | — |
| D | Última cafeína | hora | — |
| E | Deitei às | hora | — |
| F | Horas dormidas | número | `=SE(E2="";"";24-(E2-B2))` (ajuste se dormir e acordar no mesmo dia) |
| G | Energia manhã | número 0-10 | — |
| H | Energia tarde | número 0-10 | — |
| I | Movimento (s/n) | texto | — |
| J | Palavra-chave | texto | — |

**Indicadores automáticos (linha 23, abaixo dos 21 dias):**

| Indicador | Fórmula | O que significa |
|---|---|---|
| Dias de luz | `=CONT.SE(C2:C22;"s")` | sua âncora mais forte — alvo: 18 de 21 |
| Média de energia da manhã | `=MÉDIA(G2:G22)` | compare com a média dos últimos 3 dias |
| Média de energia da tarde | `=MÉDIA(H2:H22)` | indicador principal de melhora |
| Dias de movimento | `=CONT.SE(I2:I22;"s")` | alvo: 9 de 21 |
| Média de horas de sono | `=MÉDIA(F2:F22)` | referência: 7 h ou mais (AASM/SRS) |

**Gráfico:** selecione as colunas **G e H** (energia manhã e tarde) e insira um gráfico de linhas. A linha da tarde subindo é o sinal mais claro de que o protocolo está pegando.

---

## Como interpretar o rastreador (sem se enganar)

| O que você vê | Leitura | Próximo passo |
|---|---|---|
| Acordar estável (±1h) em 18+ dias | âncora principal firme | mantenha e trabalhe a próxima |
| Acordar variando 2h+ | a âncora está frágil | 7 dias só com essa âncora (sem cobrar o resto) |
| Luz em menos de 12 dias | este é o gargalo | escolha um jeito novo de fazer a luz (caminhada, varanda, café na janela) |
| Energia da tarde caindo todo dia às 15h | energia instável ao longo do dia | capítulo 7 (3 partes na refeição) + bloco 2 |
| Energia da manhã baixa mesmo com 7h+ | noite com tela ou âncora de luz falhando | voltar à semana 1 por 5 dias |
| Muitas palavras-chave `estresse` | o gargalo é a mente | capítulo 9 (3 colunas) |
| Sono médio abaixo de 7h | janela de sono curta | antecipar 30 min a hora de deitar, por 7 dias |
| Nenhuma mudança em 21 dias | não é fracasso, é informação | revise as âncoras **e** procure avaliação profissional (ver aviso da abertura) |

> 📌 **NOTA — uma folha preenchida vale mais que um app.**
> Você pode usar aplicativo, relógio ou qualquer ferramenta — mas a folha de papel tem uma vantagem: ela fica visível. Rastreador escondido no celular é rastreador esquecido.

> 🟪 **CHECKLIST DO BÔNUS 2**
> - [ ] Escolhi a versão (folha impressa ou planilha)
> - [ ] Escrevi minhas três âncoras no topo
> - [ ] Preenchi o dia 1
> - [ ] Marquei um alarme diário para preencher (2 minutos, à noite)
> - [ ] Programei a leitura dos indicadores para os dias 7, 14 e 21

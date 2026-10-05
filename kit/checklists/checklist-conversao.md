# Checklist de Conversão
### Growth Design Pro · Kit de Ferramentas

**Como usar.** Percorra na ordem. A maioria dos problemas de conversão está nos itens 1 a 3 — e a maioria
das pessoas começa a mexer no item 7. Cada linha marcada com ⚡ pode ser corrigida em menos de duas horas.
Ao final, rode a **AI Conversion Optimization API** na URL publicada e compare com a rodada anterior.

> **Regra de ouro.** Não otimize conversão em página sem tráfego. Abaixo de ~1.000 visitas/mês, oito em cada
> dez "melhorias" que você fizer serão ruído estatístico. Nesse caso, use o checklist como auditoria
> heurística e resolva o óbvio — não como teste.

---

## 1. Clareza da proposta (a causa mais comum de não-conversão)

- [ ] Em 5 segundos, um estranho entende **o que é**, **para quem é**, **o que ganha** e **o que fazer**
- [ ] A headline fala do resultado do cliente, não da característica do produto
- [ ] Existe uma frase que explica o mecanismo (por que funciona diferente dos outros)
- [ ] O público-alvo está nomeado em algum lugar acima da dobra
- [ ] A oferta tem preço, prazo ou condição explícita — ou diz claramente qual é a próxima etapa

## 2. Público e mensagem

- [ ] A promessa da página bate com o anúncio/post que trouxe o visitante ⚡
- [ ] Existe uma página por intenção de busca (não uma página para tudo)
- [ ] A linguagem é a do cliente, não a do setor ("financiamento aprovado", não "solução creditícia")
- [ ] As objeções mais comuns estão respondidas **na página**, não no atendimento

## 3. Sinais de confiança (não invente nenhum)

- [ ] Depoimento com nome, contexto e resultado específico — e autorização por escrito em arquivo
- [ ] Prova de existência: endereço, CNPJ, telefone, foto da equipe ou do espaço físico
- [ ] Política de privacidade acessível (obrigatória se há coleta de dado pessoal)
- [ ] Termos claros de garantia, troca ou reembolso
- [ ] Selos e certificações **verdadeiros** — selo falso é passivo jurídico
- [ ] Nenhum contador de escassez falso, comprador inventado ou prazo que reinicia

## 4. Chamada para ação

- [ ] Existe **uma** ação principal por página (as secundárias são discretas)
- [ ] O texto do botão diz o que acontece ("Quero meu orçamento", não "Enviar")
- [ ] O botão aparece ao menos 3 vezes em página longa, com o mesmo destino
- [ ] O microtexto abaixo do botão reduz o medo ("resposta em 1 dia útil", "sem compromisso")
- [ ] Nada de "Clique aqui", "Saiba mais" ou "Enviar" como CTA principal ⚡

## 5. Formulários

- [ ] Campo obrigatório é apenas o que você realmente usa
- [ ] Rótulo sempre visível (placeholder não é rótulo) ⚡
- [ ] Mensagens de erro dizem **o que fazer**, não o que o usuário fez errado
- [ ] Teclado correto no celular (`type="email"`, `type="tel"`, `inputmode`)
- [ ] Existe mensagem de sucesso que confirma o próximo passo
- [ ] Testado no próprio celular, com uma mão, no 4G — e não no Wi-Fi do escritório

## 6. Estrutura e leitura

- [ ] O conteúdo segue a ordem: problema → consequência → solução → prova → oferta → ação
- [ ] A página tem subtítulos que fazem sentido lidos isoladamente (quem escaneia entende)
- [ ] Parágrafos de até 4 linhas; frases de até 25 palavras
- [ ] Nenhum bloco de texto com mais de 150 palavras sem quebra, lista ou imagem
- [ ] Preço, prazo e o que está incluído aparecem **antes** do botão final

## 7. Elementos de decisão

- [ ] Comparação com a alternativa (o que o cliente faria se não comprasse)
- [ ] O que está **fora** da entrega, dito com clareza
- [ ] FAQ com 5 a 8 perguntas que são objeções reais (não perguntas decorativas)
- [ ] Próximo passo com data ou condição ("agendamos a call", "envio a proposta em 24 h")

## 8. Técnico e experiência

- [ ] Carrega em menos de 3 s em conexão móvel real
- [ ] Nenhum elemento que empurra o conteúdo no carregamento (layout shift)
- [ ] Funciona com JavaScript desabilitado (conteúdo e links principais)
- [ ] Foco visível em todos os campos e botões (navegação por teclado)
- [ ] Contraste mínimo AA em todo texto
- [ ] `lang` correto no `<html>`

## 9. Medição

- [ ] Analytics instalado e **testado** (fez um evento de teste? aparece no relatório?)
- [ ] Cada CTA dispara um evento próprio, com nome que você entende em 3 meses
- [ ] Conversão definida como **evento**, não como "visita na página de obrigado"
- [ ] Score de conversão da API registrado na planilha `growth-dashboard.xlsx` antes e depois

---

## Como transformar este checklist em trabalho

1. Percorra todo o checklist e **só marque o que você verificou de fato** — na página publicada, no celular.
2. Rode a **AI Conversion Optimization API** na mesma URL.
3. Compare os dois resultados: onde a API apontou algo que o checklist não pegou, o item do checklist está
   mal escrito — melhore o checklist, não ignore a API.
4. Priorize: itens do bloco 1 e 2 antes de qualquer coisa dos blocos 6 a 8.
5. Registre a rodada no dashboard e defina a data da próxima.

**Erro mais comum na leitura da API:** tratar todas as recomendações com o mesmo peso. Uma API devolve
uma lista; um profissional devolve uma ordem.

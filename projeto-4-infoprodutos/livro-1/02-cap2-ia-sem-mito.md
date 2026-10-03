# CAPÍTULO 2 — IA sem mito: o que ela faz bem, mal e péssimo

Neste capítulo você vai entender o comportamento real da IA e configurar o seu "assistente padrão". Nada de história da computação: vamos direto para o que importa — o que pedir, o que não pedir e como não ser enganado.

---

## 2.1 A metáfora que resolve 90% da confusão

Pense na IA como **um estagiário brilhante, educado, muito rápido e sem memória**.

- **Brilhante:** escreve bem, resume, organiza, cria variações, explica o complicado.
- **Educado:** concorda com você. Se você disser "está errado?", ela muda. Cuide disso.
- **Rápido:** faz em segundos o que você faria em meia hora.
- **Sem memória:** você precisa dar contexto **toda vez** (ou configurar o contexto uma vez, como vamos fazer hoje).

Se você tratar a IA assim, nunca mais vai se decepcionar nem se empolgar demais.

---

## 2.2 O que a IA faz melhor que você

| Tarefa | Por que ela ganha |
|---|---|
| Resumir | Não se perde com texto longo |
| Reescrever para outro tom | Testa 5 versões em 20 segundos |
| Estruturar ideia solta | Organiza tópicos em sequência lógica |
| Gerar variações | Você pede 10 e escolhe 1 |
| Traduzir | Boa qualidade para uso interno |
| Classificar | Categoriza 50 itens por critério |
| Extrair informação | Puxa datas, nomes e valores de um texto |
| Explicar de outro jeito | Reexplica quantas vezes você pedir |

## 2.3 O que ela faz mal

- **Números e fatos recentes.** Ela pode inventar estatística, data, lei e citação. Sempre confira.
- **Contas complexas.** Pode errar cálculo. Peça para mostrar o passo a passo ou use planilha.
- **Contexto da sua empresa.** Ela não sabe quem é seu cliente, qual é o combinado com o time, o que já foi testado.
- **Julgar risco.** Ela não sabe o que está em jogo se aquilo der errado.
- **Dizer "não sei".** Prefere improvisar. Você é quem tem que perguntar: *"o que aqui é suposição?"*

## 2.4 O que ela faz de forma perigosa

> 🟨 **ERRO COMUM**
> Colar dado de cliente na IA. CPF, telefone, endereço, exame médico, número de contrato, informação sob sigilo profissional — nada disso entra. Nem para "só resumir". Não é só um risco de vazamento: é violação de LGPD e, em algumas profissões, de sigilo profissional.
> **Regra prática:** se você não colocaria aquilo em um grupo de WhatsApp da empresa, não coloque na IA.

Também é perigoso: usar texto da IA sem revisar (plágio acidental, erro factual), tomar decisão de saúde/finanças/jurídica baseada apenas no que ela respondeu, e publicar "dados" que ela inventou.

---

## 2.5 As 5 alucinações mais comuns

1. **Estatística inventada** — "70% das empresas..." com número bonito e sem fonte
2. **Citação fantasma** — lei, artigo, livro ou autora que não existe
3. **Referência cruzada errada** — "segundo o capítulo X" quando não é ali
4. **Fórmula errada** — cálculo que parece certo e não fecha
5. **Bula de comportamento** — afirmação categórica sobre saúde, finanças ou direito

**Antídoto universal:** acrescente ao final do pedido:

> "Antes de responder, liste o que você não tem certeza, o que é suposição e o que eu deveria verificar em uma fonte oficial."

---

## 2.6 As ferramentas gratuitas que bastam (e para que serve cada uma)

| Ferramenta | Melhor uso | Custo |
|---|---|---|
| ChatGPT | uso geral, redação, análise de texto, GPT personalizado | versão gratuita resolve 80% |
| Gemini | pesquisa, integração com Google, textos longos | gratuito |
| Claude | textos longos, revisão, estrutura | gratuito (limite de uso) |
| Copilot | quem vive no Word/Excel/PowerPoint | gratuito na versão web |
| NotebookLM | resumir e estudar **os seus próprios** arquivos | gratuito |
| Whisper / ferramentas de transcrição | áudio → texto | gratuito |
| Canva (com IA) | imagem, post, apresentação | gratuito |

Você **não precisa** assinar nada para executar este livro. Assine quando o tempo economizado já estiver pagando a assinatura.

---

## 2.7 O primeiro resultado do livro: a Ficha de Contexto Mestre

Esta é a parte prática. Em vez de explicar sua vida toda a cada prompt, você cria um bloco de contexto uma única vez e cola no começo de cada conversa — ou configura nas "instruções personalizadas" da ferramenta.

**Modelo (preencha e salve no seu celular):**

```
CONTEXTO MESTRE
Quem sou: [seu nome/profissão]
Onde trabalho: [empresa/segmento/tamanho]
Meu público: [quem são, o que precisam]
Meu tom de voz: [ex.: direto e cordial, sem gírias]
O que eu NUNCA quero: [ex.: emoji no e-mail profissional; jargão técnico]
Formato padrão de saída: [ex.: até 150 palavras, em tópicos, com próximo passo]
Dados que não podem aparecer: [ex.: nomes de clientes, valores reais]
```

A partir de agora, todo prompt deste livro assume que você tem esse contexto colado em cima. É isso que faz a diferença entre resposta genérica e resposta útil.

> 🟩 **EXEMPLO REAL**
> Sem contexto, o pedido "escreva um e-mail de cobrança" gera um texto formal de banco.
> Com a Ficha de Contexto Mestre (clínica, tom cordial, paciente atrasado há 15 dias, sem constranger), a resposta sai no tom da casa — e você só ajusta uma palavra ou outra.

---

> 🟦 **FAÇA AGORA (15 min)**
> 1. Abra a ferramenta que você escolheu.
> 2. Cole uma Ficha de Contexto Mestre preenchida.
> 3. Salve a ficha no bloco de notas do celular e no computador.
> 4. Faça um teste simples: peça "escreva um e-mail de recusa educada de prazo" e compare o resultado com o que você receberia sem o contexto.
> 5. Anote em uma linha a diferença. Você acabou de provar para si mesmo que o problema nunca foi a IA — era o pedido.

---

> 🟪 **CHECKLIST DO CAPÍTULO 2**
> - [ ] Entendi o modelo "estagiário brilhante sem memória"
> - [ ] Sei as 3 coisas que nunca coloco na IA
> - [ ] Sei listar suposições antes de aceitar uma resposta
> - [ ] Criei a Ficha de Contexto Mestre
> - [ ] Testei a diferença entre pedido com e sem contexto

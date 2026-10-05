# Roteiros — Módulo 1 e Módulo 2 (10 aulas)

Grave estas dez aulas antes de qualquer outra coisa: elas são o gate do dia 7 do plano de lançamento.
Duração somada: **~90 minutos** de vídeo, que na prática são 3 a 5 horas de gravação.

Convenções usadas abaixo:

- **Gancho** e **Promessa** — texto para falar, quase literal. Sem improviso: são 20 segundos cada.
- **Tela** — o que precisa estar visível no momento.
- **Erro proposital** — o erro que você mostra e corrige na frente da câmera.
- **Artefato** — o arquivo que o aluno baixa, com o caminho real na área de membros.

---

## Aula 1.1 — O que é Design Exponencial

**Duração-alvo:** 8 min · **Arquivo:** `M1-01-design-exponencial.mp4`

**Gancho (0:00–0:20):**
> “O site do seu cliente foi entregue. Bonito. Seis meses depois, ninguém sabe dizer se ele trouxe
> um único cliente. Isso não é problema de design — é problema de projeto.”

**Promessa (0:20–0:40):**
> “Ao final desta aula você vai ter o diagrama que separa design linear de design exponencial, e vai
> saber em qual dos dois está o trabalho que você entrega hoje.”

**Tela:** página de portfólio genérica (a sua, ou um screenshot sem marca) → diagrama
`linear × exponencial` em tela cheia.

**Demonstração (40 s – 80%):**

1. Mostre a jornada linear: layout → entrega → arquivo morto. Anote na tela: *design sem medição
   é opinião*.
2. Mostre a jornada exponencial: layout → entrega → **medição** → ajuste → nova medição. O ciclo é o
   produto.
3. Desenhe o loop ao vivo (setas no quadro ou no próprio diagrama) e diga onde ele quebra em 90% dos
   casos: ninguém mede, então ninguém ajusta.
4. Apresente os três verbos que sustentam o curso: **extrair**, **recombinar**, **construir**.
5. Feche dizendo o que a IA muda — e o que ela não muda: ela executa na sua frente, ela não decide
   o que medir.

**Erro proposital:** abrir uma métrica de painel de analytics e mostrar um número que parece bom mas
é irrelevante (sessões sem conversão). Comente: “métrica que não muda decisão é decoração”.

**Artefato (80%–95%):** `Diagrama PDF — linear × exponencial`, em
**Área de membros → Módulo 1 → 1.1 → Diagrama PDF**.

**Recapitulação:**
- Design linear entrega layout; design exponencial entrega ciclo.
- Sem medição, ajuste é palpite.
- Extrair → recombinar → construir é a espinha do curso.

**Próximo passo:** “Na próxima aula, o método que transforma um site existente em ponto de partida.”

---

## Aula 1.2 — A Metodologia Vibe Design

**Duração-alvo:** 8 min · **Arquivo:** `M1-02-vibe-design.mp4`

**Gancho:**
> “Copiar o site do concorrente é fácil e não resolve nada. Extrair o **sistema** por trás dele é o
> que resolve — e é o que ninguém faz.”

**Promessa:**
> “Ao final desta aula você terá rodado o Prompt de Mil Dólares em um site real e saído com a
> estrutura de um design system documentada.”

**Tela:** `kit/prompts/prompts-pt.md` (§1) aberto ao lado de uma ferramenta de IA generativa.

**Demonstração:**

1. Mostre a diferença entre **copiar aparência** e **extrair sistema**: cores soltas × escala
   tipográfica, ritmo de espaçamento, regras de uso.
2. Abra o prompt 01 (extração de design system). Leia em voz alta só as duas primeiras linhas —
   o resto o aluno lê depois.
3. Cole a URL de um site público (o seu, ou um site de referência; **nunca de cliente sem
   autorização**).
4. Rode. Mostre a saída **como ela sai**, inclusive onde ela chuta.
5. Corrija na frente da câmera: apague a inferência que não dá para verificar, marque
   `[CONFIRMAR: …]` onde faltou informação.
6. Feche com a regra de ética que vale para o curso inteiro: **extrair sistema é aprender linguagem,
   não copiar arquivo**. Marca, texto, foto e ilustração continuam sendo de quem é.

**Erro proposital:** deixar o modelo inventar um valor de contraste ou um nome de fonte. Aponte o
erro, corrija e explique por que um design system com número inventado é pior que nenhum.

**Artefato:** `Prompt 01–06 — Extração de design system`, em
**Área de membros → Módulo 1 → 1.2 → Prompt**.

**Recapitulação:**
- Vibe Design = extrair estrutura, não aparência.
- Todo prompt declara o formato de saída e proíbe invenção.
- Onde falta dado, escreve-se `[CONFIRMAR]`.

**Próximo passo:** “Agora vamos transformar essa saída em arquivo de código.”

---

## Aula 1.3 — Design Systems como Código

**Duração-alvo:** 8 min · **Arquivo:** `M1-03-design-systems-codigo.mp4`

**Gancho:**
> “Um design system que vive só no Figma morre na primeira pressa. Um que vive em tokens sobrevive
> à pressa — e é mais rápido de usar.”

**Promessa:**
> “Ao final desta aula você terá aberto, lido e trocado os tokens de um projeto inteiro mudando um
> único arquivo.”

**Tela:** `site/assets/css/tokens.css` (o design system deste produto) → depois
`kit/templates/design-system-starter-kit/`.

**Demonstração:**

1. Abra `tokens.css` e percorra só os grupos: cor, tipografia, escala fluida, espaçamento, movimento.
2. Explique a decisão editorial: **poucas cores, contraste alto, hierarquia por tipo e não por cor**.
3. Troque, ao vivo, o acento do projeto por outro valor e recarregue a página. O site inteiro muda.
4. Abra o starter kit e mostre os 10 sistemas: mesmos nomes de token, linguagens visuais diferentes.
5. Mostre o rodapé de um dos arquivos: as regras de aplicação (quando usar sombra, quando o acento
   pode entrar, o que nunca fica em corpo de texto).
6. Feche com a regra de acessibilidade: **nenhum par de texto abaixo de AA**, e o verificador
   `tools/verificar.py` mede isso por você.

**Erro proposital:** usar o dourado em um parágrafo de texto corrido, medir o contraste, reprovar e
corrigir. O aluno precisa ver que “bonito” perde para “legível”.

**Artefato:** `tokens.css` comentado, em
**Área de membros → Módulo 1 → 1.3 → tokens.css**.

**Recapitulação:**
- Token é decisão registrada em código.
- Hierarquia por tipo, contraste por último recurso.
- Trocar de linguagem visual deve ser trocar um arquivo.

**Próximo passo:** “Falta a peça que mede: as seis APIs.”

---

## Aula 1.4 — O Ecossistema AI Growth Stack

**Duração-alvo:** 8 min · **Arquivo:** `M1-04-ecossistema-growth-stack.mp4`

**Gancho:**
> “Ferramenta solta não é sistema. Seis ferramentas na ordem errada também não.”

**Promessa:**
> “Ao final desta aula você terá o mapa do funil de 6 etapas e vai saber exatamente o que entra e o
> que sai de cada uma.”

**Tela:** diagrama do funil do site, em tela cheia
(**site → O Funil de Crescimento**).

**Demonstração:**

1. Percorra as seis etapas na ordem, dizendo para cada uma: **entrada → saída**.
   - 1 EXTRACT: URL → dados do site.
   - 2 ANALYZE: dados → nota de SEO por dimensão.
   - 3 WRITE: diagnóstico → copy.
   - 4 OPTIMIZE: página → plano de melhoria de conversão.
   - 5 CONVERT: página + tráfego → onde o visitante desiste.
   - 6 AMPLIFY: conteúdo → posts por plataforma.
2. Explique por que a ordem **não** é a numeração do catálogo: quem escreve antes de diagnosticar
   escreve bonito e errado.
3. Mostre o loop de retorno: amplificar traz tráfego, o tráfego gera dado novo, o dado reabre a
   análise. Diga a cadência honesta: **uma rodada leva semanas, não horas**.
4. Deixe claro o que o curso **não** promete: nenhuma API garante tráfego, ranking ou venda. Elas
   medem e sugerem; quem decide é você.
5. Avise sobre a dependência de terceiros: as assinaturas são feitas por você, na sua conta RapidAPI,
   e o custo é seu (Módulo 4 mostra como controlar).

**Erro proposital:** rodar a etapa 6 antes da 2 e mostrar um calendário de posts que ignora o
diagnóstico. “Conteúdo sem diagnóstico é barulho com boa intenção.”

**Artefato:** `Mapa do funil — 6 etapas`, em
**Área de membros → Módulo 1 → 1.4 → Mapa do funil**.

**Recapitulação:**
- Ordem do funil ≠ ordem do catálogo.
- Cada etapa tem entrada e saída declaradas.
- Nenhuma etapa promete resultado; todas medem.

**Próximo passo:** “A partir daqui, uma API por aula — sempre com chamada real na tela.”

---

## Aula 2.1 — Website Data Extraction: inteligência competitiva

**Duração-alvo:** 10 min · **Arquivo:** `M2-01-extraction.mp4`

**Gancho:**
> “Antes de opinar sobre o site de alguém, leia o que o site diz sobre si mesmo: título, descrição,
> headings, contatos, links. Está tudo no HTML — e quase ninguém lê.”

**Promessa:**
> “Ao final desta aula você terá extraído os dados estruturados de um site real e transformado isso
> em uma lista de lacunas do concorrente.”

**Tela:** painel RapidAPI → API **Website Data Extraction** → aba de endpoints → playground.
Depois: planilha `analise-seo.xlsx`, aba de comparação.

**Demonstração:**

1. Mostre o endpoint e os parâmetros **um por um**, sem pressa. Diga qual parâmetro você usa em 90%
   dos casos e qual você ignora.
2. Rode com uma URL própria. Mostre a resposta crua, com o JSON aberto.
3. Encontre na resposta: title, meta description, H1, contatos, links externos.
4. Traduza “dado” em “decisão”: *se o concorrente não tem meta description em nenhuma página, existe
   uma lacuna fácil de ocupar*.
5. Copie três achados para a planilha de análise. Diga que a planilha serve para decidir, não para
   arquivar.
6. Rode a extração no site do concorrente e compare lado a lado.

**Erro proposital:** rodar a API em um site que bloqueia robô e receber **200 com corpo vazio**. Não
pule: explique que “vazio não é erro de código”, mostre a diferença entre 403, 429 e 200 vazio, e
ensine a checar `robots.txt` e a testar com outro alvo.

**Artefato:** `Planilha analise-seo.xlsx`, em
**Área de membros → Módulo 2 → 2.1 → Analise SEO**.

**Recapitulação:**
- A resposta crua é matéria-prima, não relatório.
- 200 vazio costuma ser bloqueio, não bug.
- Extração serve para achar lacuna, não para copiar.

**Próximo passo:** “Com os dados na mão, vamos dar nota ao site.”

---

## Aula 2.2 — AI SEO Analysis: o score de 1 a 100

**Duração-alvo:** 10 min · **Arquivo:** `M2-02-seo-analysis.mp4`

**Gancho:**
> “Nota 62 em SEO não significa nada até você saber **qual dimensão** puxou a nota para baixo. E é aí
> que quase todo mundo otimiza para o número em vez de otimizar para o cliente.”

**Promessa:**
> “Ao final desta aula a nota vai estar decomposta por dimensão, virada em tarefas com prazo e
> comparada com o concorrente.”

**Tela:** API **AI SEO Analysis** no playground → depois a planilha, aba de plano de 30 dias.

**Demonstração:**

1. Rode a análise na sua URL. Mostre a nota geral e **ignore-a** por um minuto de propósito.
2. Abra dimensão por dimensão. Aponte a que mais pesou negativamente no seu caso.
3. Transforme cada recomendação em tarefa: **ação, dono, prazo**. Sugestão sem dono não é plano.
4. Rode no concorrente e monte a tabela de comparação na planilha.
5. Defina o que fazer em **30 dias**: no máximo 3 frentes. Explique por que priorizar 3 e ignorar o
   resto é o que faz o plano sobreviver ao primeiro contratempo.
6. Marque no dashboard a nota de hoje — é a linha de base contra a qual você vai comparar em 30 dias.

**Erro proposital:** receber uma recomendação de “adicionar mais palavras-chave” e **não** seguir
cegamente. Mostre a armadilha: otimizar para o score em vez de para a intenção de busca — encher a
página de termos e piorar a leitura. Corrija reescrevendo um trecho para uma intenção real.

**Artefato:** `Plano de 30 dias`, em
**Área de membros → Módulo 2 → 2.2 → checklist SEO on-page** + planilha.

**Recapitulação:**
- A nota é um resumo; as dimensões são o diagnóstico.
- Recomendação sem prazo e sem dono é decoração.
- Três frentes por rodada, no máximo.

**Próximo passo:** “Nota boa não converte sozinha. Vamos olhar para o caminho do visitante.”

---

## Aula 2.3 — AI Conversion Optimization: onde o visitante desiste

**Duração-alvo:** 10 min · **Arquivo:** `M2-03-conversion.mp4`

**Gancho:**
> “O visitante não desiste porque o botão é cinza. Ele desiste porque não entendeu o que ganha —
> e o botão só ficou no caminho.”

**Promessa:**
> “Ao final desta aula você terá a análise de conversão de uma página real e uma fila de correções
> ordenada por impacto, não por facilidade.”

**Tela:** API **AI Conversion Optimization** → a página-alvo em tela dividida.

**Demonstração:**

1. Rode a análise. Leia em voz alta as dimensões avaliadas: formulários, CTAs, estrutura, sinais de
   confiança, UX.
2. Ordene os achados em **impacto × esforço**. Mostre na tela os dois eixos e posicione cada item.
3. Atacar primeiro a **proposta de valor** e a clareza da primeira dobra — antes de mexer em cor de
   botão.
4. Mostre um sinal de confiança que passa: política de privacidade linkada no formulário, prazo de
   resposta dito em texto, sem depoimento inventado.
5. Trave a regra de honestidade: **nenhum número sem origem, nenhum depoimento sem autorização**.
6. Escolha **duas** correções para a página e agende a próxima medição.

**Erro proposital:** corrigir o texto do CTA primeiro. Mostre a página depois da correção do botão —
a taxa não muda porque a oferta continua confusa. Volte, corrija a proposta de valor, e explique a
ordem: **oferta → clareza → fricção → estética**.

**Artefato:** `Checklist de conversão`, em
**Área de membros → Módulo 2 → 2.3 → Checklist conversão**.

**Recapitulação:**
- Fricção se corrige depois da clareza.
- Sinal de confiança precisa ser verificável.
- Sem volume de tráfego, diferença pequena é ruído — a checklist diz quando parar.

**Próximo passo:** “Vamos escrever a página nova — com o diagnóstico como briefing.”

---

## Aula 2.4 — AI Website Copywriter: texto que ranqueia e vende

**Duração-alvo:** 10 min · **Arquivo:** `M2-04-copywriter.mp4`

**Gancho:**
> “A primeira geração de texto da IA é sempre aceitável — e é exatamente por isso que ela é perigosa:
> aceitável não diferencia.”

**Promessa:**
> “Ao final desta aula você terá titles, meta descriptions, headings e uma seção completa escritos a
> partir de um diagnóstico real — e editados por você, não apenas aceitos.”

**Tela:** API **AI Website Copywriter** → editor de texto simples ao lado.

**Demonstração:**

1. Alimente a API com o diagnóstico da aula anterior, não com um pedido genérico. Mostre a diferença
   na entrada: **contexto vira qualidade**.
2. Gere o pacote: title, meta, H1, H2, CTA.
3. Edite na frente da câmera: corte adjetivo, troque “soluções inovadoras” por verbo concreto, ajuste
   o tom para o público real.
4. Mostre o antes/depois de um title: `Consultoria de Marketing Digital` → `Plano de 30 dias para
   clínicas que já têm site e não recebem contato`.
5. Rode duas variações de headline e explique o que muda: público, promessa, prova.
6. Deixe a regra: **a IA escreve, você assina**. Quem assina responde por exagero.

**Erro proposital:** publicar a primeira geração. Leia em voz alta um parágrafo genérico e mostre
como ele serviria para qualquer empresa do mundo — e, por isso, não serve para nenhuma. Reescreva.

**Artefato:** `Prompts 13–20 — Conteúdo e copy`, em
**Área de membros → Módulo 2 → 2.4 → Prompt**.

**Recapitulação:**
- Contexto no prompt = qualidade na saída.
- Tom de voz é edição humana, não parâmetro mágico.
- Texto sem prova é texto sem crédito.

**Próximo passo:** “E se a página já existe e tem tráfego? Otimizamos o que está lá.”

---

## Aula 2.5 — AI Landing Page Optimizer: refinando o que já existe

**Duração-alvo:** 10 min · **Arquivo:** `M2-05-landing-optimizer.mp4`

**Gancho:**
> “Reescrever a página inteira é caro e arriscado. Otimizar o que já funciona é barato — desde que
> exista dado para ler.”

**Promessa:**
> “Ao final desta aula você terá um plano de teste para uma página existente e vai saber quando
> **não** vale a pena testar.”

**Tela:** API **AI Landing Page Optimizer** → painel de analytics com dados reais (da sua página).

**Demonstração:**

1. Rode a análise: headline, CTA, hierarquia visual, caminho de conversão.
2. Abra o analytics e leia os números junto com o plano. Aponte o mínimo necessário para medir:
   **você precisa de volume**, e abaixo de ~1.000 visitas/mês nenhum teste de cor se sustenta.
3. Desenhe o teste: hipótese, variante única, métrica principal, prazo, e o que fazer se perder.
4. Explique a ressalva de amostra: resultado com 40 visitas é anedota, não evidência.
5. Rode a comparação com o concorrente e mostre o que dá para copiar (estrutura de argumento) e o que
   não (marca e texto).
6. Agende a leitura do resultado na planilha — teste sem data de leitura não termina.

**Erro proposital:** mostrar um “ganho de 200%” em uma amostra de 15 visitas. Faça a conta na tela:
200% de 15 é nada. Corrija o painel para mostrar volume junto da taxa.

**Artefato:** `Prompts 21–26 — Landing page`, em
**Área de membros → Módulo 2 → 2.5 → Template de LP** + prompts.

**Recapitulação:**
- Teste precisa de volume e de prazo.
- Uma variável por vez.
- Amostra pequena não gera conclusão — gera próxima hipótese.

**Próximo passo:** “A página está pronta. Falta levar gente até ela.”

---

## Aula 2.6 — AI Social Media Generator: amplificação

**Duração-alvo:** 9 min · **Arquivo:** `M2-06-social.mp4`

**Gancho:**
> “Postar o mesmo texto em quatro redes é o jeito mais rápido de parecer desinteressante em quatro
> lugares ao mesmo tempo.”

**Promessa:**
> “Ao final desta aula você terá um mês de conteúdo distribuído em quatro plataformas, com a mesma
> ideia em quatro formatos — e uma regra clara de proporção entre útil, prova e oferta.”

**Tela:** API **AI Social Media Content Generator** → planilha `calendario-social.xlsx`.

**Demonstração:**

1. Gere a partir do **conteúdo do site**, não do nada: alimente a API com a página que passou pelo
   funil. Mostre a diferença de qualidade na saída.
2. Pegue **uma** ideia e transforme em quatro formatos: thread no X, post longo no LinkedIn, carrossel
   no Instagram, resumo para Facebook. Explique o que muda em cada um: tamanho, gancho, formato.
3. Aplique a regra **70/20/10**: 70% útil, 20% prova, 10% oferta. Preencha o calendário com números
   reais e mostre o mês inteiro montado.
4. Defina o que fazer com o que performou: reciclar depois de 60 dias, com dado novo.
5. Trave a proibição: nada de métrica inventada, nada de antes/depois fabricado, nada de depoimento
   sem autorização — a auditoria de honestidade (§8) existe para isso.

**Erro proposital:** publicar o mesmo texto em quatro redes. Mostre o resultado na tela: a mesma
frase em quatro formatos diferentes; em duas ela fica deslocada. Reescreva uma delas e compare.

**Artefato:** `Calendário Social (70/20/10)`, em
**Área de membros → Módulo 2 → 2.6 → Calendário Social**.

**Recapitulação:**
- Uma ideia, quatro formatos — não um texto, quatro cópias.
- 70/20/10 mantém reputação antes de vender.
- Prova sem autorização é passivo.

**Próximo passo:** “Módulo 2 fechado. No Módulo 3, as seis etapas rodam em sequência, num projeto real.”

---

## Checklist antes de subir as dez aulas

- [ ] Nenhuma chave de API, e-mail ou nome de cliente apareceu em nenhum frame.
- [ ] Cada aula mostra **uma chamada real** e **um erro real** corrigido.
- [ ] O artefato citado existe na área de membros e abre no navegador.
- [ ] O áudio não tem microfone interno, ventilador nem notificação.
- [ ] Toda promessa feita em aula é executável sem quebrar as regras de `vendas/README.md`.
- [ ] Duração somada próxima de 90 min; nenhuma aula passando de 12 min.

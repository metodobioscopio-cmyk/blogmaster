/* =========================================================================
   BLOGMASTER — PINMIND · MOTOR DE PROMPTS
   14 geradores de prompt que fazem o trabalho pesado por você.
   Cada gerador devolve { titulo, papeis, texto, dicas[] }
   ========================================================================= */

const PM_PROMPTS = (() => {

  /* ---------- utilidades ---------- */
  const linha = (t) => '────────────────────────────────────────────';
  const bloco = (titulo, corpo) => titulo + '\n' + corpo;

  const personaPinterest = (lang) => lang === 'en'
    ? 'You are a senior Pinterest SEO strategist and viral content creator with 8 years of experience. You understand that Pinterest is a visual search engine (not a social network), that fresh pins win in 2026, and that keyword-rich titles of 40-60 characters earn +67% more impressions.'
    : 'Você é um estrategista sênior de SEO para Pinterest e criador de conteúdo viral com 8 anos de experiência. Você entende que o Pinterest é um buscador visual (não uma rede social), que pins frescos vencem em 2026 e que títulos ricos em palavra-chave com 40 a 60 caracteres rendem +67% mais impressões.';

  const regras = (lang) => lang === 'en'
    ? [
        'Never use generic words: be hyper-specific.',
        'Do not use more than 5 hashtags.',
        'No link shorteners, no result promises, no health or income guarantees.',
        'Write for humans; keywords must fit naturally, never stuffed.',
        'Each output must be ready to copy and paste without editing.',
        'If any required information is missing, ASK me before inventing.'
      ].join('\n- ')
    : [
        'Nunca use palavra genérica: seja hiperespecífico.',
        'Não use mais de 5 hashtags.',
        'Sem encurtador de link, sem promessa de resultado, sem garantia de saúde ou de renda.',
        'Escreva para humano; a palavra-chave entra natural, nunca forçada.',
        'Cada saída deve estar pronta para copiar e colar sem edição.',
        'Se faltar alguma informação, PERGUNTE antes de inventar.'
      ].join('\n- ');

  const ctxBase = (c, lang) => {
    const l = [];
    if (c.nicho)        l.push((lang === 'en' ? 'Niche: ' : 'Nicho: ') + c.nicho);
    if (c.sub)          l.push((lang === 'en' ? 'Sub-niche: ' : 'Sub-nicho: ') + c.sub);
    if (c.keyword)      l.push((lang === 'en' ? 'Primary keyword: ' : 'Palavra-chave principal: ') + c.keyword);
    if (c.produto)      l.push((lang === 'en' ? 'Product/offer: ' : 'Produto/oferta: ') + c.produto);
    if (c.tipoOferta)   l.push((lang === 'en' ? 'Offer type: ' : 'Tipo de oferta: ') + c.tipoOferta);
    if (c.comissao)     l.push((lang === 'en' ? 'Commission: ' : 'Comissão: ') + c.comissao);
    if (c.publico)      l.push((lang === 'en' ? 'Target audience: ' : 'Público-alvo: ') + c.publico);
    if (c.estilo)       l.push((lang === 'en' ? 'Chosen visual style: ' : 'Estilo visual escolhido: ') + c.estilo);
    if (c.marca)        l.push((lang === 'en' ? 'Brand/account: ' : 'Marca/conta: ') + c.marca);
    if (c.observacoes)  l.push((lang === 'en' ? 'Extra notes: ' : 'Observações extras: ') + c.observacoes);
    return l.length ? l.join('\n') : (lang === 'en' ? '(not provided yet)' : '(não informado ainda)');
  };

  const lista = (arr, lang, keyPt, keyEn) =>
    arr.map((x, i) => (i + 1) + '. ' + (lang === 'en' ? x[keyEn] : x[keyPt])).join('\n');

  /* =======================================================================
     01 · MÁQUINA DE NICHOS
     ======================================================================= */
  function nichos(c, lang) {
    const papeis = lang === 'en' ? ['Research strategist'] : ['Estrategista de pesquisa'];
    if (lang === 'en') return {
      titulo: 'Prompt 1 — Niche Machine (find 12 money-ready niches)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Generate 12 Pinterest niches that are monetizable in 2026 and can be produced 100% with FREE AI tools.

FOR EACH NICHE, OUTPUT A TABLE WITH:
1. Niche name (specific, never "lifestyle")
2. Three sub-niches with real search intent
3. Estimated demand on Pinterest (High / Medium / Low) and WHY
4. Average ticket and most likely monetization path (affiliate / own digital product / service / ads)
5. AI production difficulty (Easy / Medium / Hard) and which free tool fits
6. One long-tail keyword you would target on day 1
7. The single biggest risk of this niche

CONTEXT
${ctxBase(c, 'en')}

RULES
- ${regras('en')}
- Rank the 12 niches from best to worst opportunity for a beginner with zero budget.
- At the end, pick the TOP 3 and justify in 2 lines each.
- Then ask me: which of the 3 do I want to validate today?`
    };
    return {
      titulo: 'Prompt 1 — Máquina de Nichos (12 nichos prontos para monetizar)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Gere 12 nichos de Pinterest monetizáveis em 2026 e que eu consiga produzir 100% com ferramentas de IA GRÁTIS.

PARA CADA NICHO, ENTREGUE UMA TABELA COM:
1. Nome do nicho (específico, nunca "lifestyle")
2. Três sub-nichos com intenção real de busca
3. Demanda estimada no Pinterest (Alta / Média / Baixa) e POR QUÊ
4. Ticket médio e o caminho de monetização mais provável (afiliado / produto digital próprio / serviço / anúncios)
5. Dificuldade de produção com IA (Fácil / Médio / Difícil) e qual ferramenta grátis encaixa
6. Uma palavra-chave long-tail para atacar no dia 1
7. O maior risco desse nicho

CONTEXTO
${ctxBase(c, 'pt')}

REGRAS
- ${regras('pt')}
- Ordene os 12 do melhor para o pior em oportunidade para um iniciante sem verba.
- No fim, escolha o TOP 3 e justifique em 2 linhas cada.
- Depois me pergunte: qual dos 3 eu quero validar hoje?`
    };
  }

  /* =======================================================================
     02 · CAÇADOR DE OFERTAS
     ======================================================================= */
  function ofertas(c, lang) {
    const papeis = lang === 'en' ? ['Offer hunter', 'Compliance checker'] : ['Caçador de ofertas', 'Verificador de compliance'];
    if (lang === 'en') return {
      titulo: 'Prompt 2 — Offer Hunter (10 monetizable offers for the niche)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
List 10 concrete offers (affiliate programs or own digital products) that I can promote on Pinterest in this niche.

CONTEXT
${ctxBase(c, 'en')}

FOR EACH OFFER, OUTPUT:
1. Offer name + platform where it is registered
2. Type: affiliate (infoproduct / physical / SaaS / recurring) or own product
3. Commission and payment terms
4. Cookie window
5. Direct linking on Pinterest allowed? (Yes / No / Unknown — and if No, what is the workaround)
6. Price range and commission per sale in money
7. Is it a prohibited category on Pinterest? (weapons, tobacco, adult, gambling, etc.)
8. My honest verdict: viable / viable with a landing page / avoid

RANKING
Sort by: (commission per sale × trust) ÷ friction to produce free AI pins.

FINISH WITH
- The 3 best for a beginner
- The 2 I should avoid and why
- A single block, ready to copy, containing the exact questions I must ask the affiliate manager before promoting.`
    };
    return {
      titulo: 'Prompt 2 — Caçador de Ofertas (10 ofertas para o nicho)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Liste 10 ofertas concretas (programas de afiliado ou produtos digitais próprios) que eu consiga promover no Pinterest nesse nicho.

CONTEXTO
${ctxBase(c, 'pt')}

PARA CADA OFERTA, ENTREGUE:
1. Nome da oferta + plataforma onde ela está cadastrada
2. Tipo: afiliado (infoproduto / físico / SaaS / recorrente) ou produto próprio
3. Comissão e condições de pagamento
4. Janela de cookie
5. Permite link direto no Pinterest? (Sim / Não / Incerto — e se Não, qual o caminho alternativo)
6. Faixa de preço e comissão por venda em reais
7. É categoria proibida no Pinterest? (arma, tabaco, adulto, aposta etc.)
8. Meu veredito honesto: viável / viável com página de destino / evitar

ORDENAÇÃO
Ordene por: (comissão por venda × confiança do produtor) ÷ atrito para produzir pins grátis com IA.

FECHE COM
- As 3 melhores para um iniciante
- As 2 que eu devo evitar e o motivo
- Um bloco único, pronto para copiar, com as perguntas exatas que devo fazer ao gerente de afiliados antes de divulgar.`
    };
  }

  /* =======================================================================
     03 · MÁQUINA DE ÂNGULOS
     ======================================================================= */
  function angulos(c, lang) {
    const papeis = lang === 'en' ? ['Viral angle strategist'] : ['Estrategista de ângulos virais'];
    const kw = c.keyword || (lang === 'en' ? '[YOUR KEYWORD]' : '[SUA PALAVRA-CHAVE]');
    if (lang === 'en') return {
      titulo: 'Prompt 3 — Angle Machine (1 keyword → 10 pin angles)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Turn ONE keyword into 10 completely different Pinterest pin angles.

KEYWORD: ${kw}
CONTEXT
${ctxBase(c, 'en')}

FOR EACH ANGLE, OUTPUT:
1. Format name (e.g. "List", "Mistake", "Transformation", "Cheat sheet", "Myth", "Budget", "Routine", "Comparison", "Beginner path", "Before/After")
2. Pin idea title, 5-8 words (this is the overlay text)
3. The emotional trigger used (curiosity / relief / aspiration / fear of wasting money / status)
4. Which visual style fits best (light & bright / bold typographic / top-down / lifestyle / checklist infographic / numbered grid / before-after / mockup)
5. The exact promise the pin makes
6. The type of page it should link to (affiliate offer / article / product page / free download)

RULES
- ${regras('en')}
- All 10 must be genuinely different, not reworded versions of each other.
- Keep everything in the SAME LANGUAGE as the keyword.
- End with a table ranking the 10 by "ease of producing with free AI" vs "expected save rate".`
    };
    return {
      titulo: 'Prompt 3 — Máquina de Ângulos (1 palavra-chave → 10 ângulos de pin)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Transforme UMA palavra-chave em 10 ângulos de pin completamente diferentes para Pinterest.

PALAVRA-CHAVE: ${kw}
CONTEXTO
${ctxBase(c, 'pt')}

PARA CADA ÂNGULO, ENTREGUE:
1. Nome do formato (ex.: "Lista", "Erro", "Transformação", "Cola", "Mito", "Orçamento", "Rotina", "Comparativo", "Caminho do iniciante", "Antes/Depois")
2. Título da ideia do pin, com 5 a 8 palavras (esse é o texto do overlay)
3. O gatilho emocional usado (curiosidade / alívio / aspiração / medo de perder dinheiro / status)
4. Qual estilo visual encaixa melhor (light & bright / bold tipográfico / top-down / lifestyle / checklist infográfico / grade numerada / antes-depois / mockup)
5. A promessa exata que o pin faz
6. O tipo de página para onde ele deve apontar (oferta de afiliado / artigo / página de produto / download grátis)

REGRAS
- ${regras('pt')}
- Os 10 precisam ser realmente diferentes, não versões reescritas do mesmo.
- Mantenha tudo no MESMO IDIOMA da palavra-chave.
- Termine com uma tabela ordenando os 10 por "facilidade de produzir com IA grátis" versus "potencial de save".`
    };
  }

  /* =======================================================================
     04 · FÁBRICA DE PINS (texto + imagem, 1 ângulo → 5 pins)
     ======================================================================= */
  function fichaPin(c, lang) {
    const papeis = lang === 'en' ? ['Copywriter', 'Pinterest SEO', 'Prompt engineer'] : ['Copywriter', 'SEO Pinterest', 'Engenheiro de prompt'];
    const estilo = c.estilo ? c.estilo : (lang === 'en' ? 'Light & Bright' : 'Light & Bright');
    if (lang === 'en') return {
      titulo: 'Prompt 4 — Pin Factory (1 angle → 5 complete pins)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Take ONE pin angle and produce a COMPLETE, ready-to-publish pack of 5 pins (Pinterest rewards fresh pins — 5 different designs beat 1 perfect design).

ANGLE: ${c.angulo || '[YOUR ANGLE]'}
CONTEXT
${ctxBase(c, 'en')}

FOR EACH OF THE 5 PINS, OUTPUT EXACTLY THIS FORM:

PIN #n
- TITLE (40-60 chars, keyword included, no clickbait lie):
- DESCRIPTION (2-4 natural lines, keyword + 1 synonym, ending with a soft CTA):
- ALT TEXT (max 200 chars, describing the image):
- OVERLAY TEXT (5-8 words, bold, readable at thumbnail size):
- IMAGE PROMPT (see rules below):
- FILE NAME (keyword-with-hyphens.png):
- BOARD SUGGESTION:
- HASHTAGS (max 5):

IMAGE PROMPT RULES
- Must start with the visual style: "${estilo}"
- Describe: subject, action, setting, lighting, colors, composition, negative space for text overlay.
- Vertical 2:3 composition (1000x1500). Leave the top third clean for text.
- NEVER ask for text inside the AI image (text is added later in Canva).
- No logos, no real brands, no celebrity faces, no distorted hands.
- Write the image prompt in ENGLISH (image models respond better in English), even if the copy is in Portuguese.

RULES
- ${regras('en')}
- The 5 pins must differ in: headline angle, visual composition, and background — not only in wording.
- End with: the recommended posting order across 5 different boards.`
    };
    return {
      titulo: 'Prompt 4 — Fábrica de Pins (1 ângulo → 5 pins completos)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Pegue UM ângulo de pin e produza um pacote COMPLETO, pronto para publicar, com 5 pins (o Pinterest premia pin fresco — 5 designs diferentes valem mais que 1 design perfeito).

ÂNGULO: ${c.angulo || '[SEU ÂNGULO]'}
CONTEXTO
${ctxBase(c, 'pt')}

PARA CADA UM DOS 5 PINS, ENTREGUE EXATAMENTE NESTE FORMULÁRIO:

PIN nº
- TÍTULO (40 a 60 caracteres, com a palavra-chave, sem promessa mentirosa):
- DESCRIÇÃO (2 a 4 linhas naturais, palavra-chave + 1 sinônimo, terminando com um CTA suave):
- ALT TEXT (máx. 200 caracteres, descrevendo a imagem):
- TEXTO DO OVERLAY (5 a 8 palavras, bold, legível no tamanho de thumbnail):
- PROMPT DA IMAGEM (ver regras abaixo):
- NOME DO ARQUIVO (palavra-chave-com-hifens.png):
- BOARD SUGERIDO:
- HASHTAGS (máx. 5):

REGRAS DO PROMPT DE IMAGEM
- Comece sempre pelo estilo visual: "${estilo}"
- Descreva: sujeito, ação, cenário, iluminação, cores, composição e o espaço negativo para o texto.
- Composição vertical 2:3 (1000x1500). Deixe o terço superior limpo para o texto.
- NUNCA peça texto dentro da imagem gerada (o texto entra depois, no Canva).
- Sem logo, sem marca real, sem rosto de celebridade, sem mão deformada.
- Escreva o prompt de imagem em INGLÊS (os modelos de imagem respondem melhor em inglês), mesmo que a copy esteja em português.

REGRAS
- ${regras('pt')}
- Os 5 pins devem diferir em: ângulo do título, composição visual e fundo — não apenas em palavras.
- Termine com: a ordem de publicação recomendada em 5 boards diferentes.`
    };
  }

  /* =======================================================================
     05 · VISUAL QUE MAIS SE VÊ
     ======================================================================= */
  function visual(c, lang) {
    const papeis = lang === 'en' ? ['Art director', 'Prompt engineer'] : ['Diretor de arte', 'Engenheiro de prompt'];
    if (lang === 'en') return {
      titulo: 'Prompt 5 — Visual Validator (what is actually winning in the feed)',
      papeis,
      texto: `You are an art director specialised in Pinterest creative that converts, with access to 2026 benchmark data.

CONTEXT
${ctxBase(c, 'en')}
Chosen visual style: ${c.estilo || '(not chosen)'}

TASK — PRODUCE 4 OUTPUTS

OUTPUT 1 · STYLE DIAGNOSIS
Tell me if the chosen style matches this niche and this audience. If not, name the 2 better alternatives and why.
Use these 2026 design facts as your baseline: 2:3 vertical beats square by +45% impressions and +22% clicks; text overlay of 5-8 bold words adds +110% clicks vs no text; warm/light backgrounds add +38% saves; image with a real person in lifestyle context adds +14% impressions; thick borders cost -9% impressions.

OUTPUT 2 · 3 IMAGE PROMPTS (in English, ready to paste)
For each: a different visual approach for the SAME message. Each prompt must specify:
subject + action + setting + lighting direction + color palette + composition + where the negative space for the text overlay goes + aspect ratio 2:3 + "no text, no logos, no watermark" + photographic/illustration quality keywords.
Make them long and specific (60-90 words each).

OUTPUT 3 · CANVA EXECUTION SHEET
- Font pairing (bold sans-serif + secondary) free in Canva
- Exact hex color palette (background, text, accent)
- Text box size relative to the pin and safe margins (8-10%)
- 3 rules for keeping brand consistency across 50 pins

OUTPUT 4 · KILL LIST
List 6 visual mistakes that would make these pins flop in this specific niche.

RULES
- ${regras('en')}
- Be opinionated: pick one favourite of the three and defend it in 2 lines.`
    };
    return {
      titulo: 'Prompt 5 — Validador de Visual (o que realmente está vencendo no feed)',
      papeis,
      texto: `Você é diretor de arte especializado em criativos de Pinterest que convertem, com acesso aos dados de benchmark de 2026.

CONTEXTO
${ctxBase(c, 'pt')}
Estilo visual escolhido: ${c.estilo || '(não escolhido)'}

TAREFA — ENTREGUE 4 SAÍDAS

SAÍDA 1 · DIAGNÓSTICO DE ESTILO
Diga se o estilo escolhido combina com este nicho e este público. Se não combinar, aponte as 2 alternativas melhores e por quê.
Use como base estes fatos de design de 2026: 2:3 vertical vence o quadrado em +45% impressões e +22% cliques; overlay de 5 a 8 palavras em bold soma +110% cliques contra pin sem texto; fundo claro/quente soma +38% saves; imagem com pessoa real em contexto lifestyle soma +14% impressões; borda grossa custa -9% impressões.

SAÍDA 2 · 3 PROMPTS DE IMAGEM (em inglês, prontos para colar)
Para cada um: uma abordagem visual diferente para a MESMA mensagem. Cada prompt deve especificar:
sujeito + ação + cenário + direção da luz + paleta de cores + composição + onde fica o espaço negativo para o texto + proporção 2:3 + "no text, no logos, no watermark" + termos de qualidade fotográfica ou de ilustração.
Faça os prompts longos e específicos (60 a 90 palavras cada).

SAÍDA 3 · FICHA DE EXECUÇÃO NO CANVA
- Par de fontes (sans-serif bold + secundária) gratuitas no Canva
- Paleta exata em hexadecimal (fundo, texto, destaque)
- Tamanho relativo da caixa de texto e margem de segurança (8 a 10%)
- 3 regras para manter a consistência de marca em 50 pins

SAÍDA 4 · LISTA DE MORTE
Liste 6 erros visuais que fariam esses pins fracassarem neste nicho específico.

REGRAS
- ${regras('pt')}
- Seja opinativo: escolha um favorito dos três e defenda em 2 linhas.`
    };
  }

  /* =======================================================================
     06 · COPY DO PIN (reescrita e teste A/B de título)
     ======================================================================= */
  function titulo(c, lang) {
    const papeis = lang === 'en' ? ['Headline writer'] : ['Redator de headlines'];
    if (lang === 'en') return {
      titulo: 'Prompt 6 — Headline Lab (20 titles, ranked by click probability)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Write 20 different Pinterest titles for the SAME pin, then rank them.

CONTEXT
${ctxBase(c, 'en')}
Current title (if any): ${c.tituloAtual || '(none)'}

RULES FOR EACH TITLE
- 40-60 characters
- Contains the primary keyword naturally
- Promises a concrete benefit or opens a curiosity gap — never lies
- No ALL CAPS, no excessive emoji (max 1), no clickbait about health/money results

OUTPUT
Table with 4 columns: | # | Title | Characters | Trigger used (curiosity/benefit/specificity/number/contrarian) |

THEN
1. Top 5 ranking with a one-line justification each
2. For the #1 title: 3 alternative descriptions of 2-4 lines each (different CTAs: save, click, download, compare)
3. The single worst title of the 20 and why it would fail
4. 5 long-tail keywords related to the main keyword that I could use in the next pins`
    };
    return {
      titulo: 'Prompt 6 — Laboratório de Títulos (20 títulos, ranqueados por chance de clique)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Escreva 20 títulos de Pinterest diferentes para o MESMO pin e depois ranqueie.

CONTEXTO
${ctxBase(c, 'pt')}
Título atual (se existir): ${c.tituloAtual || '(nenhum)'}

REGRAS PARA CADA TÍTULO
- 40 a 60 caracteres
- Contém a palavra-chave principal de forma natural
- Promete um benefício concreto ou abre uma lacuna de curiosidade — nunca mente
- Sem CAIXA ALTA, sem excesso de emoji (máx. 1), sem clickbait de saúde ou de renda

SAÍDA
Tabela com 4 colunas: | # | Título | Caracteres | Gatilho usado (curiosidade/benefício/especificidade/número/contra-intuitivo) |

DEPOIS
1. Top 5 com justificativa de uma linha cada
2. Para o título nº 1: 3 descrições alternativas de 2 a 4 linhas (CTAs diferentes: salvar, clicar, baixar, comparar)
3. O pior título dos 20 e por que ele fracassaria
4. 5 palavras-chave long-tail relacionadas à principal que eu poderia usar nos próximos pins`
    };
  }

  /* =======================================================================
     07 · PÁGINA DE DESTINO / ARTIGO
     ======================================================================= */
  function pagina(c, lang) {
    const papeis = lang === 'en' ? ['SEO writer', 'Conversion copywriter'] : ['Redator SEO', 'Copywriter de conversão'];
    const link = c.linkAfiliado || (lang === 'en' ? '[YOUR AFFILIATE LINK]' : '[SEU LINK DE AFILIADO]');
    if (lang === 'en') return {
      titulo: 'Prompt 7 — Landing Page / Article (with compliance built in)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Write a complete landing page (or blog article) that receives Pinterest traffic and converts, for this offer.

CONTEXT
${ctxBase(c, 'en')}
Affiliate link (I will paste it manually later): ${link}

STRUCTURE REQUIRED
1. H1 with the primary keyword (the same promise as the pin — never break the promise)
2. AFFILIATE DISCLOSURE, clearly visible, BEFORE the first affiliate link
3. Short intro (3-4 lines) that confirms the reader is in the right place
4. 4 to 6 H2 sections answering the real questions of this audience
5. One comparison or criteria list (helps decision, builds trust)
6. Honest pros and cons of the offer
7. FAQ with 5 questions (format: question as H3 + direct 2-3 line answer)
8. A single, clear final CTA (not five CTAs)
9. Space marked EXACTLY as [INSERIR LINK AQUI] / [INSERT LINK HERE] where I paste the affiliate link manually

RULES
- ${regras('en')}
- Write like a human: short paragraphs, no fluff, no "in today's world".
- No unrealistic promises. No fake personal testimony.
- 800-1200 words.
- Finish with: 5 Pinterest titles to promote this page.`
    };
    return {
      titulo: 'Prompt 7 — Página de Destino / Artigo (com compliance embutido)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Escreva uma página de destino (ou artigo de blog) completa que receba tráfego do Pinterest e converta, para esta oferta.

CONTEXTO
${ctxBase(c, 'pt')}
Link de afiliado (eu vou colar manualmente depois): ${link}

ESTRUTURA OBRIGATÓRIA
1. H1 com a palavra-chave principal (a mesma promessa do pin — nunca quebre a promessa)
2. AVISO DE AFILIADO, claramente visível, ANTES do primeiro link de afiliado
3. Introdução curta (3 a 4 linhas) confirmando que o leitor está no lugar certo
4. 4 a 6 seções H2 respondendo às dúvidas reais desse público
5. Uma tabela comparativa ou lista de critérios (ajuda a decidir, constrói confiança)
6. Prós e contras honestos da oferta
7. FAQ com 5 perguntas (formato: pergunta como H3 + resposta direta de 2 a 3 linhas)
8. Um único CTA final, claro (não cinco CTAs)
9. Espaço marcado EXATAMENTE como [INSERIR LINK AQUI] onde eu colo o link de afiliado manualmente

REGRAS
- ${regras('pt')}
- Escreva como humano: parágrafos curtos, sem enrolação, sem "no mundo de hoje".
- Sem promessa irreal. Sem depoimento pessoal falso.
- 800 a 1200 palavras.
- Termine com: 5 títulos de Pinterest para divulgar esta página.`
    };
  }

  /* =======================================================================
     08 · ROTEIRO DE VÍDEO (video pin 6-15s)
     ======================================================================= */
  function video(c, lang) {
    const papeis = lang === 'en' ? ['Short-form video director'] : ['Diretor de vídeo curto'];
    if (lang === 'en') return {
      titulo: 'Prompt 8 — Video Pin Script (6-15 seconds, 9:16)',
      papeis,
      texto: `You are a short-form video director specialised in Pinterest video pins.

CONTEXT
${ctxBase(c, 'en')}
Angle: ${c.angulo || '(not set)'}

TASK — DELIVER A SHOT-BY-SHOT SCRIPT THAT I CAN EXECUTE WITH FREE TOOLS ONLY

For a 6-15 second vertical (1080x1920) video pin with NO voiceover (most users watch muted):

SHOT LIST (each shot: second range, what appears, on-screen text, camera movement)
- 0-2s: HOOK — must stop the scroll. Tell me exactly what must be on screen.
- 2-6s: value / process / transformation
- 6-12s: the payoff or the "before/after"
- last 1-2s: CTA card

ALSO DELIVER
1. Text overlays for each shot (max 6 words each, bold, high contrast)
2. A beat-by-beat music/mood suggestion (royalty-free style, not a copyrighted song)
3. How to produce each shot for FREE: which AI tool, which free editor (CapCut desktop), what to do if I only have stock footage
4. The 3 image prompts (English) to generate the key frames with a free image generator, then animate with image-to-video
5. The caption + title + 5 hashtags for this video pin
6. Cover image instruction (the frame that appears in the feed — must contain the text overlay)

RULES
- ${regras('en')}
- No watermarked AI tools in the final output (specify which free tiers are watermark-free).
- Keep the promise identical to the static pins for the same offer.`
    };
    return {
      titulo: 'Prompt 8 — Roteiro de Vídeo Pin (6 a 15 segundos, 9:16)',
      papeis,
      texto: `Você é diretor de vídeos curtos especializado em video pins do Pinterest.

CONTEXTO
${ctxBase(c, 'pt')}
Ângulo: ${c.angulo || '(não definido)'}

TAREFA — ENTREGUE UM ROTEIRO PLANO A PLANO QUE EU CONSIGA EXECUTAR SÓ COM FERRAMENTAS GRÁTIS

Para um vídeo vertical (1080x1920) de 6 a 15 segundos SEM narração (a maioria assiste sem som):

LISTA DE PLANOS (cada plano: intervalo em segundos, o que aparece, texto na tela, movimento de câmera)
- 0 a 2s: GANCHO — precisa parar o scroll. Diga exatamente o que deve estar na tela.
- 2 a 6s: valor / processo / transformação
- 6 a 12s: a recompensa ou o "antes/depois"
- últimos 1 a 2s: cartela de CTA

ENTREGUE TAMBÉM
1. Textos de overlay de cada plano (máx. 6 palavras cada, bold, alto contraste)
2. Sugestão de trilha por clima (estilo royalty-free, não uma música protegida)
3. Como produzir cada plano DE GRAÇA: qual ferramenta de IA, qual editor grátis (CapCut desktop), o que fazer se eu só tiver banco de imagens
4. Os 3 prompts de imagem (em inglês) para gerar os quadros-chave num gerador grátis, e depois animar com image-to-video
5. A legenda + título + 5 hashtags deste video pin
6. Instrução para a imagem de capa (o quadro que aparece no feed — precisa conter o overlay de texto)

REGRAS
- ${regras('pt')}
- Nenhuma ferramenta com marca d'água na saída final (especifique quais planos grátis não deixam marca d'água).
- Mantenha a promessa idêntica à dos pins estáticos da mesma oferta.`
    };
  }

  /* =======================================================================
     09 · CARROSSEL
     ======================================================================= */
  function carrossel(c, lang) {
    const papeis = lang === 'en' ? ['Carousel strategist'] : ['Estrategista de carrossel'];
    if (lang === 'en') return {
      titulo: 'Prompt 9 — Carousel Pin (5 slides, swipe-through)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Design a 5-slide Pinterest carousel pin (swipeable) for this offer. Carousels outperform static pins in saves while keeping near-static outbound clicks.

CONTEXT
${ctxBase(c, 'en')}

FOR EACH SLIDE, OUTPUT:
- Slide number and its job in the story (hook → context → proof → objection → CTA)
- Slide headline (max 6 words)
- Supporting text (max 15 words)
- Visual description + image prompt in English (2:3, 1000x1500)
- Why this slide earns the swipe to the next one

ALSO DELIVER
1. The carousel title (40-60 chars) and description (2-4 lines) for the whole pin
2. A consistency rule so all 5 slides look like the same family (palette, font, layout grid)
3. How to build it in Canva free, step by step (10 steps max)
4. 5 alternative hooks for slide 1 to A/B test

RULES
- ${regras('en')}
- Slide 5 must contain the CTA and the link destination reminder.
- Never put the affiliate link inside the image — the link goes in the pin's destination field.`
    };
    return {
      titulo: 'Prompt 9 — Pin em Carrossel (5 slides para deslizar)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Desenhe um carrossel de Pinterest com 5 slides (deslizáveis) para esta oferta. O carrossel supera o pin estático em saves e mantém quase o mesmo clique de saída.

CONTEXTO
${ctxBase(c, 'pt')}

PARA CADA SLIDE, ENTREGUE:
- Número do slide e a função dele na história (gancho → contexto → prova → objeção → CTA)
- Manchete do slide (máx. 6 palavras)
- Texto de apoio (máx. 15 palavras)
- Descrição visual + prompt de imagem em inglês (2:3, 1000x1500)
- Por que este slide faz a pessoa deslizar para o próximo

ENTREGUE TAMBÉM
1. Título do carrossel (40 a 60 caracteres) e descrição (2 a 4 linhas) do pin inteiro
2. Uma regra de consistência para os 5 slides parecerem da mesma família (paleta, fonte, grid)
3. Como montar isso no Canva grátis, passo a passo (máx. 10 passos)
4. 5 ganchos alternativos para o slide 1, para testar A/B

REGRAS
- ${regras('pt')}
- O slide 5 precisa ter o CTA e o lembrete do destino do link.
- Nunca coloque o link de afiliado dentro da imagem — o link vai no campo de destino do pin.`
    };
  }

  /* =======================================================================
     10 · PRODUTO DIGITAL PRÓPRIO (margem 100%)
     ======================================================================= */
  function produtoProprio(c, lang) {
    const papeis = lang === 'en' ? ['Product strategist', 'Prompt engineer'] : ['Estrategista de produto', 'Engenheiro de prompt'];
    if (lang === 'en') return {
      titulo: 'Prompt 10 — Own Digital Product (build it today, sell forever)',
      papeis,
      texto: `${personaPinterest('en')}

TASK
Design a digital product I can create TODAY with free AI tools and sell through Pinterest with ~100% margin.

CONTEXT
${ctxBase(c, 'en')}

DELIVER
1. Three product ideas for this niche: a printable, a template, and a mini-ebook. For each: exact name, what it solves, price point (US$7-27 range), and its "instant value" promise.
2. Pick the best one and detail it:
   - Complete table of contents / list of pages
   - What I must generate with AI (text) and what I must design (Canva)
   - The exact prompts, in order, to produce each part for free
   - Delivery setup on Gumroad or Payhip free (step by step, 10 steps)
   - The pricing ladder: lead magnet (free) → main product → bundle
3. A 20-pin content plan to sell it (5 angles × 4 designs)
4. The 5 Pinterest descriptions that convert to product sales
5. Legal hygiene: which disclaimers to include, what I cannot claim, and how to write a simple license for the buyer

RULES
- ${regras('en')}
- Everything must be achievable in one day of work.
- No plagiarism: the AI must write from scratch, not copy an existing ebook.`
    };
    return {
      titulo: 'Prompt 10 — Produto Digital Próprio (monte hoje, venda sempre)',
      papeis,
      texto: `${personaPinterest('pt')}

TAREFA
Desenhe um produto digital que eu consiga criar HOJE com ferramentas de IA grátis e vender pelo Pinterest com margem de ~100%.

CONTEXTO
${ctxBase(c, 'pt')}

ENTREGUE
1. Três ideias de produto para este nicho: um printable, um template e um mini-ebook. Para cada: nome exato, o que resolve, faixa de preço (R$ 27 a R$ 97) e a promessa de "valor imediato".
2. Escolha a melhor e detalhe:
   - Sumário completo / lista de páginas
   - O que eu gero com IA (texto) e o que eu desenho (Canva)
   - Os prompts exatos, na ordem, para produzir cada parte de graça
   - Configuração de entrega na Gumroad ou Payhip (passo a passo, máx. 10 passos)
   - A escada de preço: isca grátis → produto principal → combo
3. Um plano de 20 pins para vender esse produto (5 ângulos × 4 designs)
4. As 5 descrições de Pinterest que mais convertem em venda de produto
5. Higiene jurídica: quais avisos incluir, o que eu não posso prometer e como escrever uma licença simples para o comprador

REGRAS
- ${regras('pt')}
- Tudo precisa ser factível em um dia de trabalho.
- Sem plágio: a IA deve escrever do zero, não copiar um ebook existente.`
    };
  }

  /* =======================================================================
     11 · CALENDÁRIO 30 DIAS
     ======================================================================= */
  function calendario(c, lang) {
    const papeis = lang === 'en' ? ['Content planner'] : ['Planejador de conteúdo'];
    if (lang === 'en') return {
      titulo: 'Prompt 11 — 30-Day Calendar (3-5 pins/day, sequenced)',
      papeis,
      texto: `You are a Pinterest content planner. Build a 30-day publishing calendar.

CONTEXT
${ctxBase(c, 'en')}
Offers I will promote: ${c.ofertas || '(one main + two secondary)'}

DELIVER A TABLE
| Day | Pin title | Angle | Format (static/video/carousel) | Board | Destination | Ready? |

RULES
- 3 to 5 pins per day for 90 days is the growth benchmark; start with 3/day on week 1 and scale.
- Never post 2 pins with the same link to the same board on the same day.
- Keep at least 72h between pins pointing to the same URL.
- 70% evergreen content and 30% offers/affiliate.
- Seasonal content must be published 30-60 days before the peak.
- Mix formats: 60-70% static (drives clicks), 20-30% video (drives reach), remainder carousel.
- Each week must include 1 "maintenance day" (writing titles/descriptions in bulk) and 1 review day.

ALSO DELIVER
1. The batch-production workflow in blocks of 1 hour (how many pins I produce per block)
2. A rotation scheme across 5-10 boards so no board looks spammy
3. What to do on a day when I have zero time: the minimum viable action`
    };
    return {
      titulo: 'Prompt 11 — Calendário de 30 Dias (3 a 5 pins/dia, sequenciado)',
      papeis,
      texto: `Você é planejador de conteúdo de Pinterest. Monte um calendário de publicação de 30 dias.

CONTEXTO
${ctxBase(c, 'pt')}
Ofertas que vou divulgar: ${c.ofertas || '(uma principal + duas secundárias)'}

ENTREGUE UMA TABELA
| Dia | Título do pin | Ângulo | Formato (estático/vídeo/carrossel) | Board | Destino | Pronto? |

REGRAS
- 3 a 5 pins por dia durante 90 dias é o benchmark de crescimento; comece com 3/dia na semana 1 e escale.
- Nunca poste 2 pins com o mesmo link no mesmo board no mesmo dia.
- Mantenha pelo menos 72h entre pins que apontam para a mesma URL.
- 70% conteúdo evergreen e 30% ofertas/afiliado.
- Conteúdo sazonal deve ser publicado 30 a 60 dias antes do pico.
- Misture formatos: 60 a 70% estático (traz clique), 20 a 30% vídeo (traz alcance), o resto carrossel.
- Cada semana precisa ter 1 "dia de manutenção" (escrever títulos/descrições em lote) e 1 dia de revisão.

ENTREGUE TAMBÉM
1. O fluxo de produção em blocos de 1 hora (quantos pins eu produzo por bloco)
2. Um esquema de rotação entre 5 a 10 boards para nenhum board parecer spam
3. O que fazer num dia em que eu não tenho tempo nenhum: a ação mínima viável`
    };
  }

  /* =======================================================================
     12 · DIAGNÓSTICO DE MÉTRICAS
     ======================================================================= */
  function diagnostico(c, lang) {
    const papeis = lang === 'en' ? ['Growth analyst'] : ['Analista de crescimento'];
    if (lang === 'en') return {
      titulo: 'Prompt 12 — Funnel Diagnosis (read the numbers, fix the leak)',
      papeis,
      texto: `You are a Pinterest growth analyst. Diagnose my funnel and give me the fix.

MY NUMBERS (last 30 days)
${c.metricas || '[impressions, saves, outbound clicks, sessions, sales, revenue]'}

CONTEXT
${ctxBase(c, 'en')}

TASK
1. Calculate my CTR (clicks/impressions), save rate per 1k, conversion rate (sales/clicks) and revenue per 1,000 impressions.
2. Compare each against these benchmarks: outbound CTR 0.3%-1%; save rate 5+/1k for static; conversion 0.5%-2%; video +185% impressions but 3x fewer clicks than static.
3. Identify the SINGLE biggest leak and rank the other leaks.
4. For each leak, give 3 concrete fixes, in order of impact/effort.
5. Tell me clearly: should I SCALE this, PIVOT the angle, or KILL the offer? Justify.
6. Give me next week's exact plan: what to produce, how many, which format, which destination.
7. Finally, tell me the 3 numbers I must track weekly from now on, and what value would make me celebrate vs panic.`
    };
    return {
      titulo: 'Prompt 12 — Diagnóstico de Funil (ler os números e achar o vazamento)',
      papeis,
      texto: `Você é analista de crescimento de Pinterest. Diagnostique meu funil e me dê a correção.

MEUS NÚMEROS (últimos 30 dias)
${c.metricas || '[impressões, saves, cliques de saída, sessões, vendas, receita]'}

CONTEXTO
${ctxBase(c, 'pt')}

TAREFA
1. Calcule meu CTR (cliques/impressões), taxa de save por 1k, taxa de conversão (vendas/cliques) e receita por 1.000 impressões.
2. Compare cada um com estes benchmarks: CTR de saída 0,3% a 1%; save 5+/1k em estático; conversão 0,5% a 2%; vídeo +185% impressões mas 3x menos cliques que estático.
3. Aponte O MAIOR vazamento (um só) e ranqueie os outros.
4. Para cada vazamento, dê 3 correções concretas, em ordem de impacto versus esforço.
5. Diga claramente: devo ESCALAR isso, PIVOTAR o ângulo ou MATAR a oferta? Justifique.
6. Me dê o plano exato da próxima semana: o que produzir, quantos, qual formato, qual destino.
7. Por fim, os 3 números que eu preciso acompanhar semanalmente e qual valor me faria comemorar versus entrar em pânico.`
    };
  }

  /* =======================================================================
     13 · PERFIL E BOARDS
     ======================================================================= */
  function perfil(c, lang) {
    const papeis = lang === 'en' ? ['Profile optimizer'] : ['Otimizador de perfil'];
    if (lang === 'en') return {
      titulo: 'Prompt 13 — Profile & Boards (set up for search, not for looks)',
      papeis,
      texto: `You are a Pinterest profile optimizer. Build my entire account structure.

CONTEXT
${ctxBase(c, 'en')}

DELIVER
1. Account name (40 chars max) combining brand + primary keyword
2. Bio (160 chars max) with keywords and one clear promise
3. 8 boards: exact title (keyword-first), description (2 lines with keywords) and what content goes in each
4. The board order (most important first) and which one to feature
5. Which 3 boards I should NOT create (trap boards that dilute the account)
6. Website claim instructions + why it matters for distribution and analytics
7. Profile photo / cover rules for a niche account that wants to look trustworthy
8. A 10-item pre-launch checklist before I publish my first pin`
    };
    return {
      titulo: 'Prompt 13 — Perfil e Boards (montar para busca, não para bonito)',
      papeis,
      texto: `Você é otimizador de perfil de Pinterest. Monte a estrutura inteira da minha conta.

CONTEXTO
${ctxBase(c, 'pt')}

ENTREGUE
1. Nome da conta (máx. 40 caracteres) combinando marca + palavra-chave principal
2. Bio (máx. 160 caracteres) com palavras-chave e uma promessa clara
3. 8 boards: título exato (palavra-chave primeiro), descrição (2 linhas com palavras-chave) e o que entra em cada um
4. A ordem dos boards (o mais importante primeiro) e qual destacar
5. Quais 3 boards eu NÃO devo criar (boards-armadilha que diluem a conta)
6. Instruções para reivindicar (claim) o site e por que isso importa para distribuição e analytics
7. Regras de foto de perfil e capa para uma conta de nicho que quer parecer confiável
8. Um checklist de 10 itens antes de publicar o primeiro pin`
    };
  }

  /* =======================================================================
     14 · AUDITORIA DE COMPLIANCE
     ======================================================================= */
  function compliance(c, lang) {
    const papeis = lang === 'en' ? ['Compliance auditor', 'Risk analyst'] : ['Auditor de compliance', 'Analista de risco'];
    if (lang === 'en') return {
      titulo: 'Prompt 14 — Compliance Audit (do not lose the account)',
      papeis,
      texto: `You are a compliance auditor for Pinterest affiliate marketing. Audit my content before I scale.

CONTEXT
${ctxBase(c, 'en')}

MATERIAL TO AUDIT
Title: ${c.tituloAtual || '(paste here)'}
Description: ${c.descricaoAtual || '(paste here)'}
Destination link: ${c.linkAfiliado || '(paste here)'}
Offer category: ${c.tipoOferta || '(paste here)'}

AUDIT AGAINST THESE RULES
- Affiliate links are allowed on Pinterest, BUT they must be disclosed and must add original value.
- Link shorteners (bit.ly, tinyurl) are blocked/flagged — always use the full affiliate URL.
- No spammy repetitive affiliate patterns; volume limits matter.
- Some programs forbid direct linking from social platforms (Etsy is the classic example) — check the specific program's terms.
- Prohibited categories: weapons, tobacco, adult content, gambling, misleading health/financial claims.
- FTC / Brazilian CDC-style rules: disclose the commercial relationship clearly and close to the link.

DELIVER
1. Risk table: | Rule | Status (OK/Risk/Blocker) | Exact fix |
2. A rewritten description that is compliant AND still converts
3. The exact disclosure sentence to use in the pin description and on the landing page
4. A list of everything I should stop doing immediately
5. A 10-question self-audit I can run monthly
6. What to do if the account receives a warning: step-by-step recovery plan`
    };
    return {
      titulo: 'Prompt 14 — Auditoria de Compliance (não perca a conta)',
      papeis,
      texto: `Você é auditor de compliance para marketing de afiliados no Pinterest. Audite meu conteúdo antes de eu escalar.

CONTEXTO
${ctxBase(c, 'pt')}

MATERIAL PARA AUDITAR
Título: ${c.tituloAtual || '(cole aqui)'}
Descrição: ${c.descricaoAtual || '(cole aqui)'}
Link de destino: ${c.linkAfiliado || '(cole aqui)'}
Categoria da oferta: ${c.tipoOferta || '(cole aqui)'}

AUDITE CONTRA ESTAS REGRAS
- Link de afiliado é permitido no Pinterest, MAS precisa estar revelado e agregar valor original.
- Encurtadores (bit.ly, tinyurl) são bloqueados/marcados — use sempre a URL completa de afiliado.
- Sem padrão repetitivo e spam de afiliado; volume diário importa.
- Alguns programas proíbem link direto a partir de redes sociais (Etsy é o exemplo clássico) — confira os termos do programa específico.
- Categorias proibidas: arma, tabaco, conteúdo adulto, aposta, alegação enganosa de saúde ou de finanças.
- Regras de transparência publicitária (FTC / CDC): deixe a relação comercial clara e perto do link.

ENTREGUE
1. Tabela de risco: | Regra | Situação (OK / Risco / Bloqueio) | Correção exata |
2. Uma descrição reescrita que seja compliant E ainda converta
3. A frase exata de aviso para usar na descrição do pin e na página de destino
4. Lista de tudo que eu devo parar de fazer imediatamente
5. Uma autoauditoria de 10 perguntas para rodar todo mês
6. O que fazer se a conta receber um aviso: plano de recuperação passo a passo`
    };
  }

  /* =======================================================================
     EXTRA · 30 PROMPTS DE IMAGEM POR NICHO (gerador rápido)
     ======================================================================= */
  function packImagens(c, lang) {
    const papeis = lang === 'en' ? ['Prompt engineer'] : ['Engenheiro de prompt'];
    const estilo = c.estilo || 'Light & Bright';
    if (lang === 'en') return {
      titulo: 'Prompt 15 — Image Prompt Pack (10 ready-to-use prompts)',
      papeis,
      texto: `You are a prompt engineer specialised in Pinterest images generated by free AI tools.

CONTEXT
${ctxBase(c, 'en')}
Visual style: ${estilo}

TASK
Write 10 image prompts that I can paste, one by one, into a free generator (Bing Image Creator / Microsoft Designer, Ideogram, Leonardo, Adobe Firefly).

FOR EACH PROMPT:
1. The full prompt in ENGLISH, 60-90 words, always ending with: "vertical 2:3 composition, clean top third for text overlay, no text, no watermark, no logos, no distorted hands, high resolution"
2. Why this specific image beats a generic one in this niche
3. Which free tool will handle it best and why

VARIETY MATRIX — the 10 prompts must cover:
- 2 close-up / macro
- 2 wide establishing shot
- 2 with a real person in lifestyle context (no celebrity faces)
- 2 process / step-by-step
- 2 aspirational / "after" results

RULES
- ${regras('en')}
- Never request recognizable brands, real people, or protected characters.
- Adapt lighting and palette to the chosen style so all 10 look like the same account.`
    };
    return {
      titulo: 'Prompt 15 — Pacote de Imagens (10 prompts prontos para colar)',
      papeis,
      texto: `Você é engenheiro de prompt especializado em imagens de Pinterest geradas por ferramentas de IA grátis.

CONTEXTO
${ctxBase(c, 'pt')}
Estilo visual: ${estilo}

TAREFA
Escreva 10 prompts de imagem que eu possa colar, um por um, em um gerador grátis (Bing Image Creator / Microsoft Designer, Ideogram, Leonardo, Adobe Firefly).

PARA CADA PROMPT:
1. O prompt completo em INGLÊS, 60 a 90 palavras, sempre terminando com: "vertical 2:3 composition, clean top third for text overlay, no text, no watermark, no logos, no distorted hands, high resolution"
2. Por que essa imagem específica vence uma imagem genérica neste nicho
3. Qual ferramenta grátis vai lidar melhor com ela e por quê

MATRIZ DE VARIEDADE — os 10 prompts devem cobrir:
- 2 close / macro
- 2 plano aberto de ambientação
- 2 com pessoa real em contexto lifestyle (sem rosto de celebridade)
- 2 de processo / passo a passo
- 2 aspiracionais / resultado "depois"

REGRAS
- ${regras('pt')}
- Nunca peça marca reconhecível, pessoa real ou personagem protegido.
- Ajuste luz e paleta ao estilo escolhido para os 10 parecerem da mesma conta.`
    };
  }

  /* ---------- catálogo ---------- */
  const CATALOGO = [
    { id:'nichos',       n:1,  titulo:'Máquina de Nichos',            quando:'Etapa 1 — antes de escolher o que promover', fn:nichos },
    { id:'ofertas',      n:2,  titulo:'Caçador de Ofertas',           quando:'Etapa 2 — validação de produto', fn:ofertas },
    { id:'angulos',      n:3,  titulo:'Máquina de Ângulos',           quando:'Etapa 3 — 1 keyword vira 10 ângulos', fn:angulos },
    { id:'fichaPin',     n:4,  titulo:'Fábrica de Pins (5 por ângulo)',quando:'Etapa 5 e 9 — produção em lote', fn:fichaPin },
    { id:'visual',       n:5,  titulo:'Validador de Visual',          quando:'Etapa 4 — decidir o visual que vence', fn:visual },
    { id:'packImagens',  n:15, titulo:'Pacote de 10 Prompts de Imagem',quando:'Etapa 4 — gerar as imagens grátis', fn:packImagens },
    { id:'titulo',       n:6,  titulo:'Laboratório de Títulos',       quando:'Etapa 5 — testar headline', fn:titulo },
    { id:'pagina',       n:7,  titulo:'Página de Destino / Artigo',   quando:'Etapa 7 — onde o link será colado', fn:pagina },
    { id:'video',        n:8,  titulo:'Roteiro de Vídeo Pin',         quando:'Etapa 6 — video pin 6-15s', fn:video },
    { id:'carrossel',    n:9,  titulo:'Pin em Carrossel (5 slides)',  quando:'Etapa 6 — formato carrossel', fn:carrossel },
    { id:'produtoProprio',n:10,titulo:'Produto Digital Próprio',      quando:'Etapa 9 — margem de 100%', fn:produtoProprio },
    { id:'calendario',   n:11, titulo:'Calendário de 30 Dias',        quando:'Etapa 10 — publicar com constância', fn:calendario },
    { id:'diagnostico',  n:12, titulo:'Diagnóstico de Funil',         quando:'Etapa 10 — ler métricas', fn:diagnostico },
    { id:'perfil',       n:13, titulo:'Perfil e Boards',              quando:'Etapa 0 — fundação da conta', fn:perfil },
    { id:'compliance',   n:14, titulo:'Auditoria de Compliance',      quando:'Etapa 8 — antes de escalar', fn:compliance }
  ];

  function gerar(id, ctx, lang) {
    const item = CATALOGO.find(x => x.id === id);
    if (!item) return null;
    const r = item.fn(ctx || {}, lang || 'pt');
    return { id: item.id, n: item.n, ...r };
  }

  function gerarTodos(ctx, lang) {
    return CATALOGO.map(item => ({ id:item.id, n:item.n, ...item.fn(ctx || {}, lang || 'pt') }));
  }

  return { CATALOGO, gerar, gerarTodos, personaPinterest, regras, linha };
})();

if (typeof window !== 'undefined') window.PM_PROMPTS = PM_PROMPTS;

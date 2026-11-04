/* Manual prático — conteúdo em HTML por seção */
window.BM_MANUAL = [
  {
    id: "fundamentos", titulo: "1. Como o dinheiro entra (fundamentos que quase ninguém explica)",
    html: `
      <p>Afiliado de produto gringo não é "vender". É <b>comprar clique barato e entregar clique qualificado</b> para uma página que já sabe converter. Seu produto é <i>tráfego</i>. Essa inversão de mentalidade resolve 80% das decisões erradas.</p>
      <h2>A conta que rege tudo</h2>
      <pre>RPC (receita por clique) = (comissão média × taxa de conversão no hop)
Lucro = (RPC − CPC) × cliques
CPC máximo aceitável = RPC × (1 − margem desejada)</pre>
      <p>Se a comissão é US$ 53 e a taxa de conversão do hop é 0,5%, o RPC é US$ 0,265. Isso significa que qualquer CPC acima disso queima dinheiro. É por isso que <b>oferta de ticket alto com CVR alto</b> vence qualquer "produto mais vendido": sobra mais espaço para pagar o clique.</p>
      <h2>Onde a comissão desaparece</h2>
      <ul>
        <li><b>Reembolso/chargeback (refund rate):</b> nutra costuma ficar entre 5% e 15%. Sua comissão de US$ 160 pode virar US$ 136 na média.</li>
        <li><b>Hold de pagamento:</b> ClickBank paga semanalmente com "hold" de dias; redes menores pagam mensal. Planeje caixa para 30–60 dias.</li>
        <li><b>Atribuição:</b> o cookie do vendor é a última palavra. Se você manda tráfego sem sub-id, não consegue otimizar.</li>
        <li><b>Upsell e order bump:</b> o APV (valor médio por venda) inclui upsell. Você recebe % de cada etapa se o vendor configurar. Confirme isso ANTES — muda completamente a viabilidade.</li>
      </ul>
      <div class="callout info">Pergunta que você deve fazer ao vendor no primeiro contato: "qual o EPC médio dos afiliados em Google Display, qual o refund rate dos últimos 90 dias e vocês aceitam tráfego pago com presell própria?" Quem responde com número é parceiro. Quem responde com "vai fundo" é armadilha.</div>
    `
  },
  {
    id: "produto", titulo: "2. Como escolher o produto (o 'melhor produto' não existe — existe o melhor para o seu canal)",
    html: `
      <p>Todo afiliado iniciante procura "o melhor produto". A pergunta certa é: <b>qual oferta tem espaço econômico para pagar o CPC do meu canal, com o meu nível de compliance?</b></p>
      <h2>As 6 métricas e o que elas realmente dizem</h2>
      <table>
        <tr><th>Métrica</th><th>O que mostra</th><th>Como usar</th></tr>
        <tr><td><b>Gravity</b> (ClickBank)</td><td>Nº de afiliados com pelo menos 1 venda em 12 semanas, ponderado.</td><td>É prova de <i>mercado</i>, não de lucro. Gravity 100+ = funil validado por muita gente. Acima de 300 = você entra numa guerra de lance.</td></tr>
        <tr><td><b>EPC</b> (earnings per click)</td><td>Ganho médio por clique enviado (hop).</td><td>A métrica mais importante. Filtrar EPC ≥ US$ 0,50 para tráfego pago. Abaixo disso, o CPC do Google come a margem.</td></tr>
        <tr><td><b>APV</b></td><td>Ticket médio por venda (inclui upsell).</td><td>Define sua capacidade de pagar clique. APV &lt; US$ 40 exige CVR muito alta ou CPC muito baixo (native/TikTok).</td></tr>
        <tr><td><b>CVR do hop</b></td><td>% de quem clica que compra.</td><td>Comparar com a média do nicho: nutra 0,4–1,8%, espiritual 0,3–1,2%, software 0,8–3%.</td></tr>
        <tr><td><b>Refund rate</b></td><td>% devolvido.</td><td>Acima de 15% destrói a conta. Peça ao vendor.</td></tr>
        <tr><td><b>Aprovação</b></td><td>Precisa liberação manual?</td><td>Ofertas "approval required" têm menos concorrência, mas você depende do gerente.</td></tr>
      </table>
      <h2>Filtro de 5 passos (use o Radar deste app)</h2>
      <ol>
        <li>Escolha <b>1 nicho</b> e fique nele por 90 dias. Trocar de nicho toda semana é o motivo nº 1 de fracasso.</li>
        <li>Filtre EPC ≥ 0,50, APV ≥ 45, CVR ≥ 0,4%, gravity ≥ 50.</li>
        <li>Elimine risco de compliance ≥ 9 se você está começando (nutra com claim agressivo, finanças com promessa de retorno).</li>
        <li>Confirme se aceita tráfego pago e se permite presell própria com sua marca.</li>
        <li>Só então olhe a página de vendas: ela converte no celular? carrega em menos de 3s? tem upsell configurado?</li>
      </ol>
      <h2>Nicho vs. canal (matriz de encaixe)</h2>
      <table>
        <tr><th>Oferta</th><th>Canal que naturalmente performa</th><th>Por quê</th></tr>
        <tr><td>Nutra / suplemento</td><td>Native, Facebook, e-mail, YouTube</td><td>Público 45+, responde a história e VSL longa.</td></tr>
        <tr><td>Espiritual / manifestação</td><td>Native, YouTube, e-mail</td><td>Baixa busca no Google, alto CTR em curiosidade.</td></tr>
        <tr><td>Sobrevivência / DIY</td><td>Native, YouTube</td><td>Ticket baixo, CVR altíssima, público masculino 40+.</td></tr>
        <tr><td>Software / SaaS</td><td>Search, Microsoft Ads, LinkedIn</td><td>Intenção declarada e comissão recorrente.</td></tr>
        <tr><td>Pets</td><td>Facebook, Native, e-mail</td><td>Nicho mais seguro em política de anúncio, storytelling forte.</td></tr>
        <tr><td>Educação / idiomas</td><td>Search, Meta, YouTube</td><td>Demanda de busca e remarketing longa.</td></tr>
      </table>
      <div class="callout">Regra prática: se o APV for menor que US$ 50 e o canal for Google, você precisa de CVR acima de 1,5% e CPC abaixo de US$ 0,35. Se não fechar essa conta, mude de oferta ou de canal — não "otimize" o que é estruturalmente inviável.</div>
    `
  },
  {
    id: "estrutura", titulo: "3. A estrutura mínima (o que comprar e montar)",
    html: `
      <h2>Checklist de ativos</h2>
      <ul>
        <li><b>Domínio próprio</b> (~US$ 10/ano). Nome neutro, editorial, sem marca do produtor.</li>
        <li><b>Hospedagem ou Pages</b>: Cloudflare Pages/Netlify (grátis, rápido) ou hospedagem compartilhada se quiser WordPress.</li>
        <li><b>Presell</b> (uma página por ângulo). Não precisa de site, blog, menu ou logo elaborado.</li>
        <li><b>Páginas legais</b>: Privacidade, Termos, Contato, Disclosure de afiliado.</li>
        <li><b>Analytics</b>: GA4 + tag de conversão do Google Ads + Meta Pixel (se for usar Meta).</li>
        <li><b>Rastreio de sub-id</b>: parâmetro no link de afiliado (tid/subid) por campanha e ângulo.</li>
        <li><b>Planilha de controle</b>: data, oferta, ângulo, gasto, cliques, vendas, RPC, decisão. (Ou o Caderno deste app.)</li>
      </ul>
      <h2>Por que presell e não link direto</h2>
      <p>Quando você anuncia um link de afiliado, o usuário clica no anúncio e cai num domínio diferente do anunciado, depois em outro (o redirect do vendor) e só então na página do produtor. Para o Google isso é "destino que não corresponde ao anúncio" — o caminho mais curto para reprovação por <i>destination mismatch</i> e, no acúmulo, para suspeita de <i>circumventing systems</i>.</p>
      <p>Além do risco, você perde quatro coisas que só a página própria te dá:</p>
      <ul>
        <li><b>Remarketing</b> de quem visitou e não clicou.</li>
        <li><b>Dados</b> de CVR intermediária (quantos saíram para a oferta).</li>
        <li><b>Controle de promessa</b> — o produtor pode trocar preço, página ou oferta sem avisar.</li>
        <li><b>Ativo</b> — a lista de e-mail, o pixel, o histórico. Isso é o que sobrevive quando a oferta morre.</li>
      </ul>
      <h2>Anatomia de uma presell que converte</h2>
      <ol>
        <li><b>Identificação</b> (0–3s): o visitante reconhece o problema e o público.</li>
        <li><b>Mecanismo único</b>: por que essa solução funciona de um jeito diferente.</li>
        <li><b>Prova</b>: depoimentos reais, prints, dados públicos, estudo — nunca inventados.</li>
        <li><b>Prós e contras</b>: o bloco que mais aumenta conversão e reduz risco de <i>misrepresentation</i>.</li>
        <li><b>Para quem não é</b>: filtra clique ruim e melhora a qualidade.</li>
        <li><b>CTA único</b>: um botão, repetido 2–3 vezes, com texto honesto ("ver preço no site oficial").</li>
        <li><b>Disclosure</b>: aviso de afiliado visível, política de privacidade, aviso de resultados.</li>
      </ol>
      <div class="callout good">Benchmark: presell bem feita converte 15%–35% dos cliques no botão de saída para o produtor. Se está em 5%, o problema é a página, não a oferta.</div>
    `
  },
  {
    id: "tipos", titulo: "4. Todos os tipos de campanha (além do display)",
    html: `
      <h2>Google</h2>
      <table>
        <tr><th>Tipo</th><th>Para quê</th><th>Como um afiliado usa</th><th>Cuidado</th></tr>
        <tr><td><b>Display (GDN)</b></td><td>Volume e reconhecimento com CPC baixo</td><td>Custom Intent + presell, 1 grupo por ângulo</td><td>Excluir apps e canais infantis; nunca link direto</td></tr>
        <tr><td><b>Search</b></td><td>Intenção máxima</td><td>Marca do produto + review + problema</td><td>Não se passar pelo produtor; política de marca</td></tr>
        <tr><td><b>Performance Max</b></td><td>Escala com feed</td><td>Só faz sentido com catálogo próprio; para afiliado puro é caixa-preta</td><td>Você perde controle de placement e termo</td></tr>
        <tr><td><b>Demand Gen</b></td><td>Descoberta em YouTube/Discover/Gmail</td><td>Vídeo próprio de 30–60s com 5 hooks</td><td>Não use VSL do produtor</td></tr>
        <tr><td><b>YouTube in-stream</b></td><td>Escala de vídeo</td><td>Presell em vídeo → sua página</td><td>Claims no vídeo também são auditados</td></tr>
        <tr><td><b>Shopping</b></td><td>Produto físico</td><td>Só com feed de loja própria</td><td>Não serve para infoproduto de terceiro</td></tr>
        <tr><td><b>Discovery/Demand Gen</b></td><td>Feed visual</td><td>Criativo de catálogo para gadgets</td><td>Exige criativo muito bom</td></tr>
      </table>
      <h2>Meta (Facebook/Instagram)</h2>
      <p>Campanha CBO com público amplo, 4–8 criativos, evento de conversão próprio na presell. O motor é <b>volume de criativo</b>, não microssegmentação. Para afiliado, o ativo é o UGC (pessoa real falando) e o formato "print de comentário". Risco alto em saúde/peso/finanças: proibido atributo pessoal ("você está acima do peso?") e before/after corporal.</p>
      <h2>Native (Taboola, Outbrain, MGID, Revcontent)</h2>
      <p>É o canal onde VSL longa e público 45+ vivem. O criativo é o thumbnail; a página é o advertorial (parece artigo, identificado como patrocinado). Semana 2 obrigatória: whitelist dos melhores sites, senão o volume vem de placement ruim.</p>
      <h2>TikTok / Reels</h2>
      <p>Público mais jovem, ticket menor, mas CPC baixíssimo. Vence o criativo "nativo de TikTok" (parece orgânico). Bom para gadgets, beleza, educação. Ruim para nutra de claim agressivo.</p>
      <h2>Microsoft Ads (Bing)</h2>
      <p>O canal mais subestimado: importa a campanha do Google em 2 cliques, CPC 30–60% menor, aprovação fácil, público 45+ (exatamente o público de nutra e finanças). Use para <b>validar</b> a oferta com risco baixo antes de escalar no Google.</p>
      <h2>Pinterest, Reddit, LinkedIn, Snap</h2>
      <ul>
        <li><b>Pinterest:</b> nicho feminino, DIY, receitas, decoração. CPC baixo, CVR baixa.</li>
        <li><b>Reddit:</b> software, finanças, hobby. Comunidade hostil a anúncio; funciona com tom de thread.</li>
        <li><b>LinkedIn:</b> B2B e SaaS. CPC caro, mas comissão recorrente compensa.</li>
        <li><b>Snap:</b> nicho jovem, baixo ticket. Pouco usado por afiliado sério.</li>
      </ul>
      <h2>Canais sem mídia paga (o seguro da operação)</h2>
      <ul>
        <li><b>SEO + conteúdo parasita:</b> reviews em Medium, Quora, Reddit, blogs convidados e no seu domínio. Composto: cada review indexado vira tráfego grátis.</li>
        <li><b>E-mail:</b> isca digital → sequência de 5 e-mails → oferta. É o único ativo que ninguém pode pausar.</li>
        <li><b>Comunidade:</b> grupos, Discord, newsletters de nicho com oferta relevante.</li>
      </ul>
      <div class="callout">Estratégia de portfólio: 70% do orçamento no canal que já provou ROI, 20% em um canal novo por mês, 10% em conteúdo/SEO/e-mail. Nunca 100% em uma conta de anúncio.</div>
    `
  },
  {
    id: "display", titulo: "5. Display de verdade: Custom Intent, placements e o que excluir",
    html: `
      <h2>Por que "display de interesse" não funciona e Custom Intent funciona</h2>
      <p>Segmentação por interesse mostra seu anúncio para quem <i>gosta</i> do tema. Segmentação por intenção mostra para quem <i>digitou</i> a solução. A diferença de CVR é de 3 a 10 vezes.</p>
      <h2>Montagem passo a passo</h2>
      <ol>
        <li><b>Custom Segment (intenção):</b> Google Ads → Públicos → Segmentos personalizados → "Pessoas com qualquer um destes interesses" → cole 15–30 termos: <span class="mono">"brain song", "brain song review", "brainwave audio program", "genius wave vs brain song", "memory frequency audio"</span>.</li>
        <li><b>Segmentação combinada:</b> no grupo de anúncios, use <b>Segmentação personalizada + remarketing (OU)</b>. Nunca "in-market genérico" puro.</li>
        <li><b>Exclusões obrigatórias:</b> tipo de app (Android/iOS apps), canais infantis, "conteúdo para famílias", placements de jogos, sites de download. Sem isso, 40% do gasto vai para app e vídeo viral.</li>
        <li><b>Lances:</b> fase 1 "Maximizar cliques" com limite de CPC = CPC máximo calculado. Fase 2 "Maximizar conversões", tCPA só depois de 30 conversões.</li>
        <li><b>Criativo responsivo:</b> 5 headlines curtas (≤30 chars) + 5 descrições + 3 imagens quadradas e 3 horizontais. Uma headline deve ser a promessa, outra o mecanismo, outra a objeção.</li>
        <li><b>Leitura:</b> 150–300 cliques para a primeira decisão. Antes disso, qualquer conclusão é ruído.</li>
      </ol>
      <h2>O que cortar na semana 2</h2>
      <ul>
        <li>Placement com &gt; 2.000 impressões e 0 clique.</li>
        <li>App com qualquer volume (mesmo clicando, não converte).</li>
        <li>Dispositivo desktop se 90% da conversão é mobile (ou ajuste o bid, não pause).</li>
        <li>Faixa etária 18–24 em nutra 45+.</li>
      </ul>
      <h2>O que escalar</h2>
      <p>Top 20 placements por RPC → campanha separada "whitelist" com lance 20–30% maior e criativo exclusivo. É assim que display vira máquina: primeiro você paga para descobrir os sites bons, depois compra só eles.</p>
      <div class="callout bad">Se o painel mostrar reprovação por "Destino: não correspondeu ao anúncio" ou "Site comprometido", não crie conta nova. Isso é <i>circumventing systems</i> e a suspensão vem sem aviso. Corrija o destino, o redirect e o domínio, e só então apele.</div>
    `
  },
  {
    id: "numeros", titulo: "6. Os números: quando escalar, quando ajustar, quando cortar",
    html: `
      <h2>Semáforo de decisão (com 300+ cliques)</h2>
      <table>
        <tr><th>Sinal</th><th>Leitura</th><th>Decisão</th></tr>
        <tr><td>RPC ≥ 1,3 × CPC</td><td>Campanha rentável</td><td>Escalar +20–30% a cada 2–3 dias</td></tr>
        <tr><td>RPC entre 0,8 e 1,3 × CPC</td><td>Empatada, com espaço</td><td>Ajustar criativo e presell; não mexer no orçamento</td></tr>
        <tr><td>RPC entre 0,5 e 0,8 × CPC</td><td>Estrutura ruim</td><td>Trocar ângulo e refazer a presell</td></tr>
        <tr><td>RPC &lt; 0,5 × CPC</td><td>Oferta ou canal incompatível</td><td>Cortar (e guardar a oferta para outro canal)</td></tr>
        <tr><td>CVR da presell &lt; 10%</td><td>Problema na página</td><td>Reescrever headline, CTA e prova</td></tr>
        <tr><td>CTR &lt; 0,3% (display)</td><td>Criativo ruim</td><td>Novo hook/thumbnail, não novo público</td></tr>
        <tr><td>CPC acima do máximo calculado</td><td>Custo estrutural</td><td>Restringir placement, mudar canal ou oferta</td></tr>
      </table>
      <h2>Regras de escala que evitam quebrar a conta</h2>
      <ul>
        <li>Suba 20–30% por vez, a cada 2–3 dias. Dobrar reinicia o aprendizado e derruba o ROI.</li>
        <li>Escale o <b>criativo vencedor</b>, não o conjunto inteiro.</li>
        <li>Duplique para um público semelhante (lookalike) em vez de aumentar o lance do público atual.</li>
        <li>Mantenha 20% do orçamento testando coisa nova. Sem teste, a campanha morre em 30 dias por fadiga.</li>
        <li>Nunca escale no dia em que o produtor mexeu na página de vendas.</li>
      </ul>
      <h2>Significância estatística sem drama</h2>
      <p>Com CVR de 1%, você precisa de ~300 cliques para ter uma noção e ~1.000 para confiança. Com CVR de 3%, 100 cliques já dão sinal. Orçamento de teste realista: <span class="mono">CPC × 300</span>. Se isso for mais do que você pode perder, o produto é grande demais para o seu caixa — comece por um de ticket menor.</p>
      <div class="callout info">Use a aba <b>Viabilidade</b> deste app: ela calcula CPC máximo, orçamento de teste e dias até a significância com os seus números.</div>
    `
  },
  {
    id: "compliance", titulo: "7. Compliance: como não perder a conta (e o que fazer se reprovar)",
    html: `
      <h2>Os 5 motivos reais de reprovação em campanha de afiliado</h2>
      <ol>
        <li><b>Destination mismatch:</b> o anúncio promete uma coisa e a página entrega outra (ou muda de domínio no meio).</li>
        <li><b>Compromised site / malware:</b> scripts injetados, redirect suspeito, plugin desatualizado.</li>
        <li><b>Unreliable claims:</b> "garante", "cura", "resultado em 7 dias", "renda garantida".</li>
        <li><b>Misrepresentation:</b> página sem contato, sem política, com depoimento inventado, com contador falso.</li>
        <li><b>Circumventing systems:</b> várias contas, vários domínios iguais, cloaking. Suspensão sem aviso.</li>
      </ol>
      <h2>Como blindar</h2>
      <ul>
        <li>Presell no seu domínio, mesma promessa do anúncio, preço sempre como "verifique no site oficial".</li>
        <li>Disclosure de afiliado acima da dobra (FTC exige clareza e proximidade do link).</li>
        <li>Sem promessa de cura, sem diagnóstico, sem "médicos recomendam" sem fonte.</li>
        <li>Depoimentos reais, com aviso "resultados variam".</li>
        <li>HTTPS, página rápida, sem pop-up intrusivo, sem auto-redirect.</li>
        <li>Uma oferta por conta/domínio. Não misture 5 nichos no mesmo site.</li>
        <li>Verificação de anunciante completa (Google e Microsoft exigem).</li>
      </ul>
      <h2>Fluxo de apelação (quando reprovar)</h2>
      <ol>
        <li>Leia a política exata no Policy Manager, não o e-mail genérico.</li>
        <li>Corrija o destino de verdade (remova claim, ajuste redirect, limpe scripts).</li>
        <li>Teste o caminho completo do clique em janela anônima e celular.</li>
        <li>Apele com "fiz alterações para cumprir a política" e descreva o que mudou.</li>
        <li>Espere 72h pela recrawl. Não fique reenviando — reenvio em série piora o caso.</li>
      </ol>
      <div class="callout bad">Nunca abra conta nova para "testar" um site reprovado. O Google trata isso como circumventing systems e a punição é a suspensão definitiva de todas as contas ligadas ao mesmo pagamento, IP e domínio.</div>
    `
  },
  {
    id: "ia", titulo: "8. Como usar IA, Hugging Face e GitHub no fluxo (sem virar refém de ferramenta)",
    html: `
      <p>IA não escolhe produto nem substitui teste. Ela resolve 4 gargalos concretos: <b>volume de criativo</b>, <b>agrupamento de termos</b>, <b>reescrita de copy</b> e <b>leitura de dados</b>.</p>
      <h2>Onde cada ferramenta entra</h2>
      <table>
        <tr><th>Etapa</th><th>Ferramenta</th><th>Saída</th></tr>
        <tr><td>Pesquisa de oferta</td><td>Radar deste app + painel da rede</td><td>1 oferta com EPC e risco conhecidos</td></tr>
        <tr><td>Termos de intenção</td><td>Keywords do app + <span class="mono">tools/keyword_harvest.py</span> + embeddings (all-MiniLM)</td><td>Custom Segment com 20–30 termos</td></tr>
        <tr><td>Classificar intenção</td><td>zero-shot (bart-large-mnli)</td><td>Só termos transacionais/comparativos no anúncio</td></tr>
        <tr><td>Copy da presell</td><td>Skills de copywriting (GitHub) + LLM local (Llama 3.1 8B / Qwen 2.5)</td><td>Presell em 4 ângulos</td></tr>
        <tr><td>Criativo</td><td>FLUX para thumbnail + skill de vídeo</td><td>5 hooks + 3 imagens</td></tr>
        <tr><td>Leitura de concorrente</td><td>Whisper para transcrever VSL + Ad Library</td><td>Claims, mecanismo e oferta mapeados</td></tr>
        <tr><td>Operação</td><td>MCP de ads (Google/Meta)</td><td>Auditoria e ajustes por linguagem natural</td></tr>
        <tr><td>Decisão</td><td>Copiloto deste app</td><td>Escalar / ajustar / cortar</td></tr>
      </table>
      <h2>Stack local de custo quase zero</h2>
      <pre># 1. Modelo local (roda em 16 GB de RAM)
ollama pull llama3.1:8b-instruct-q4_K_M
# ou, para português melhor:
ollama pull qwen2.5:7b-instruct

# 2. Embeddings para agrupar search terms (Python)
pip install sentence-transformers scikit-learn
python -c "from sentence_transformers import SentenceTransformer; \
m=SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); print('ok')"

# 3. Transcrição de VSL do concorrente
pip install faster-whisper
python -m faster_whisper arquivo.mp4 --model small</pre>
      <h2>Prompts que funcionam (copie)</h2>
      <pre>Você é redator de resposta direta. Escreva uma presell em inglês (US) para o produto {{produto}},
nicho {{nicho}}, público {{público}}, mecanismo {{mecanismo}}.

Regras rígidas:
- 700-900 palavras, tom de artigo de revista, não de anúncio.
- Sem promessa de cura, sem "garantido", sem números de resultado inventados.
- Inclua: bloco de prós e contras, "para quem não é", e 3 depoimentos marcados como [SUBSTITUIR POR DEPOIMENTO REAL].
- Termine com CTA único: "Check availability and current price on the official website".
- Inclua aviso de afiliado nas duas primeiras linhas.

Entregue em HTML semântico (h1, h2, p, ul), sem CSS.</pre>
      <pre>Receba uma lista de search terms em CSV. Classifique cada um como
[transacional | comparativo | informacional | irrelevante] e atribua 0-100 de intenção de compra.
Agrupe em no máximo 8 clusters por tema e devolva uma tabela com: termo, classe, score, cluster.
Descarte termos com marca de concorrente que você não afilia.</pre>
      <div class="callout">Regra de ouro: IA gera <b>variação</b>, o mercado escolhe <b>vencedor</b>. Nenhum modelo sabe se o seu público clica — só o teste sabe.</div>
    `
  },
  {
    id: "erros", titulo: "9. Os 12 erros que mais custam dinheiro",
    html: `
      <ol>
        <li><b>Anunciar link de afiliado direto.</b> Reprovação, zero remarketing, zero dado.</li>
        <li><b>Trocar de produto antes de 300 cliques.</b> Você nunca deu chance estatística ao teste.</li>
        <li><b>Mudar criativo, público e página ao mesmo tempo.</b> Aprende nada e gasta três vezes.</li>
        <li><b>Escalar dobrando orçamento.</b> Reinicia aprendizado e o CPA explode.</li>
        <li><b>Não excluir apps no display.</b> Metade do gasto em clique acidental.</li>
        <li><b>Misturar ofertas na mesma campanha.</b> O algoritmo otimiza a média, não o lucro.</li>
        <li><b>Usar claim do produtor sem revisar.</b> O claim não aprovado derruba a sua conta, não a dele.</li>
        <li><b>Não pedir aprovação nem materiais ao vendor.</b> Fica sem CPA bump, sem whitelist, sem suporte.</li>
        <li><b>Depender de uma única conta/conta de anúncio.</b> Um bloqueio zera a receita.</li>
        <li><b>Não rastrear sub-id.</b> Você não sabe qual ângulo vendeu — então escala o errado.</li>
        <li><b>Presell copiada do concorrente.</b> Conteúdo duplicado + risco de direito autoral.</li>
        <li><b>Ignorar reembolso e hold.</b> Você acha que faturou e o caixa não fecha.</li>
      </ol>
      <div class="callout good">Se você fizer só três coisas: presell própria, um teste por vez e decisão com 300 cliques. Isso te coloca à frente de 90% dos afiliados iniciantes.</div>
    `
  },
  {
    id: "glossario", titulo: "10. Glossário rápido",
    html: `
      <table>
        <tr><th>Termo</th><th>O que é</th></tr>
        <tr><td>Gravity</td><td>Score do ClickBank: afiliados com venda recente. Mede concorrência/prova, não lucro.</td></tr>
        <tr><td>EPC</td><td>Earnings per click: quanto se ganha por clique enviado ao vendor.</td></tr>
        <tr><td>APV</td><td>Average payout value: ticket médio de comissão (inclui upsell).</td></tr>
        <tr><td>Hop</td><td>O clique que sai da sua página para o produtor.</td></tr>
        <tr><td>Hop CVR</td><td>% de hops que viram venda.</td></tr>
        <tr><td>RPC</td><td>Receita por clique que entra na SUA página.</td></tr>
        <tr><td>Presell</td><td>Página própria entre o anúncio e a oferta.</td></tr>
        <tr><td>Advertorial</td><td>Presell em formato de artigo, identificada como patrocinada.</td></tr>
        <tr><td>Custom Intent</td><td>Público do Google baseado em termos digitados.</td></tr>
        <tr><td>tCPA</td><td>Custo por aquisição desejado.</td></tr>
        <tr><td>Placement</td><td>Site/app onde o anúncio de display aparece.</td></tr>
        <tr><td>Whitelist</td><td>Lista fechada de placements que performam.</td></tr>
        <tr><td>Sub-id / tid</td><td>Parâmetro para o vendor devolver qual campanha gerou a venda.</td></tr>
        <tr><td>Refund rate</td><td>% de reembolso — come parte da comissão.</td></tr>
        <tr><td>Hold</td><td>Período em que o vendor segura o pagamento.</td></tr>
        <tr><td>Disclosure</td><td>Aviso de que você recebe comissão (exigido pela FTC nos EUA).</td></tr>
      </table>
    `
  }
];

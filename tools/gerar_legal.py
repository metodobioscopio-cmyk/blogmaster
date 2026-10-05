#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera as páginas legais do Growth Design Pro a partir de um único template.

Por que um gerador: os cinco documentos (termos, privacidade e licença em PT-BR;
terms e privacy em EN) compartilham cabeçalho, rodapé, avisos obrigatórios e
identidade visual. Editar em um lugar só evita a clássica divergência entre a
versão em português e a em inglês.

Uso:  python3 tools/gerar_legal.py
Saída: site/legal/*.html
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "legal"

NAV_AVISO = """
<div class="gdp-topbar">
  <a href="../" style="color:inherit;text-decoration:none">← Growth Design Pro</a>
  &nbsp;·&nbsp; documento legal
</div>
"""

RODAPE_PT = """
<footer class="gdp-footer">
  <div class="shell">
    <div class="gdp-footer__bottom" style="margin-top:0;border-top:0;padding-top:0">
      <span>© <span data-year>2026</span> Growth Design Pro. Todos os direitos reservados.</span>
      <span><a href="termos.html" style="color:inherit">Termos</a> ·
            <a href="privacidade.html" style="color:inherit">Privacidade</a> ·
            <a href="licenca.html" style="color:inherit">Licença do kit</a> ·
            <a href="../" style="color:inherit">Site</a></span>
    </div>
    <div class="gdp-footer__legal">
      <p><strong style="color:var(--on-night-3)">Aviso de resultados.</strong> Este produto é educacional. Não
      garantimos tráfego, posicionamento em buscadores, vendas ou renda: resultados dependem da sua execução,
      do seu mercado e do comportamento de plataformas de terceiros.</p>
      <p style="margin-top:var(--s-3)"><strong style="color:var(--on-night-3)">Independência.</strong> O Growth Design
      Pro não é afiliado, patrocinado nem endossado pelo RapidAPI, pelos fornecedores das APIs apresentadas
      ou pelas plataformas de pagamento citadas. Todas as marcas pertencem aos seus respectivos titulares.</p>
    </div>
  </div>
</footer>
"""

RODAPE_EN = """
<footer class="gdp-footer">
  <div class="shell">
    <div class="gdp-footer__bottom" style="margin-top:0;border-top:0;padding-top:0">
      <span>© <span data-year>2026</span> Growth Design Pro. All rights reserved.</span>
      <span><a href="terms.html" style="color:inherit">Terms</a> ·
            <a href="privacy.html" style="color:inherit">Privacy</a> ·
            <a href="licenca.html" style="color:inherit">Toolkit licence</a> ·
            <a href="../en/" style="color:inherit">Site</a></span>
    </div>
    <div class="gdp-footer__legal">
      <p><strong style="color:var(--on-night-3)">Results disclaimer.</strong> This is an educational product. We do not
      guarantee traffic, search rankings, sales or income: results depend on your execution, your market and
      the behaviour of third-party platforms.</p>
      <p style="margin-top:var(--s-3)"><strong style="color:var(--on-night-3)">Independence.</strong> Growth Design Pro
      is not affiliated with, sponsored by or endorsed by RapidAPI, the providers of the APIs presented, or
      the payment platforms mentioned. All trademarks belong to their respective owners.</p>
    </div>
  </div>
</footer>
"""

TEMPLATE = """<!DOCTYPE html>
<html lang="{lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo} — Growth Design Pro</title>
<meta name="description" content="{resumo}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0F0F0D">
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/components.css">
</head>
<body>
{nav}
<main class="section">
  <div class="shell">
    <div class="grid grid--split">
      <div>
        <span class="eyebrow">{rotulo}</span>
        <h1 class="h1 mt-5">{titulo}</h1>
        <p class="prose mt-6" style="font-size:var(--fs-caption);color:var(--ink-3)">
          Versão 1.0 · última atualização: {data}<br>
          {vigencia}
        </p>
        <nav class="mt-8" aria-label="Índice do documento">
          <div class="gdp-footer__title" style="color:var(--ink-3)">{indice_titulo}</div>
          <ol class="gdp-footer__list" style="font-family:var(--font-mono);font-size:var(--fs-caption)">
            {indice}
          </ol>
        </nav>
      </div>

      <article class="prose" style="max-width:none">
        {corpo}
      </article>
    </div>
  </div>
</main>
{rodape}
<script src="../assets/js/main.js" defer></script>
</body>
</html>
"""


def toc(secoes):
    return "\n            ".join(
        f'<li><a href="#s{i+1}" style="color:var(--ink-2);text-decoration:none">{i+1:02d}. {titulo}</a></li>'
        for i, (titulo, _) in enumerate(secoes)
    )


def body(secoes):
    out = []
    for i, (titulo, html) in enumerate(secoes):
        out.append(f'<h2 id="s{i+1}">{titulo}</h2>\n{html.strip()}')
    return "\n\n".join(out)


def render(destino, lang, titulo, resumo, rotulo, vigencia, secoes, nav, rodape, indice_titulo):
    html = TEMPLATE.format(
        lang=lang, titulo=titulo, resumo=resumo, rotulo=rotulo, data="5 de outubro de 2026",
        vigencia=vigencia, corpo=body(secoes), indice=toc(secoes), nav=nav, rodape=rodape,
        indice_titulo=indice_titulo,
    )
    destino.write_text(html, encoding="utf-8")
    print(f"  ✓ {destino.relative_to(ROOT)}")


# ---------------------------------------------------------------------------
# TERMOS DE USO (PT-BR)
# ---------------------------------------------------------------------------
TERMOS = [
    ("Quem somos e o que este documento rege", """
<p>Este documento é um contrato entre você ("aluno" ou "usuário") e o Growth Design Pro
("nós", "produtor"), e rege o acesso ao curso online <strong>Growth Design Pro</strong> e ao
kit de ferramentas que o acompanha. Ao concluir a compra, você declara ter lido e aceito estes termos.</p>
<p>Os dados de identificação da empresa produtora (razão social e CNPJ) constam na nota fiscal
emitida pela plataforma de pagamento no momento da compra.</p>
"""),
    ("O que o produto é — e o que ele não é", """
<p>O Growth Design Pro é um produto <strong>educacional</strong>. Ele ensina um método de design e de
otimização de páginas e demonstra o uso de seis serviços de inteligência artificial de terceiros.</p>
<p>O produto <strong>não inclui</strong>: assinaturas das APIs apresentadas; hospedagem, domínio ou
ferramentas de terceiros; consultoria individual; garantia de tráfego, posicionamento em buscadores,
conversão, vendas ou renda.</p>
<p>As assinaturas dos serviços de IA são contratadas por você, diretamente no RapidAPI, em seu próprio
nome, com o seu meio de pagamento, e estão sujeitas aos termos e preços definidos por aqueles
fornecedores, que podem mudar sem aviso e sem qualquer participação nossa.</p>
"""),
    ("Acesso, prazo e atualizações", """
<p>O acesso é pessoal, individual e intransferível, concedido por prazo indeterminado ("vitalício"),
contado a partir da liberação, e inclui as atualizações de conteúdo que publicarmos para a mesma turma
ou versão do produto.</p>
<p>O acesso não inclui turmas, produtos ou lançamentos futuros distintos, que podem ser comercializados
separadamente.</p>
"""),
    ("Pagamento, preço e reajuste", """
<p>O preço vigente é o exibido na página de vendas no momento da compra, em reais ou em dólar conforme a
plataforma utilizada. Promoções de lançamento têm prazo declarado e, encerrado o prazo, o preço retorna
ao valor cheio.</p>
<p>O processamento do pagamento é feito por plataformas de terceiros (Hotmart, Kiwify, Eduzz ou Gumroad),
que podem cobrar tarifas próprias e aplicar suas políticas de parcelamento e de conversão de moeda.</p>
"""),
    ("Garantia e direito de arrependimento", """
<p>Você tem <strong>7 (sete) dias corridos</strong>, contados da confirmação do pagamento, para desistir
da compra sem justificativa, com devolução integral do valor pago — direito previsto no art. 49 do Código
de Defesa do Consumidor.</p>
<p>Para exercer, basta escrever para <a href="mailto:contato@growthdesignpro.com.br">contato@growthdesignpro.com.br</a>
dentro do prazo. O reembolso é processado pela mesma plataforma e pelo mesmo meio de pagamento, nos prazos
operacionais dela. Revogamos o acesso ao término do processo de reembolso.</p>
"""),
    ("Propriedade intelectual", """
<p>Todo o conteúdo do curso — vídeos, textos, apostilas, planilhas, arquivos de código, prompts, templates
e identidade visual — é protegido por direitos autorais e pertence ao produtor ou é usado com licença.</p>
<p>Você recebe uma licença de uso pessoal e profissional, nos termos detalhados na
<a href="licenca.html">Licença de uso do kit de ferramentas</a>. Em resumo: pode usar em projetos seus e
de clientes, inclusive comercialmente; não pode revender, redistribuir, publicar como produto próprio nem
compartilhar o acesso.</p>
"""),
    ("Condutas vedadas", """
<p>É vedado: compartilhar login ou acesso; gravar e redistribuir as aulas; revender o material;
remover avisos de autoria; usar o material para treinar modelos de IA de terceiros sem autorização;
e praticar, em nome do produto, qualquer promessa de resultado a terceiros.</p>
<p>A violação autoriza o bloqueio imediato do acesso, sem devolução de valores, sem prejuízo das medidas
cabíveis para reparação de dano.</p>
"""),
    ("Limitação de responsabilidade", """
<p>O conteúdo é fornecido "como está". Não somos responsáveis por: (i) indisponibilidade, mudança de preço,
alteração de limites ou descontinuação das APIs e ferramentas de terceiros apresentadas; (ii) resultados
comerciais obtidos ou não obtidos por você; (iii) danos indiretos, lucros cessantes ou perda de dados
decorrentes do uso dos templates e códigos fornecidos; (iv) conduta de plataformas de busca, redes sociais
ou de pagamento.</p>
<p>Os trechos de código e os blueprints de automação são entregues como ponto de partida, testados na data
da gravação. Cabe a você revisar, testar e adaptar antes de usar em produção ou em projeto de cliente.</p>
"""),
    ("Suporte", """
<p>O suporte é prestado por e-mail
(<a href="mailto:suporte@growthdesignpro.com.br">suporte@growthdesignpro.com.br</a>) enquanto o produto
estiver ativo, com prazo de resposta de até 1 (um) dia útil. O suporte cobre dúvidas sobre o conteúdo do
curso e o uso do material — não inclui execução de projeto, consultoria de marketing nem suporte técnico
das APIs de terceiros.</p>
"""),
    ("Alterações destes termos", """
<p>Podemos atualizar este documento para refletir mudanças no produto ou na legislação. A versão vigente
é sempre a publicada nesta página, com a data de atualização no topo. Alterações relevantes serão
comunicadas por e-mail com antecedência mínima de 15 dias.</p>
"""),
    ("Lei aplicável e foro", """
<p>Estes termos são regidos pelas leis brasileiras. Fica eleito o foro do domicílio do consumidor para
dirimir eventuais controvérsias, conforme o Código de Defesa do Consumidor.</p>
<p><em>Este documento é um modelo de referência e não constitui parecer jurídico. Recomendamos revisão por
advogado antes da publicação comercial.</em></p>
"""),
]

# ---------------------------------------------------------------------------
# POLÍTICA DE PRIVACIDADE (PT-BR) — LGPD
# ---------------------------------------------------------------------------
PRIVACIDADE = [
    ("Quem trata os seus dados", """
<p>O controlador dos dados pessoais coletados na venda e no uso do Growth Design Pro é o produtor do
curso, identificado na nota fiscal emitida pela plataforma de pagamento. Contato do encarregado de dados
(DPO): <a href="mailto:privacidade@growthdesignpro.com.br">privacidade@growthdesignpro.com.br</a>.</p>
"""),
    ("Quais dados coletamos", """
<ul>
<li><strong>Cadastro e compra:</strong> nome, e-mail, documento (quando exigido pela plataforma), país e forma de pagamento (dados do cartão são tratados diretamente pela plataforma de pagamento; não temos acesso ao número completo).</li>
<li><strong>Acesso ao conteúdo:</strong> data e hora de login, aulas assistidas e materiais baixados — para liberar o acesso e acompanhar o seu progresso.</li>
<li><strong>Suporte:</strong> conteúdo das mensagens que você nos envia.</li>
<li><strong>Navegação:</strong> dados de uso do site (páginas visitadas, origem do acesso, tipo de dispositivo), coletados por ferramentas de análise.</li>
</ul>
"""),
    ("Para que usamos e com qual base legal", """
<ul>
<li>Executar o contrato: liberar o acesso, prestar suporte, emitir nota fiscal e processar reembolso. <em>(art. 7º, V, LGPD)</em></li>
<li>Cumprir obrigação legal ou regulatória: guarda de registros fiscais e de acesso. <em>(art. 7º, II)</em></li>
<li>Legítimo interesse: prevenir fraude, compartilhamento indevido de acesso e uso abusivo do material. <em>(art. 7º, IX)</em></li>
<li>Consentimento: envio de comunicações de marketing e de novidades, que você pode revogar a qualquer momento. <em>(art. 7º, I)</em></li>
</ul>
"""),
    ("Com quem compartilhamos", """
<p>Não vendemos dados pessoais. Compartilhamos o mínimo necessário com:</p>
<ul>
<li>Plataforma de pagamento e hospedagem do curso (Hotmart, Kiwify, Eduzz ou Gumroad), para processar a compra e entregar o acesso.</li>
<li>Provedores de e-mail e de área de membros, para enviar as credenciais e as comunicações do produto.</li>
<li>Ferramentas de análise de uso, em forma agregada e sempre que possível anonimizada.</li>
<li>Autoridades públicas, quando houver requisição legal.</li>
</ul>
<p>Quando o fornecedor está fora do Brasil, a transferência internacional observa os arts. 33 e seguintes
da LGPD e é feita com base em cláusulas contratuais e garantias adequadas.</p>
"""),
    ("Por quanto tempo guardamos", """
<ul>
<li>Dados fiscais e de transação: pelo prazo legal de guarda (em regra, 5 anos).</li>
<li>Cadastro e histórico de acesso: enquanto o acesso estiver ativo e por até 12 meses depois, para defesa em eventual disputa.</li>
<li>Registros de consentimento e de suporte: por 5 anos.</li>
</ul>
<p>Encerrados os prazos, os dados são eliminados ou anonimizados.</p>
"""),
    ("Seus direitos", """
<p>Você pode, a qualquer momento, solicitar: confirmação da existência de tratamento; acesso aos dados;
correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados
desnecessários ou excessivos; portabilidade; eliminação dos dados tratados com consentimento;
informação sobre compartilhamentos; e revogação do consentimento.</p>
<p>Escreva para
<a href="mailto:privacidade@growthdesignpro.com.br">privacidade@growthdesignpro.com.br</a>. Respondemos em
até 15 dias. Você também pode peticionar à Autoridade Nacional de Proteção de Dados (ANPD).</p>
"""),
    ("Cookies e tecnologias semelhantes", """
<p>Usamos cookies estritamente necessários para manter a sessão e o login, e cookies de medição para
entender como o conteúdo é usado. Você pode bloquear ou apagar cookies nas configurações do navegador;
o bloqueio dos cookies necessários pode impedir o funcionamento da área de membros.</p>
"""),
    ("Segurança", """
<p>Adotamos medidas técnicas e administrativas razoáveis: transmissão criptografada (HTTPS), controle de
acesso por credencial individual, restrição de acesso interno por função e monitoramento de acessos
anômalos que possam indicar compartilhamento indevido de conta.</p>
"""),
    ("Alterações desta política", """
<p>Podemos atualizar esta política para refletir mudanças no tratamento ou na legislação. A versão vigente
é a publicada nesta página, com a data no topo.</p>
<p><em>Este documento é um modelo de referência e não constitui parecer jurídico. Recomendamos revisão por
advogado antes da publicação comercial.</em></p>
"""),
]

# ---------------------------------------------------------------------------
# LICENÇA DO KIT (PT-BR)
# ---------------------------------------------------------------------------
LICENCA = [
    ("O que esta licença cobre", """
<p>Cobre o <strong>kit de ferramentas</strong> entregue com o curso: biblioteca de prompts, planilhas,
checklists, templates de landing page, blueprints de automação (Make, n8n, Zapier), código-fonte de
exemplo e o Design System Starter Kit.</p>
<p>Não cobre os vídeos nem o e-book, protegidos integralmente por direito autoral e destinados apenas ao
seu uso pessoal de estudo.</p>
"""),
    ("Você pode", """
<ul>
<li>Usar o kit em <strong>projetos próprios</strong>, sem limite de quantidade.</li>
<li>Usar o kit em <strong>projetos de clientes</strong>, inclusive comerciais e remunerados.</li>
<li><strong>Modificar</strong> os arquivos livremente — cores, textos, estrutura, código.</li>
<li>Entregar ao cliente final os <strong>artefatos resultantes</strong> do seu trabalho (por exemplo, a página publicada ou o relatório de diagnóstico).</li>
<li>Vender <strong>o seu serviço</strong> de implementação usando o kit como ferramenta interna.</li>
</ul>
"""),
    ("Você não pode", """
<ul>
<li><strong>Revender, redistribuir ou doar</strong> os arquivos do kit, no formato original ou modificado.</li>
<li><strong>Publicar o kit como produto próprio</strong> — inclusive como template, pack de planilhas, pacote de prompts ou curso.</li>
<li>Incluir os arquivos em pacotes de templates, marketplaces ou bibliotecas de terceiros.</li>
<li><strong>Sublicenciar</strong> ou transferir estes direitos a outra pessoa ou empresa.</li>
<li>Usar o kit para prestar serviço a clientes <strong>em nome do Growth Design Pro</strong> ou sugerindo parceria, certificação ou endosso inexistentes.</li>
<li>Remover ou ocultar avisos de autoria dos arquivos.</li>
</ul>
"""),
    ("Sobre o Design System Starter Kit", """
<p>Os dez sistemas de design entregues no starter kit são <strong>originais</strong>: foram construídos a
partir da leitura de decisões de design de referências públicas (proporção, ritmo, contraste, hierarquia),
sem reprodução de logotipo, ilustração, fotografia, código ou texto de terceiros.</p>
<p>Você pode usar e modificar esses sistemas em projetos próprios e de clientes. Se publicar um sistema
derivado, mantenha a documentação de origem das variáveis — é ela que demonstra originalidade e protege
você de uma acusação de plágio.</p>
"""),
    ("Isenção de garantia", """
<p>Os arquivos são entregues "como estão", sem garantia de adequação a um propósito específico. Teste
antes de usar em produção. Não respondemos por danos decorrentes do uso dos arquivos em ambientes,
plataformas ou projetos de terceiros.</p>
"""),
]

# ---------------------------------------------------------------------------
# TERMS OF USE (EN)
# ---------------------------------------------------------------------------
TERMS_EN = [
    ("Who we are and what this document governs", """
<p>This document is a contract between you ("student" or "user") and Growth Design Pro ("we", "producer"),
and it governs access to the online course <strong>Growth Design Pro</strong> and its companion toolkit.
By completing your purchase you confirm that you have read and accepted these terms.</p>
<p>The producer's corporate identification is stated on the invoice issued by the payment platform at the
time of purchase.</p>
"""),
    ("What the product is — and what it is not", """
<p>Growth Design Pro is an <strong>educational</strong> product. It teaches a design and page-optimization
method and demonstrates the use of six third-party artificial intelligence services.</p>
<p>The product <strong>does not include</strong>: API subscriptions; hosting, domains or third-party tools;
individual consulting; or any guarantee of traffic, search ranking, conversion, sales or income.</p>
<p>API subscriptions are purchased by you, directly from RapidAPI, in your own name and with your own
payment method. They are subject to the terms and prices set by those providers, which may change without
notice and without any involvement on our part.</p>
"""),
    ("Access, term and updates", """
<p>Access is personal, individual and non-transferable, granted for an indefinite term ("lifetime") from
the date of release, and includes content updates we publish for the same cohort or product version.</p>
<p>Access does not include future cohorts, separate products or new launches, which may be sold separately.</p>
"""),
    ("Payment and pricing", """
<p>The applicable price is the one displayed on the sales page at the time of purchase. Launch promotions
have a stated deadline; once it passes, the price returns to full value.</p>
<p>Payments are processed by third-party platforms (Hotmart, Kiwify, Eduzz or Gumroad), which may charge
their own fees and apply their own installment and currency-conversion policies.</p>
"""),
    ("Guarantee and right of withdrawal", """
<p>You have <strong>7 (seven) calendar days</strong> from payment confirmation to withdraw from the purchase
without justification, with a full refund — a right granted by art. 49 of the Brazilian Consumer Protection
Code (CDC).</p>
<p>To exercise it, write to <a href="mailto:hello@growthdesignpro.com">hello@growthdesignpro.com</a> within
the period. The refund is processed by the same platform and payment method, within their operational
timeframes. Access is revoked once the refund process is complete.</p>
"""),
    ("Intellectual property", """
<p>All course content — videos, texts, workbooks, spreadsheets, code files, prompts, templates and visual
identity — is protected by copyright and belongs to the producer or is used under licence.</p>
<p>You receive a personal and professional licence, detailed in the
<a href="licenca.html">Toolkit Licence</a>. In short: you may use it on your own projects and your clients'
projects, including commercially; you may not resell, redistribute, publish it as your own product, or
share your access.</p>
"""),
    ("Prohibited conduct", """
<p>It is prohibited to: share a login or access; record and redistribute lessons; resell the material;
remove authorship notices; use the material to train third-party AI models without authorization; or make
any promise of results to third parties on the product's behalf.</p>
<p>Violation authorizes immediate suspension of access without refund, without prejudice to legal action
for damages.</p>
"""),
    ("Limitation of liability", """
<p>The content is provided "as is". We are not liable for: (i) unavailability, price changes, limit changes
or discontinuation of the third-party APIs and tools presented; (ii) commercial results achieved or not
achieved by you; (iii) indirect damages, lost profits or data loss arising from the use of the supplied
templates and code; (iv) the conduct of search, social or payment platforms.</p>
<p>Code snippets and automation blueprints are delivered as a starting point, tested on the recording date.
You are responsible for reviewing, testing and adapting them before production or client use.</p>
"""),
    ("Support", """
<p>Support is provided by email
(<a href="mailto:hello@growthdesignpro.com">hello@growthdesignpro.com</a>) while the product is active,
with a response time of up to one business day. Support covers questions about the course content and the
use of the material — it does not include project execution, marketing consulting or technical support for
the third-party APIs.</p>
"""),
    ("Changes to these terms", """
<p>We may update this document to reflect changes to the product or to legislation. The current version is
always the one published on this page, with the update date at the top. Material changes will be notified
by email at least 15 days in advance.</p>
"""),
    ("Governing law and jurisdiction", """
<p>These terms are governed by Brazilian law. The courts of the consumer's domicile are elected to settle
any disputes, in accordance with the Brazilian Consumer Protection Code.</p>
<p><em>This document is a reference template and does not constitute legal advice. We recommend review by a
lawyer before commercial publication.</em></p>
"""),
]

# ---------------------------------------------------------------------------
# PRIVACY POLICY (EN)
# ---------------------------------------------------------------------------
PRIVACY_EN = [
    ("Who processes your data", """
<p>The controller of the personal data collected in the sale and use of Growth Design Pro is the course
producer, identified on the invoice issued by the payment platform. Data protection contact (DPO):
<a href="mailto:hello@growthdesignpro.com">hello@growthdesignpro.com</a>.</p>
"""),
    ("What data we collect", """
<ul>
<li><strong>Registration and purchase:</strong> name, email, tax ID (where required by the platform), country and payment method (card data is handled directly by the payment platform; we never see the full card number).</li>
<li><strong>Content access:</strong> login date and time, lessons watched and materials downloaded — to grant access and track your progress.</li>
<li><strong>Support:</strong> the content of messages you send us.</li>
<li><strong>Browsing:</strong> site usage data (pages visited, referrer, device type) collected by analytics tools.</li>
</ul>
"""),
    ("Why we use it and on what legal basis", """
<ul>
<li>To perform the contract: grant access, provide support, issue invoices and process refunds. <em>(LGPD art. 7, V)</em></li>
<li>To comply with legal or regulatory obligations: retaining tax and access records. <em>(art. 7, II)</em></li>
<li>On legitimate interest: preventing fraud, account sharing and abusive use of the material. <em>(art. 7, IX)</em></li>
<li>On consent: marketing and product news, which you can withdraw at any time. <em>(art. 7, I)</em></li>
</ul>
"""),
    ("Who we share it with", """
<p>We do not sell personal data. We share the minimum necessary with:</p>
<ul>
<li>The payment and course-hosting platform (Hotmart, Kiwify, Eduzz or Gumroad), to process the purchase and deliver access.</li>
<li>Email and membership-area providers, to send credentials and product communications.</li>
<li>Analytics tools, in aggregate and where possible anonymized form.</li>
<li>Public authorities, upon lawful request.</li>
</ul>
<p>Where a provider is outside Brazil, the international transfer follows LGPD arts. 33 et seq. and relies
on contractual clauses and appropriate safeguards.</p>
"""),
    ("How long we keep it", """
<ul>
<li>Tax and transaction data: for the statutory retention period (generally 5 years).</li>
<li>Registration and access history: while access is active and for up to 12 months after, for defence in potential disputes.</li>
<li>Consent and support records: 5 years.</li>
</ul>
<p>Once the periods lapse, data is deleted or anonymized.</p>
"""),
    ("Your rights", """
<p>You may at any time request: confirmation that processing exists; access to your data; correction of
incomplete or outdated data; anonymization, blocking or deletion of unnecessary or excessive data;
portability; deletion of data processed with consent; information about sharing; and withdrawal of
consent.</p>
<p>Write to <a href="mailto:hello@growthdesignpro.com">hello@growthdesignpro.com</a>. We reply within 15
days. You may also petition the Brazilian Data Protection Authority (ANPD) or your local supervisory
authority.</p>
"""),
    ("Cookies and similar technologies", """
<p>We use strictly necessary cookies to keep your session and login, and measurement cookies to understand
how the content is used. You can block or delete cookies in your browser settings; blocking necessary
cookies may prevent the members area from working.</p>
"""),
    ("Security", """
<p>We adopt reasonable technical and administrative measures: encrypted transmission (HTTPS), individual
credential access control, role-based internal access restriction and monitoring of anomalous access that
may indicate account sharing.</p>
"""),
    ("Changes to this policy", """
<p>We may update this policy to reflect changes in processing or legislation. The current version is the
one published on this page, with the date at the top.</p>
<p><em>This document is a reference template and does not constitute legal advice. We recommend review by a
lawyer before commercial publication.</em></p>
"""),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("Gerando páginas legais:")

    render(OUT / "termos.html", "pt-BR", "Termos de uso",
           "Termos de uso do curso Growth Design Pro e do kit de ferramentas.",
           "Documento legal", "Aplicável a todas as compras realizadas a partir desta data.",
           TERMOS, NAV_AVISO, RODAPE_PT, "Índice")

    render(OUT / "privacidade.html", "pt-BR", "Política de privacidade",
           "Como o Growth Design Pro coleta, usa, compartilha e protege dados pessoais, conforme a LGPD.",
           "Documento legal", "Aplicável a todas as compras realizadas a partir desta data.",
           PRIVACIDADE, NAV_AVISO, RODAPE_PT, "Índice")

    render(OUT / "licenca.html", "pt-BR", "Licença de uso do kit de ferramentas",
           "O que você pode e o que não pode fazer com o kit de ferramentas do Growth Design Pro.",
           "Documento legal", "Aplicável a todas as compras realizadas a partir desta data.",
           LICENCA, NAV_AVISO, RODAPE_PT, "Índice")

    render(OUT / "terms.html", "en", "Terms of Use",
           "Terms of use for the Growth Design Pro course and toolkit.",
           "Legal document", "Applies to all purchases made from this date onward.",
           TERMS_EN, NAV_AVISO, RODAPE_EN, "Contents")

    render(OUT / "privacy.html", "en", "Privacy Policy",
           "How Growth Design Pro collects, uses, shares and protects personal data under the LGPD.",
           "Legal document", "Applies to all purchases made from this date onward.",
           PRIVACY_EN, NAV_AVISO, RODAPE_EN, "Contents")

    print("Concluído.")


if __name__ == "__main__":
    main()

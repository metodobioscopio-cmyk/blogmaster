# Lemon Squeezy Playbook (para brasileiros vendendo em USD)

## 1. Por que Lemon Squeezy aqui

- **Merchant of Record (MoR):** eles emitem invoice, calculam/cobram/remetem VAT (Europa), GST e US sales tax por estado. Você não abre empresa fora nem configura TaxJar.
- **Checkout global:** cartão + PayPal, Apple Pay/Google Pay, localized.
- **Entrega digital nativa:** arquivos, links, license keys, versionamento.
- **Afiliados + upsell 1-click + order bump** sem plugin.
- **Saque BR:** via **Stripe Express / Payoneer** (conta USD, depois envia para BR). Configure no Settings → Payouts no dia 1.

> Fees (confira no site, mudam): ~5% + $0.50/pedido + gateway. Embuta no preço — por isso $19 e não $14.99.

## 2. Setup da loja (checklist 1h)

1. **Store:** nome em inglês (ex: `NorthPeak Studio`), logo minimalista, domínio `lemon-squeezy.store/sua-loja` (custom domain depois).
2. **Tax:** deixe MoR ativo para tudo. Não desligue US tax / EU VAT.
3. **Payouts:** conectar Stripe Express ou Payoneer, moeda USD, saque mínimo conferido.
4. **E-mail:** remetente `support@seudominio.com` (ou Gmail pro no início), footer com refund policy.
5. **Policies:** 7-day refund para templates/ebooks (padrão que converte e evita chargeback), 14-day para bundle.
6. **Affiliates:** ativar, default 30%, bundle 50%, cookie 60 dias, payout mensal.
7. **Analytics:** UTM em tudo (`?utm_source=tiktok&utm_campaign=p1`), Meta pixel só após 10 vendas.

## 3. Estrutura de produto (replicar nos 10)

Cada produto = **1 Product com 2 Variants:**

- **Standard** ($X): entregável core + quickstart PDF.
- **Plus (+$15–$20):** core + bônus exclusivos + updates vitalícios + vídeo extra.

Exemplo #1 Freelancer OS:

- Standard $29: template + quickstart.
- Plus $44: + Invoice Pack + Proposal Pack + vídeo setup 1:1 gravado.

Arquivos:

- Habilite **versioning** (v1.0, v1.1...). Lemon entrega sempre a última.
- Para Notion/Canva/Sheets: entregue **PDF com links** (duplicate link) + vídeo, não só o link solto. Evita reembolso "não consegui acessar".
- Limite de downloads generoso (evita suporte).

## 4. Checkout que converte (template)

- **Título EN:** `[Resultado] in [Tempo] — Without [Dor]` (ex: *Get Your First 3 Freelance Clients in 30 Days — Without Cold DMs*).
- **Sub:** formato + tempo + sem pré-requisito (*Notion template + 15-min setup video. No Notion experience needed.*).
- **Bullets (5–7):** resultado, não feature. Cada bullet = verbo + número + tempo.
- **Prova:** 3 prints (antes/depois, dashboard, depoimento — mesmo que beta).
- **Demo:** GIF 10s ou Loom 3min embedado.
- **FAQ (5):** How do I receive? Do I need paid Notion/Canva? Refunds? Updates? Commercial use?
- **Garantia:** *7-day, no-questions-asked. If the system doesn't save you 5+ hours, email us.*
- **Order bump:** 1 frase + checkbox pré-marcada? Não — deixe desmarcada, mas com preço âncora (~~$19~~ $9 today only).
- **Upsell page:** vídeo 60s + botão 1-click + countdown 15min.

## 5. Pós-compra (onde mora o LTV)

- **E-mail 0 (entrega):** assunto `Your [Product] is ready 🎉` + botão ACCESS + link backup + "reply if stuck".
- **E-mail D+1:** quick win ("Do this 10-min setup first...").
- **E-mail D+3:** upsell cruzado (ex: comprou #2 prompts → oferta #1 OS com cupom 20%).
- **E-mail D+14:** pedido de review (ofereça $5 coupon) + convite afiliado.

Use o e-mail nativo do Lemon + ConvertKit/Beehiiv quando passar 500 compradores.

## 6. Erros que matam brasileiros no Lemon

1. Preço em BRL ou "R$" na página EN. **Tudo USD, tudo inglês.**
2. Entregar link Notion sem permissão duplicate. **Teste em janela anônima.**
3. Esquecer VAT: cliente EU vê +20% no checkout e abandona. **Mostre "VAT included" nos bullets se possível / deixe claro total.**
4. Sem vídeo demo: template sem demo converte ~40% menos.
5. Afiliado sem material: entregue swipe (3 e-mails + 5 tweets + 3 pins) na página de afiliados.
6. Suporte lento: responda <24h nos primeiros 30 dias. Review 5★ inicial vale ouro.

## 7. Roteiro de upload (15min/produto)

1. Products → New → Digital product → nome EN + slug `freelancer-os-notion`.
2. Upload: PDF-links + bônus ZIP + cover 1600x900.
3. Variants: Standard / Plus.
4. Checkout: order bump product + upsell product.
5. Test purchase (cupom 100% OFF) → valida e-mail + links.
6. Publicar + copiar URL com UTM + pinnar no Beacons/Stan.

# Materiais de Venda
### Growth Design Pro · arquivos prontos para publicar

| Arquivo | O que é | Onde usar |
|---|---|---|
| `pagina-de-vendas.md` | A copy completa da página, em markdown | colar no construtor de página, na Hotmart/Kiwify/Eduzz ou no seu site |
| `anuncios.md` | 14 anúncios para Meta, Google, TikTok e YouTube | tráfego pago |
| `emails.md` | Sequência de 8 e-mails de lançamento | plataforma de e-mail |
| `plano-de-lancamento.md` | Cronograma de 21 dias, com responsável e critério | execução do lançamento |

A página de vendas também existe pronta em HTML: `site/index.html` (PT-BR) e `site/en/index.html`
(EN). A versão em markdown aqui é para quando você precisa colar o texto em outra ferramenta.

---

## Antes de publicar: as sete verificações obrigatórias

Estas não são sugestões de marketing. São o que impede o produto de gerar problema jurídico,
reclamação pública e reembolso em massa.

**1. Nenhum depoimento inventado.**
A página entrega dois espaços marcados (`data-placeholder="depoimento-1"` e `-2`). Se você não tem
aluno real com resultado medido e autorização por escrito do uso de nome e imagem, **delete a seção**.
Publicidade com depoimento falso é infração ao Código de Defesa do Consumidor e ao CONAR.

**2. Nenhum número de resultado inventado.**
Remova qualquer promessa de renda, tráfego, ranking ou prazo. O que você pode afirmar é o que está no
produto: número de módulos, aulas, prompts, planilhas, e a capacidade das ferramentas que **o aluno
vai contratar** — não um resultado que ele obterá.

**3. Assinaturas das APIs não estão inclusas.**
Isso precisa estar em três lugares: na seção do stack, na oferta e no FAQ. A reclamação mais previsível
deste produto é o aluno que comprou achando que a assinatura estava incluída.

**4. Preço de lançamento com prazo real.**
Está escrito "encerra em 7 dias". Ou você cumpre, ou retira a frase. Preço riscado permanente e prazo
que reinicia destroem a confiança que o produto leva 4 horas de vídeo para construir.

**5. Garantia de 7 dias cumprida sem atrito.**
Art. 49 do CDC. Pediu, devolve. Sem formulário, sem entrevista, sem retenção de acesso como pressão.

**6. Independência declarada.**
O produto não é afiliado, patrocinado nem endossado pelo RapidAPI, pelos fornecedores das APIs ou pelas
plataformas de pagamento. Isso está no rodapé — mantenha lá.

**7. Revisão jurídica antes de escalar.**
Os textos em `site/legal/` são modelos de referência, escritos para serem completos e honestos, mas
**não são parecer jurídico**. Antes de investir em tráfego, peça a um advogado que revise termos,
privacidade e licença. Custa pouco perto do risco.

---

## Placeholders que você precisa substituir antes de publicar

Busque e substitua em todos os arquivos (site, e-book, kit, vendas):

| Placeholder | Onde aparece | Substituir por |
|---|---|---|
| `CHECKOUT-URL-AQUI` (PT) · `CHECKOUT-URL-HERE` (EN) | botões da página de vendas | URL real do checkout na plataforma |
| `contato@growthdesignpro.com.br` | rodapé, FAQ, legal | seu e-mail de atendimento |
| `suporte@growthdesignpro.com.br` | área de membros, kit | seu e-mail de suporte |
| `hello@growthdesignpro.com` | versão em inglês | seu e-mail internacional |
| `privacidade@growthdesignpro.com.br` | política de privacidade | e-mail do encarregado de dados |
| `https://growthdesignpro.com.br` | canonical, OG, hreflang | seu domínio |
| CNPJ e razão social | rodapé e nota fiscal | seus dados |

O script `tools/verificar.py` lista todos os placeholders e links ainda pendentes:

```bash
python3 tools/verificar.py
```

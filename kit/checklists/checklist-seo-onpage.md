# Checklist de SEO On-Page
### Growth Design Pro · Kit de Ferramentas

**Como usar.** Rode a **AI SEO Analysis API** primeiro e traga o score para o lado deste checklist. O objetivo
não é "tirar 100": é fechar as lacunas que impedem a página de ser entendida e ranqueada. Itens marcados ⚡
são de execução imediata.

> **Aviso honesto.** Nenhum item deste checklist garante posição no Google. Ele garante que a página não está
> sabotando a própria chance de ranquear.

---

## 1. Elementos de página

- [ ] **Title** — até 60 caracteres, palavra-chave o mais à esquerda que fizer sentido, nome da marca no fim
- [ ] **Meta description** — 140 a 158 caracteres, escrita para ser **clicada**, com o benefício, não a descrição ⚡
- [ ] **H1 único** — um por página, contendo a promessa principal
- [ ] **H2/H3 em ordem hierárquica** — sem pular de h2 para h4 por motivo visual
- [ ] **Slug** — curto, sem palavra de enfeite (`/diagnostico-seo`, não `/servicos/solucoes-em-seo-para-empresas`)
- [ ] **Canonical** — aponta para a versão que deve ranquear, sem loop
- [ ] **`lang` correto** — `pt-BR`, não `pt` nem vazio

## 2. Conteúdo

- [ ] A página responde à **intenção dominante** de quem busca a palavra-chave escolhida
- [ ] Existe conteúdo suficiente para a intenção (página de serviço ≠ artigo informacional)
- [ ] A palavra-chave aparece no primeiro parágrafo, sem forçar
- [ ] Nenhum trecho com keyword stuffing — se soa estranho lido em voz alta, corte ⚡
- [ ] Existe resposta direta e curta à pergunta principal (o "trecho de resposta")
- [ ] Pelo menos um elemento escaneável: lista, tabela, passo a passo ou comparação
- [ ] Nenhum texto duplicado de outra página do mesmo site (verifique as 5 principais) ⚡
- [ ] Cada página tem **uma** intenção. Se tiver duas, divida.

## 3. Links

- [ ] Links internos apontando para páginas relacionadas, com texto âncora descritivo (não "clique aqui")
- [ ] Nenhum link apontando para o lugar errado ou para página removida (verifique os 20 primeiros)
- [ ] Links externos, quando houver, com `rel="noopener"` e abrindo em nova aba apenas se necessário
- [ ] Nenhum link órfão: toda página nova recebe ao menos um link de dentro do site
- [ ] Navegação principal alcançável em até 3 cliques de qualquer página

## 4. Imagens e mídia

- [ ] `alt` descritivo nas imagens que carregam informação
- [ ] `alt=""` (vazio, não ausente) nas imagens decorativas
- [ ] Arquivos comprimidos, formato moderno (WebP/AVIF) e com `width`/`height` declarados
- [ ] Nenhuma informação crítica dentro de imagem sem equivalente em texto (inclusive preços e contatos) ⚡
- [ ] Nome do arquivo descritivo (`diagnostico-seo-planilha.webp`, não `IMG_2043.jpg`)

## 5. Estrutura técnica mínima

- [ ] `robots.txt` acessível e sem `Disallow: /` acidentalmente publicado ⚡
- [ ] Sitemap gerado, acessível e enviado ao Search Console
- [ ] Nenhuma página de teste, rascunho ou obrigado indexada (`noindex` nelas)
- [ ] Sem canibalização: duas páginas do site não disputam a mesma palavra-chave ⚡
- [ ] Redirecionamentos 301 para URLs antigas, sem corrente de redirects
- [ ] HTTPS em tudo, sem conteúdo misto
- [ ] Dados estruturados coerentes com o que a página mostra (não marque o que não existe)

## 6. Experiência (afeta ranking porque afeta gente)

- [ ] Carrega em menos de 3 s em 4G
- [ ] Nenhum layout shift perceptível
- [ ] Texto legível sem zoom no celular (mínimo 16 px no corpo)
- [ ] Áreas de toque com no mínimo 44×44 px
- [ ] Sem pop-up que cobre o conteúdo na entrada do celular

## 7. Local e internacional (quando aplicável)

- [ ] `hreflang` correto entre as versões de idioma, com retorno mútuo
- [ ] NAP consistente (nome, endereço, telefone) em todas as páginas, igual ao Google Meu Negócio
- [ ] Página de contato com mapa, horário e telefone clicável
- [ ] Dados estruturados de negócio local (`LocalBusiness`) preenchidos de verdade

---

## Registro da rodada

| | Antes | Depois |
|---|---|---|
| Score geral (API) | | |
| Dimensão mais fraca | | |
| Páginas com title duplicado | | |
| Links quebrados | | |
| Data da rodada | | |

**Próxima rodada em:** 30 dias. Rode a API na mesma URL e compare — score sem comparação é só número.

**O que NÃO fazer mesmo que a API recomende:** inflar densidade de palavra-chave, criar páginas de texto
raso para cada variação da palavra-chave, ou marcar dados estruturados que a página não exibe.

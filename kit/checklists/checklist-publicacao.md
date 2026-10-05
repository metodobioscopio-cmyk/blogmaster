# Checklist de Publicação
### Growth Design Pro · Kit de Ferramentas · o último portão antes do clique

**Quando usar.** Após a página estar pronta no ambiente de teste e antes de liberar o índice de busca.
Percorra de cima para baixo; qualquer item do bloco 1 é **bloqueador** — não se publica com pendência ali.

---

## 1. Bloqueadores (não publique com nenhum item aberto)

- [ ] Nenhuma promessa de resultado não verificável no texto ("você vai faturar X", "primeiro no Google")
- [ ] Nenhum depoimento sem autorização por escrito e sem identificação rastreável
- [ ] Política de privacidade acessível **se** houver qualquer coleta de dado pessoal
- [ ] Formulário envia de verdade e chega no destino certo (você testou o recebimento?)
- [ ] Nenhum link quebrado nos caminhos principais (menu, CTAs, rodapé)
- [ ] Preço, condição e o que está incluído estão explícitos e atualizados
- [ ] Página de termos/garantia/contato alcançável em 1 clique do rodapé
- [ ] Nenhum dado de teste esquecido: placeholder, "Lorem", nome fictício de cliente, telefone de exemplo
- [ ] Nenhuma credencial, chave de API ou token visível no código-fonte da página ⚡

## 2. Conteúdo

- [ ] Título da aba e meta description escritos para a página publicada (não os do modelo)
- [ ] H1 um por página; hierarquia de headings em ordem
- [ ] Nenhum `[CONFIRMAR]`, `TODO` ou comentário de rascunho sobrevivente ⚡
- [ ] Ortografia e gramática revisadas **por uma segunda pessoa**
- [ ] Nomes próprios, cargos, números e datas conferidos com o cliente
- [ ] O texto responde às 3 objeções mais comuns (estão no FAQ ou no corpo)
- [ ] Voz consistente: nenhuma seção soa como outra empresa

## 3. Técnico

- [ ] Carregamento abaixo de 3 s em 4G real (testado no celular, não no Wi-Fi)
- [ ] `lang` correto, charset UTF-8, viewport declarado
- [ ] `robots.txt` liberando a página (e bloqueando rascunhos)
- [ ] `sitemap.xml` atualizado com a URL nova
- [ ] Canonical apontando para si mesma (ou para a versão correta)
- [ ] Favicon e imagem de compartilhamento (OG) presentes — e testadas em um preview real
- [ ] Redirecionamentos configurados se a URL substitui uma antiga
- [ ] Nenhum `noindex` esquecido em página que deve ranquear ⚡
- [ ] HTTPS sem conteúdo misto
- [ ] `404` personalizada apontando para caminhos úteis

## 4. Acessibilidade

- [ ] Contraste mínimo AA em todo par texto/fundo
- [ ] Foco visível em botões, campos e links
- [ ] Navegação completa por teclado (percorra a página com Tab, apenas)
- [ ] Textos alternativos nas imagens informativas; `alt=""` nas decorativas
- [ ] Rótulos associados aos campos do formulário
- [ ] Mensagens de erro perceptíveis sem depender só de cor
- [ ] Conteúdo legível a 200% de zoom

## 5. Medição e rastreamento

- [ ] Analytics instalado e **validado com evento de teste** (apareceu no relatório em tempo real?)
- [ ] Evento de conversão configurado e disparando
- [ ] Cada CTA principal com evento próprio
- [ ] Score inicial (SEO e conversão) registrado no `growth-dashboard.xlsx` com a data
- [ ] Capturado o estado "antes": print da página, do score e do analytics

## 6. Aprovação

- [ ] Cliente aprovou o texto final (por escrito — e-mail serve e é o que você vai querer ter)
- [ ] Cliente ciente do que a página **não** inclui
- [ ] Responsável por responder os contatos definido (nome e prazo de resposta)
- [ ] O que fazer se chegar contato fora do horário, definido
- [ ] Prazo de revisão combinado: quanto tempo até a primeira leitura de métricas

## 7. Pós-publicação (primeiras 72 h)

- [ ] Página aberta no celular de outra pessoa (não o seu) — sempre aparece algo
- [ ] URL enviada para indexação (Search Console)
- [ ] Teste de caminho completo: anúncio/post → página → formulário → e-mail de confirmação
- [ ] Resposta automática de e-mail revisada e testada
- [ ] Rodada de API agendada para 30 dias
- [ ] Anotado no dashboard: 3 coisas que você acha que vão performar melhor — e as 3 que vai verificar

---

**Regra dos três olhos.** Antes de publicar, três pessoas diferentes devem olhar: uma revisa texto, uma testa
no próprio celular, uma procura o que você deixou passar. Se você trabalha sozinho, olhe três vezes em dias
diferentes — na terceira vez você vê o que estava invisível na primeira.

**Depois de publicar, não mexa por 7 dias.** Mexer em página recém-publicada por impulso gera dado
contaminado e a impressão de que nada funciona.

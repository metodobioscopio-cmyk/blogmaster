# Design System Starter Kit
### Growth Design Pro · Kit de Ferramentas

Dez sistemas de design **originais**, cada um com as decisões declaradas e as cores já verificadas em contraste AA para texto de corpo. Serve para você parar de começar do zero: escolha o sistema mais próximo do que faz sentido para o projeto, troque as variáveis e siga.

> **Por que estes sistemas são originais.** A metodologia Vibe Design ensina a extrair *decisões* de design — contraste, ritmo, temperatura, hierarquia — e não ativos. Cada sistema abaixo foi construído a partir dessas decisões, sem reproduzir logotipo, ilustração, foto, código ou texto de terceiros. É isso que permite entregar o material com uso comercial liberado.

---

## Os dez sistemas

| Arquivo | Sistema | Ideia central | Densidade |
|---|---|---|---|
| `01-editorial-papel.css` | **Editorial Papel** | Revista impressa de alto padrão: papel morno, tinta, um único acento metálico. Muito respiro, hi… | arejado |
| `02-saas-claro.css` | **SaaS Claro** | Produto digital de uso diário: fundo claro, azul de confiança, cantos suaves, cards com sombra l… | médio |
| `03-noite-dourada.css` | **Noite Dourada** | Fundo escuro com acento quente. Alto contraste e percepção de exclusividade. Exige disciplina: o… | arejado |
| `04-tecnico-mono.css` | **Técnico Mono** | Feito para documentação e ferramenta de desenvolvedor: denso, monoespaçado nos dados, hierarquia… | denso |
| `05-terroso-artesanal.css` | **Terroso Artesanal** | Marca de produção artesanal: barro, oliva e papel cru. Tipografia serifada com tracking levement… | médio |
| `06-corporativo-solido.css` | **Corporativo Sólido** | Institucional que precisa transmitir estabilidade: azul-petróleo, grade firme, hierarquia previs… | médio |
| `07-neon-controlado.css` | **Neon Controlado** | Energia de produto de tecnologia sem cair no clichê do gradiente: fundo escuro, acento ciano usa… | denso |
| `08-minimal-suico.css` | **Minimal Suíço** | Grade rigorosa, muito branco, tipografia sem serifa em poucos pesos e hierarquia obtida por esca… | arejado |
| `09-servico-local.css` | **Serviço Local** | Negócio de bairro que precisa ser encontrado e contatado rápido: contraste alto, texto grande, b… | denso |
| `10-publicacao-cultural.css` | **Publicação Cultural** | Site de conteúdo e cultura: serifada grande para leitura longa, papel levemente esverdeado, link… | arejado |

---

## Como usar

1. Abra `index.html` no navegador para ver os dez lado a lado.
2. Escolha um ou dois candidatos para o projeto (nunca misture três).
3. Copie o arquivo `.css` para o projeto e ajuste **valores**, não nomes de token.
4. Verifique o contraste de qualquer cor nova (mínimo 4.5:1 no texto de corpo).
5. Documente de onde veio cada variável alterada — é o hábito que separa método de cópia.

```html
<!-- no <head>, antes do CSS do projeto -->
<link rel="stylesheet" href="sistema-01-editorial-papel.css">
```

### O que cada arquivo traz

- **Cor** — cada token com a função declarada (fundo, texto, acento, estado).
- **Tipografia** — escala geométrica de 7 níveis, line-height e tracking por papel.
- **Espaçamento** — escala na base de 4 ou 8 px, com larguras máximas de conteúdo e leitura.
- **Forma** — raio, sombra e curva de movimento.
- **Base mínima** — reset, títulos, botão, cartão. Remova se o projeto já tiver os seus.
- **Regras de aplicação** — as seis restrições que mantêm o sistema coerente.

---

## Regras de recombinação

Recombinar é trocar variáveis **de fontes diferentes** até o resultado não lembrar nenhuma delas.

| Variável | Troque entre sistemas | Cuidado |
|---|---|---|
| Tipografia | livremente | duas famílias de display na mesma página competem |
| Cor de acento | uma única fonte | acento duplo anula o poder do acento |
| Ritmo de espaçamento | do mesmo sistema | misturar base 4 e base 8 cria buracos visuais |
| Raio e sombra | coerentes entre si | raio 16 com sombra dura parece erro de renderização |
| Movimento | sempre o mais contido | duas linguagens de animação na mesma tela viram ruído |

---

## Licença

Uso pessoal e comercial liberado, inclusive em projetos de clientes. Vedada a revenda, redistribuição ou publicação destes arquivos como produto próprio. Texto completo em
`site/legal/licenca.html`.

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_downloads.py — monta a pasta `downloads/` com TUDO separado para baixar.

  downloads/0-LEIA-ME-DOWNLOADS.txt
  downloads/1-Livro-1-IA-que-Trabalha-por-Voce.zip
  downloads/2-Livro-2-Saia-do-Vermelho-em-60-Dias.zip
  downloads/3-Livro-3-Airfryer-Sem-Mimimi.zip
  downloads/4-Livro-4-Energia-em-21-Dias.zip          (inclui os 4 áudios)
  downloads/Kit-Completo-4-Livros.zip                  (90+ arquivos)
  downloads/5-Pacote-Marketing-Capas-Mockups-Anuncios.zip
  downloads/6-Paginas-de-Venda-HTML.zip

Uso: python3 tools/gerar_downloads.py
"""
import os, zipfile, shutil

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
DEST = os.path.join(PROJ, "downloads")

COMECE = {
"Livro-1-IA-que-Trabalha-por-Voce": """COLEÇÃO VIDA EM ORDEM · VOL. 1 — IA QUE TRABALHA POR VOCÊ
=========================================================================

O QUE VEIO NO SEU DOWNLOAD
  Livro-1-IA-que-Trabalha-por-Voce.pdf ......... livro completo (leia no celular ou no PC)
  Livro-1-IA-que-Trabalha-por-Voce-BONUS.pdf ... bônus: 200 prompts por profissão
  Livro-1-IA-que-Trabalha-por-Voce.epub ........ versão para Kindle / Kobo / Apple Books
  fontes-editaveis/ ............................ textos em Markdown para você editar

COMECE POR AQUI
  1. Abra o PDF e leia as páginas iniciais (o método 5D e a fórmula P.O.C.F.R.).
  2. Vá para o bônus e escolha 3 prompts da SUA profissão.
  3. Faça a tarefa do primeiro capítulo hoje — leva 15 minutos.

COMO ABRIR O EPUB
  Envie o arquivo para o app Kindle (ou e-mail @kindle.com), Kobo ou Apple Books.
  Também abre em qualquer leitor de EPUB no celular.

SUPORTE
  Não conseguiu abrir algum arquivo? Responda o e-mail da sua compra.

MATERIAL EDUCACIONAL. Não é consultoria, não promete resultado e não substitui orientação profissional.
""",
"Livro-2-Saia-do-Vermelho-em-60-Dias": """COLEÇÃO VIDA EM ORDEM · VOL. 2 — SAIA DO VERMELHO EM 60 DIAS
=========================================================================

O QUE VEIO NO SEU DOWNLOAD
  Livro-2-Saia-do-Vermelho-em-60-Dias.pdf ......... livro completo
  Livro-2-Saia-do-Vermelho-em-60-Dias-BONUS.pdf ... bônus: 15 scripts de negociação
  Livro-2-Saia-do-Vermelho-em-60-Dias.epub ........ versão para Kindle / Kobo / Apple Books
  fontes-editaveis/ ............................... textos em Markdown para você editar

COMECE POR AQUI
  1. Abra o PDF e faça a planilha Raio-X (capítulo 1): só liste, não julgue.
  2. Descubra sua capacidade real de pagamento (capítulo 3).
  3. Escolha UMA dívida e use o script da página correspondente esta semana.

O QUE VOCÊ VAI PRECISAR
  Uma planilha (Google Sheets, Excel ou papel) e 20 minutos de silêncio por semana.

MATERIAL EDUCACIONAL DE ORGANIZAÇÃO E NEGOCIAÇÃO. Não é consultoria jurídica nem financeira.
Direito de arrependimento: 7 dias (Código de Defesa do Consumidor, art. 49).
""",
"Livro-3-Airfryer-Sem-Mimimi": """COLEÇÃO VIDA EM ORDEM · VOL. 3 — AIRFRYER SEM MIMIMI
=========================================================================

O QUE VEIO NO SEU DOWNLOAD
  Livro-3-Airfryer-Sem-Mimimi.pdf ......... livro completo: 120 receitas
  Livro-3-Airfryer-Sem-Mimimi-BONUS.pdf ... bônus: tabela mestra + cardápio de 30 dias
  Livro-3-Airfryer-Sem-Mimimi.epub ........ versão para Kindle / Kobo / Apple Books
  fontes-editaveis/ ....................... textos em Markdown para você editar

COMECE POR AQUI
  1. Confira a litragem da sua airfryer e veja a tabela de ajuste (primeiro capítulo).
  2. Imprima a tabela mestra de tempo e temperatura e cole na geladeira.
  3. Faça a receita 01 hoje. Depois escolha 3 da sua faixa de orçamento.
  4. No domingo, teste o sistema 20-5-7 (7 marmitas em 90 minutos).

DICA
  Cada receita traz 4 números: tempo ativo, custo por porção, temperatura e litragem testada.
  Comece pelas receitas da SUA litragem para acertar de primeira.
""",
"Livro-4-Energia-em-21-Dias": """COLEÇÃO VIDA EM ORDEM · VOL. 4 — ENERGIA EM 21 DIAS
=========================================================================

O QUE VEIO NO SEU DOWNLOAD
  Livro-4-Energia-em-21-Dias.pdf ......... livro completo: protocolo S.O.N.O. de 21 dias
  Livro-4-Energia-em-21-Dias-BONUS.pdf ... bônus: rastreador, checklists, 4 roteiros de áudio
  Livro-4-Energia-em-21-Dias.epub ........ versão para Kindle / Kobo / Apple Books
  audios/ ................................ 4 áudios guiados (com pausas longas):
        01-respiracao-guiada.mp3 ....... 5 min (para deitar)
        02-soltar-o-dia.mp3 ............ 7 min (quando a cabeça liga na cama)
        03-foco-para-comecar.mp3 ....... 8 min (antes da tarefa difícil)
        04-sol-da-manha.mp3 ............ 10 min (acompanha os 10 minutos de luz)
  fontes-editaveis/ ...................... textos em Markdown para você editar

COMECE POR AQUI
  1. Abra o PDF, leia o aviso de segurança e faça a autoavaliação do capítulo 1.
  2. Descubra seu "horário X" da cafeína e seu horário de dormir (capítulo 2).
  3. Faça a tarefa do DIA 1 hoje — são 15 minutos, e a primeira é de manhã.
  4. Baixe os áudios no celular: use o 04 ao acordar, e o 01 ou 02 ao deitar.

OS ÁUDIOS
  São narrações guiadas em português, com pausas para você fazer o exercício.
  Ouça de fone, sentado ou deitado. Não há música de fundo.
  Se sentir tontura ou desconforto respirando, pare e volte ao ritmo normal.
  Nunca ouça dirigindo ou operando máquinas.

AVISO IMPORTANTE
  Este é um material educacional de rotina e bem-estar. Ele NÃO substitui avaliação
  profissional de saúde e não se destina a tratar qualquer condição. Se você tem
  dificuldade persistente para dormir, ronco com pausas na respiração, sonolência ao
  volante ou usa medicação contínua, procure um profissional de saúde.
  Em crise, ligue 188 (CVV, 24h e gratuito).
""",
}

def zipar(origem, nome_zip, prefixo, extra_txt=None, extra_nome="00-COMECE-AQUI.txt"):
    caminho = os.path.join(DEST, nome_zip)
    n = 0
    with zipfile.ZipFile(caminho, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for raiz, _, files in os.walk(origem):
            if "_thumbs" in raiz.split(os.sep):     # miniaturas do hub, não vão para o ZIP
                continue
            for f in sorted(files):
                full = os.path.join(raiz, f)
                if full.endswith(".zip"): continue
                z.write(full, os.path.join(prefixo, os.path.relpath(full, origem)))
                n += 1
        if extra_txt:
            z.writestr(os.path.join(prefixo, extra_nome), extra_txt)
            n += 1
    return caminho, n

LEIA_DOWNLOADS = """COLEÇÃO VIDA EM ORDEM — PASTA DE DOWNLOADS
=========================================================================

CADA LIVRO SEPARADO (para baixar só o que quiser)
  1-Livro-1-IA-que-Trabalha-por-Voce.zip ....... 63 pág. + bônus de 60 pág.
  2-Livro-2-Saia-do-Vermelho-em-60-Dias.zip .... 86 pág. + bônus de 16 pág.
  3-Livro-3-Airfryer-Sem-Mimimi.zip ............ 115 pág. + bônus de 25 pág.
  4-Livro-4-Energia-em-21-Dias.zip ............. 74 pág. + bônus de 24 pág. + 4 ÁUDIOS

PACOTE COMPLETO
  0-Pacote-FULL-Tudo.zip ....................... TUDO (334 arquivos, 44 MB): livros, áudios,
                                                 marketing, páginas de venda, documentação e
                                                 os fontes + scripts que geram o material
  Kit-Completo-4-Livros.zip .................... os 4 livros + todos os bônus + os 4 áudios

MATERIAL DE PRODUÇÃO (não é o que o cliente recebe)
  5-Pacote-Marketing-Capas-Mockups-Anuncios.zip . capas 1600x2560, 20 mockups, 13 anúncios
  6-Paginas-de-Venda-HTML.zip ................... 5 páginas prontas (HTML autocontido)

O QUE VEM DENTRO DE CADA LIVRO
  PDF principal · PDF de bônus · EPUB (Kindle/Kobo) · fontes editáveis em Markdown
  + 00-COMECE-AQUI.txt com o passo a passo de uso

OBSERVAÇÕES
  - Os arquivos são de 20 a 21 MB por livro por causa dos áudios do Volume 4.
  - O material de marketing e as páginas de venda ainda têm marcadores
    "SUBSTITUIR-..." (links de checkout, e-mail de suporte, razão social).
    Procure por esse texto antes de publicar.
  - Nada aqui promete resultado: os materiais são educacionais.
"""

def main():
    os.makedirs(DEST, exist_ok=True)
    for velho in os.listdir(DEST):
        if velho == "0-Pacote-FULL-Tudo.zip":     # gerado por gerar_pacote_full.py
            continue
        if velho.endswith(".zip") or velho.endswith(".txt"):
            os.remove(os.path.join(DEST, velho))

    mapa = {
        "Livro-1-IA-que-Trabalha-por-Voce":  "1-Livro-1-IA-que-Trabalha-por-Voce",
        "Livro-2-Saia-do-Vermelho-em-60-Dias": "2-Livro-2-Saia-do-Vermelho-em-60-Dias",
        "Livro-3-Airfryer-Sem-Mimimi":       "3-Livro-3-Airfryer-Sem-Mimimi",
        "Livro-4-Energia-em-21-Dias":        "4-Livro-4-Energia-em-21-Dias",
    }
    linhas = []
    for pasta, apelido in mapa.items():
        org = os.path.join(PROJ, "entregaveis", pasta)
        if not os.path.isdir(org):
            print("FALTA", org); continue
        caminho, n = zipar(org, apelido + ".zip", apelido, COMECE[pasta])
        linhas.append((apelido + ".zip", n, os.path.getsize(caminho)))

    kit, n = zipar(os.path.join(PROJ, "entregaveis"), "Kit-Completo-4-Livros.zip", "Kit-Completo-4-Livros")
    linhas.append(("Kit-Completo-4-Livros.zip", n, os.path.getsize(kit)))

    mkt = os.path.join(PROJ, "marketing")
    if os.path.isdir(mkt):
        caminho, n = zipar(mkt, "5-Pacote-Marketing-Capas-Mockups-Anuncios.zip", "marketing",
                           "PACOTE DE MARKETING — COLEÇÃO VIDA EM ORDEM\n"
                           "capas/ (1600x2560) · mockups/ (5 poses por volume + hero do kit)\n"
                           "anuncios/ (feed 1080x1350, story 1080x1920, pinterest 1000x1500)\n"
                           "Detalhes de uso em ../11-criativos-visuais.md\n", "LEIA-ME.txt")
        linhas.append(("5-Pacote-Marketing-Capas-Mockups-Anuncios.zip", n, os.path.getsize(caminho)))

    pag = os.path.join(PROJ, "paginas")
    if os.path.isdir(pag):
        caminho, n = zipar(pag, "6-Paginas-de-Venda-HTML.zip", "paginas",
                           "PÁGINAS DE VENDA — COLEÇÃO VIDA EM ORDEM\n"
                           "index.html + livro-1..4.html (cada uma é UM arquivo, com imagem embutida)\n\n"
                           "COMO PUBLICAR\n"
                           "  1. Abra o .html no navegador e troque TODOS os textos 'SUBSTITUIR-...'\n"
                           "     (links de checkout, e-mail de suporte, razão social).\n"
                           "  2. Suba a pasta em Kiwify/Cakto/Hotmart (página de vendas) ou em\n"
                           "     Netlify/Vercel/Cloudflare Pages (arraste a pasta, é grátis).\n"
                           "  3. Configure o pixel/UTM da plataforma de anúncio no checkout.\n"
                           "  4. Troque o og:image por uma URL pública da capa (base64 não aparece\n"
                           "     em preview de rede social).\n\n"
                           "As páginas NÃO têm depoimentos: só entram depois de venda real, com\n"
                           "autorização por escrito. Há um bloco comentado no HTML mostrando onde colar.\n", "LEIA-ME.txt")
        linhas.append(("6-Paginas-de-Venda-HTML.zip", n, os.path.getsize(caminho)))

    with open(os.path.join(DEST, "0-LEIA-ME-DOWNLOADS.txt"), "w", encoding="utf-8") as f:
        f.write(LEIA_DOWNLOADS)
    print(f"{'arquivo':48s} {'itens':>6s}  {'tamanho':>9s}")
    for nome, n2, tam in linhas:
        print(f"{nome:48s} {n2:6d}  {tam/1048576:7.2f} MB")
    print("\nPasta:", DEST)

if __name__ == "__main__":
    main()

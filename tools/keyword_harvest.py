#!/usr/bin/env python3
"""
keyword_harvest.py — coleta sugestoes reais de busca (Google Autocomplete + People Also Ask)
para montar Custom Intent Segments no Google Ads.

Uso:
    python tools/keyword_harvest.py --seed "brain song" --lang en --out termos.csv
    python tools/keyword_harvest.py --seed "brain song" --lang en --mods "review,price,does it work"

Sem API key. Usa o endpoint publico de sugestoes do Google (suggestqueries).
Respeite os limites: o script dorme 0.4s entre chamadas. Uso pessoal / pesquisa.

Saida: CSV com colunas termo, origem, classe_sugerida
"""
import argparse
import csv
import json
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"

MODS_EN = [
    "", " review", " reviews", " price", " buy", " official", " legit", " results",
    " complaints", " vs", " alternative", " does it work", " side effects", " discount",
    " for seniors", " amazon", " reddit", " before and after", " how to use",
]
MODS_PT = [
    "", " funciona", " é bom", " preço", " comprar", " oficial", " reclame aqui",
    " resultados", " é golpe", " vs", " alternativa", " como usar", " efeitos colaterais",
]

NEGATIVOS = {"free", "gratis", "grátis", "pdf", "torrent", "download", "job", "vagas",
             "scam", "golpe", "fake", "lawsuit", "processo", "cheap", "barato"}
TRANSACIONAL = {"buy", "comprar", "price", "preço", "official", "oficial", "discount",
                "desconto", "order", "onde comprar", "coupon"}
COMPARATIVO = {"review", "reviews", "vs", "alternative", "alternativa", "legit", "funciona",
               "complaints", "reclame", "é bom", "results", "resultados", "comparison"}


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return s.lower()


def suggest(query: str, lang: str) -> list:
    url = "https://suggestqueries.google.com/complete/search?client=firefox&hl=%s&q=%s" % (
        urllib.parse.quote(lang), urllib.parse.quote(query))
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8", "ignore"))
        return [t for t in data[1] if isinstance(t, str)]
    except Exception as e:  # noqa: BLE001
        print("  ! falha em '%s': %s" % (query, e), file=sys.stderr)
        return []


def classify(term: str) -> str:
    t = slug(term)
    words = set(t.replace("-", " ").split())
    if words & NEGATIVOS:
        return "negativo"
    if words & TRANSACIONAL:
        return "transacional"
    if words & COMPARATIVO:
        return "comparativo"
    if any(t.startswith(p) for p in ("how", "what", "why", "is ", "does", "quando", "como", "o que")):
        return "informacional"
    return "exploratorio"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", required=True, help="produto ou tema (ex: 'brain song')")
    ap.add_argument("--lang", default="en", choices=["en", "pt", "es"])
    ap.add_argument("--mods", default="", help="modificadores separados por virgula (opcional)")
    ap.add_argument("--out", default="termos.csv")
    ap.add_argument("--extra-seeds", default="", help="outras sementes separadas por virgula")
    args = ap.parse_args()

    mods = [m.strip() for m in args.mods.split(",")] if args.mods else (
        MODS_EN if args.lang == "en" else MODS_PT)
    seeds = [args.seed] + [s.strip() for s in args.extra_seeds.split(",") if s.strip()]

    queries = []
    for s in seeds:
        queries.append(s)
        for m in mods:
            queries.append((s + m).strip())

    print("Coletando %d consultas base (%s)..." % (len(queries), args.lang))
    found = {}
    for i, q in enumerate(queries, 1):
        for term in suggest(q, args.lang):
            term = term.strip().lower()
            if not term or term in found:
                continue
            found[term] = q
        if i % 15 == 0:
            print("  ... %d/%d" % (i, len(queries)))
        time.sleep(0.4)

    rows = [{"termo": t, "origem": found[t], "classe_sugerida": classify(t)} for t in sorted(found)]

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["termo", "origem", "classe_sugerida"])
        w.writeheader()
        w.writerows(rows)

    acionaveis = [r for r in rows if r["classe_sugerida"] in ("transacional", "comparativo")]
    print("\n%d termos coletados -> %s" % (len(rows), args.out))
    print("%d acionaveis (transacional/comparativo)" % len(acionaveis))
    print("negativos sugeridos:", ", ".join(r["termo"] for r in rows if r["classe_sugerida"] == "negativo")[:400] or "-")
    print("\nProximos passos:")
    print("  1) abra o CSV e marque os termos de intencao real")
    print("  2) cole 15-30 no Google Ads > Publicos > Segmentos personalizados")
    print("  3) jogue os 'negativo' na lista de palavras-chave negativas")
    print("  4) rode tools/cluster_intent.py para agrupar por tema")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""
cluster_intent.py — agrupa search terms em clusters de intencao usando embeddings locais
(sentence-transformers/all-MiniLM-L6-v2) + KMeans. Sem API paga.

Uso:
    pip install sentence-transformers scikit-learn pandas
    python tools/cluster_intent.py termos.csv --text-col termo --clusters 8

Entrada: CSV com uma coluna de termos (padrao: 'termo').
Saida:   CSV com cluster_id + termo + distancia ao centroide, ordenado por cluster.

Por que isso importa: no Google Ads voce precisa de 1 grupo de anuncios por ANGULO/
intencao, nao 1 grupo com 300 termos misturados. Clusterizar transforma uma lista
baguncada em 6-10 grupos coerentes.
"""
import argparse
import sys

try:
    import pandas as pd
except ImportError:
    print("falta pandas: pip install pandas", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--text-col", default="termo")
    ap.add_argument("--clusters", type=int, default=8)
    ap.add_argument("--out", default="clusters.csv")
    ap.add_argument("--model", default="sentence-transformers/all-MiniLM-L6-v2")
    args = ap.parse_args()

    try:
        from sentence_transformers import SentenceTransformer
        from sklearn.cluster import KMeans
    except ImportError:
        print("faltam libs: pip install sentence-transformers scikit-learn", file=sys.stderr)
        return 1

    df = pd.read_csv(args.csv)
    if args.text_col not in df.columns:
        print("coluna '%s' nao encontrada. colunas: %s" % (args.text_col, list(df.columns)), file=sys.stderr)
        return 1
    texts = df[args.text_col].dropna().astype(str).tolist()
    if len(texts) < args.clusters:
        args.clusters = max(2, len(texts) // 2)

    print("carregando modelo %s ..." % args.model)
    model = SentenceTransformer(args.model)
    print("gerando embeddings de %d termos ..." % len(texts))
    emb = model.encode(texts, show_progress_bar=True, normalize_embeddings=True)

    km = KMeans(n_clusters=args.clusters, random_state=42, n_init=10)
    labels = km.fit_predict(emb)
    dist = km.transform(emb).min(axis=1)

    df = df.loc[df[args.text_col].notna()].copy()
    df["cluster"] = labels
    df["dist_centroide"] = dist.round(4)
    df = df.sort_values(["cluster", "dist_centroide"])

    df.to_csv(args.out, index=False)
    print("\nclusters gerados -> %s" % args.out)
    for c in sorted(df["cluster"].unique()):
        group = df[df["cluster"] == c][args.text_col].head(6).tolist()
        print("  C%-2d (%3d termos): %s" % (c, (df["cluster"] == c).sum(), ", ".join(group)))
    print("\nUse cada cluster como um grupo de anuncios / um angulo de presell.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

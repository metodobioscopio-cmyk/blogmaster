#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Growth Design Pro — cliente do AI Growth Stack em Python
========================================================

Encadeia as 6 APIs do stack com retry exponencial, cache em disco e parada
explícita em caso de falha. Sem dependências externas: só a biblioteca padrão
(urllib, json, argparse), para rodar em qualquer máquina sem `pip install`.

ANTES DE USAR — leia isto:
1. Hosts e caminhos abaixo são PLACEHOLDERS. Copie os valores reais na aba
   "Endpoints" de cada API, no painel do RapidAPI. Eles mudam sem aviso.
2. Os nomes dos parâmetros variam por API (url, websiteUrl, target…). Confirme
   no painel e ajuste `montar_corpo`.
3. A chave nunca vai no código: use a variável de ambiente RAPIDAPI_KEY.

Uso:
    export RAPIDAPI_KEY=sua_chave
    python3 growth_stack.py https://exemplo.com.br

Saída: ./dados/01-extracao.json … 06-social.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# CONFIGURAÇÃO
# ---------------------------------------------------------------------------

HOST_PADRAO = "COLE-AQUI-O-HOST.rapidapi.com"  # ex.: exemplo.p.rapidapi.com

TIMEOUT_S = 30
TENTATIVAS = 3
ESPERA_BASE_S = 0.8
DIR_SAIDA = Path.cwd() / "dados"
USAR_CACHE = True
VALIDADE_CACHE_HORAS = 24


def resumir(dado, limite: int = 3000) -> str | None:
    """Encurta a saída de uma etapa antes de usá-la como entrada da seguinte.

    Mandar o JSON inteiro estoura o limite da API e encarece a chamada sem
    melhorar a resposta. Mantenha os resumos curtos.
    """
    if dado is None:
        return None
    texto = dado if isinstance(dado, str) else json.dumps(dado, ensure_ascii=False)
    return texto[:limite] + "…" if len(texto) > limite else texto


# Ordem obrigatória do funil: as etapas 3 e 6 dependem das anteriores.
ETAPAS = [
    {
        "id": "01-extracao",
        "nome": "Website Data Extraction",
        "caminho": "/extract",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {"url": ctx["url"]},
    },
    {
        "id": "02-seo",
        "nome": "AI SEO Analysis",
        "caminho": "/seo/analyze",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {"url": ctx["url"]},
    },
    {
        "id": "03-copy",
        "nome": "AI Website Copywriter",
        "caminho": "/copy/generate",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {
            "url": ctx["url"],
            "seo": resumir(ctx["resultados"].get("02-seo")),
            "contexto": resumir(ctx["resultados"].get("01-extracao")),
        },
    },
    {
        "id": "04-landing",
        "nome": "AI Landing Page Optimizer",
        "caminho": "/landing/optimize",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {
            "url": ctx["url"],
            "copy": ctx["resultados"].get("03-copy"),
        },
    },
    {
        "id": "05-conversao",
        "nome": "AI Conversion Optimization",
        "caminho": "/conversion/analyze",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {"url": ctx["url"]},
    },
    {
        "id": "06-social",
        "nome": "AI Social Media Generator",
        "caminho": "/social/generate",
        "metodo": "POST",
        "montar_corpo": lambda ctx: {
            "url": ctx["url"],
            "copy": resumir(ctx["resultados"].get("03-copy")),
            "landing": resumir(ctx["resultados"].get("04-landing")),
            "plataformas": ["twitter", "facebook", "instagram", "linkedin"],
        },
    },
]


# ---------------------------------------------------------------------------
# ERROS
# ---------------------------------------------------------------------------

class ErroDeAPI(Exception):
    def __init__(self, etapa: str, status: int, corpo: str):
        super().__init__(f"[{etapa}] HTTP {status}: {corpo[:300]}")
        self.etapa = etapa
        self.status = status
        self.corpo = corpo

    @property
    def recuperavel(self) -> bool:
        # 429 = cota estourada; 5xx = instabilidade do fornecedor.
        return self.status == 429 or self.status >= 500


# ---------------------------------------------------------------------------
# CACHE
# ---------------------------------------------------------------------------

def caminho_arquivo(etapa_id: str) -> Path:
    return DIR_SAIDA / f"{etapa_id}.json"


def ler_cache(etapa_id: str):
    if not USAR_CACHE:
        return None
    caminho = caminho_arquivo(etapa_id)
    if not caminho.exists():
        return None
    try:
        dados = json.loads(caminho.read_text(encoding="utf-8"))
        coletado = datetime.fromisoformat(dados["_meta"]["coletadoEm"])
        idade_h = (datetime.now(timezone.utc) - coletado).total_seconds() / 3600
        return dados["saida"] if idade_h <= VALIDADE_CACHE_HORAS else None
    except (json.JSONDecodeError, KeyError, ValueError):
        return None


def gravar(etapa_id: str, entrada, saida) -> None:
    DIR_SAIDA.mkdir(parents=True, exist_ok=True)
    registro = {
        "_meta": {
            "etapa": etapa_id,
            "coletadoEm": datetime.now(timezone.utc).isoformat(),
            "custoEstimado": "confira o preço do seu plano no RapidAPI",
        },
        "entrada": entrada,
        "saida": saida,
    }
    caminho_arquivo(etapa_id).write_text(
        json.dumps(registro, ensure_ascii=False, indent=2), encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# CHAMADA
# ---------------------------------------------------------------------------

def chamar_etapa(etapa: dict, corpo: dict, chave: str) -> dict:
    url = f"https://{HOST_PADRAO}{etapa['caminho']}"
    dados_bytes = json.dumps(corpo, ensure_ascii=False).encode("utf-8")

    requisicao = urllib.request.Request(
        url,
        data=None if etapa["metodo"] == "GET" else dados_bytes,
        method=etapa["metodo"],
        headers={
            "Content-Type": "application/json",
            "X-RapidAPI-Key": chave,
            "X-RapidAPI-Host": HOST_PADRAO,
        },
    )

    ultimo_erro: Exception | None = None

    for tentativa in range(1, TENTATIVAS + 1):
        try:
            with urllib.request.urlopen(requisicao, timeout=TIMEOUT_S) as resposta:
                bruto = resposta.read().decode("utf-8", errors="replace")
                try:
                    return json.loads(bruto)
                except json.JSONDecodeError:
                    # Algumas APIs de IA devolvem texto puro ou JSON com campo escapado.
                    return {"texto": bruto}

        except urllib.error.HTTPError as erro:
            corpo_erro = erro.read().decode("utf-8", errors="replace")
            erro_api = ErroDeAPI(etapa["id"], erro.code, corpo_erro)
            ultimo_erro = erro_api
            if not erro_api.recuperavel or tentativa == TENTATIVAS:
                break

        except (urllib.error.URLError, TimeoutError) as erro:
            ultimo_erro = erro
            if tentativa == TENTATIVAS:
                break

        espera = ESPERA_BASE_S * (2 ** (tentativa - 1))
        print(f"    ↻ tentativa {tentativa} falhou; repetindo em {espera:.1f}s")
        time.sleep(espera)

    raise ultimo_erro if ultimo_erro else RuntimeError("falha desconhecida")


# ---------------------------------------------------------------------------
# PIPELINE
# ---------------------------------------------------------------------------

def executar_funil(url: str, chave: str) -> int:
    print("\nGrowth Design Pro — funil completo")
    print(f"URL: {url}\n")

    ctx = {"url": url, "resultados": {}}
    relatorio: list[dict] = []

    for etapa in ETAPAS:
        print(f"  {etapa['id']}  {etapa['nome']} … ", end="", flush=True)
        inicio = time.time()

        em_cache = ler_cache(etapa["id"])
        if em_cache is not None:
            ctx["resultados"][etapa["id"]] = em_cache
            relatorio.append({"etapa": etapa["id"], "origem": "cache", "ms": 0})
            print("cache")
            continue

        corpo = etapa["montar_corpo"](ctx)

        try:
            dados = chamar_etapa(etapa, corpo, chave)
        except ErroDeAPI as erro:
            print("falhou")
            print(f"\nPipeline interrompido na etapa {etapa['id']} ({etapa['nome']}).")
            print(f"  Motivo: {erro}")
            if erro.status == 429:
                print("  → Cota do plano estourada. Verifique o limite no painel do RapidAPI.")
            elif erro.status == 403:
                print("  → Sem acesso ao endpoint: confira se assinou o plano correto.")
            elif erro.status == 404:
                print("  → Endpoint ou parâmetro mudou. Confira a documentação atual.")
            print("\n  O pipeline parou de propósito: seguir com dado vazio produziria")
            print("  uma análise falsa, pior do que nenhuma análise.\n")
            _relatorio(relatorio)
            return 2
        except Exception as erro:  # noqa: BLE001 — queremos a causa real na tela
            print("falhou")
            print(f"\nErro inesperado na etapa {etapa['id']}: {erro}\n")
            _relatorio(relatorio)
            return 1

        ctx["resultados"][etapa["id"]] = dados
        gravar(etapa["id"], corpo, dados)
        relatorio.append({"etapa": etapa["id"], "origem": "api", "ms": int((time.time() - inicio) * 1000)})
        print("ok")

    _relatorio(relatorio)
    print(f"\n  Arquivos em {DIR_SAIDA}\n")
    return 0


def _relatorio(relatorio: list[dict]) -> None:
    print(f"\n  {'ETAPA':<16}{'ORIGEM':<10}TEMPO")
    for linha in relatorio:
        tempo = f"{linha['ms']/1000:.1f}s" if linha["ms"] else "—"
        print(f"  {linha['etapa']:<16}{linha['origem']:<10}{tempo}")


# ---------------------------------------------------------------------------
# ENTRADA
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Roda o funil completo do AI Growth Stack em uma URL."
    )
    parser.add_argument("url", help="URL da página a analisar (com https://)")
    parser.add_argument("--sem-cache", action="store_true", help="ignora o cache e refaz todas as chamadas")
    argumentos = parser.parse_args()

    global USAR_CACHE
    if argumentos.sem_cache:
        USAR_CACHE = False

    partes = urllib.parse.urlparse(argumentos.url)
    if partes.scheme not in ("http", "https") or not partes.netloc:
        print(f"URL inválida: {argumentos.url}", file=sys.stderr)
        return 1

    chave = os.environ.get("RAPIDAPI_KEY")
    if not chave:
        print("RAPIDAPI_KEY não definida.", file=sys.stderr)
        print("  export RAPIDAPI_KEY=sua_chave", file=sys.stderr)
        return 1

    return executar_funil(argumentos.url, chave)


if __name__ == "__main__":
    sys.exit(main())

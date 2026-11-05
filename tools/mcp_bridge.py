#!/usr/bin/env python3
"""
mcp_bridge.py — bridge local do Copiloto de Afiliados.

Por que isso existe (e nao um fetch direto do navegador):
  1. CORS      — api.adspirer.ai e o MCP do Rally nao liberam origem desconhecida.
  2. SEGURANCA — o token sk_live_ nunca fica na pagina. Fica em variavel de ambiente
                 do processo ou no arquivo .env local (nunca no git, nunca no frontend).
  3. PROTOCOLO — o Rally MCP so fala MCP (JSON-RPC sobre STDIO). Navegador nao fala isso.

Como rodar:
    export ADSPIRER_TOKEN=sk_live_...
    export ML_AFFILIATE_ID=...   SHOPEE_APP_ID=...   SHOPEE_SECRET=...
    python3 tools/mcp_bridge.py --port 8791

Depois, no Copiloto: aba Integracoes > campo "Bridge local" > http://127.0.0.1:8791

Endpoints:
    GET  /health                     -> status do bridge, do token e dos sinais
    GET  /signals                    -> proxy de ProdIntel /api/signals (cache 15 min)
    GET  /reputation?domain=x.com    -> proxy de ProdIntel /api/reputation
    POST /ads/<tool>                 -> proxy autenticado para Adspirer REST
    POST /rally/<tool>               -> chama uma tool do Rally MCP via JSON-RPC (STDIO)

Sem dependencias externas: so stdlib. Python 3.8+.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ADSPIRER_API = "https://api.adspirer.ai/api/v1/tools/{tool}/execute"
PRODINTEL = "https://prodintel-two.vercel.app"
ALLOWED_ORIGINS = "*"  # bridge e local; ajuste para o seu dominio em producao

_cache: dict[str, tuple[float, bytes, int]] = {}
_cache_lock = threading.Lock()


def env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def http_json(url: str, payload: dict | None = None, headers: dict | None = None,
              timeout: int = 30) -> tuple[int, bytes]:
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "BlogMaster-Copiloto/1.0")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:  # noqa: BLE001
        return 599, json.dumps({"error": "network", "detail": str(e)}).encode()


# --------------------------------------------------------------------------
# Rally MCP via JSON-RPC sobre STDIO
# --------------------------------------------------------------------------
class RallyClient:
    """Cliente MCP minimo: initialize -> tools/list -> tools/call."""

    def __init__(self) -> None:
        self.proc: subprocess.Popen | None = None
        self.next_id = 0
        self.lock = threading.Lock()

    def _ensure(self) -> subprocess.Popen:
        if self.proc and self.proc.poll() is None:
            return self.proc
        cmd = ["npx", "-y", "@andrehocsis/rally-mcp-server"]
        e = os.environ.copy()
        self.proc = subprocess.Popen(
            cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL, text=True, bufsize=1, env=e,
        )
        self._rpc("initialize", {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "blogmaster-copiloto", "version": "1.0"},
        }, raw=True)
        return self.proc

    def _rpc(self, method: str, params: dict, raw: bool = False) -> dict:
        p = self._ensure() if hasattr(self, "proc") and self.proc is None else self.proc
        assert p and p.stdin and p.stdout
        with self.lock:
            self.next_id += 1
            msg = {"jsonrpc": "2.0", "id": self.next_id, "method": method, "params": params}
            p.stdin.write(json.dumps(msg) + "\n")
            p.stdin.flush()
            deadline = time.time() + 45
            while time.time() < deadline:
                line = p.stdout.readline()
                if not line:
                    break
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if obj.get("id") == self.next_id:
                    return obj
            return {"error": {"message": "timeout aguardando resposta do Rally MCP"}}

    def call(self, tool: str, args: dict) -> dict:
        return self._rpc("tools/call", {"name": tool, "arguments": args})

    def list_tools(self) -> dict:
        return self._rpc("tools/list", {})


rally = RallyClient()


# --------------------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    server_version = "BlogMasterBridge/1.0"

    def log_message(self, fmt, *a):  # log curto
        print("  %s %s" % (self.command, self.path))

    # ---------------- helpers ----------------
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGINS)
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def _send(self, status: int, body: bytes, ctype: str = "application/json") -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        try:
            self.wfile.write(body)
        except BrokenPipeError:
            pass

    def _json(self, status: int, obj) -> None:
        self._send(status, json.dumps(obj, ensure_ascii=False).encode())

    def _body(self) -> dict:
        n = int(self.headers.get("Content-Length") or 0)
        if not n:
            return {}
        try:
            return json.loads(self.rfile.read(n).decode() or "{}")
        except json.JSONDecodeError:
            return {}

    # ---------------- routes ----------------
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(u.query)

        if u.path == "/health":
            token = env("ADSPIRER_TOKEN")
            self._json(200, {
                "bridge": "ok",
                "version": "1.0",
                "ads_token": "configurado" if token else "ausente",
                "rally_env": {
                    "ML_AFFILIATE_ID": bool(env("ML_AFFILIATE_ID")),
                    "SHOPEE_APP_ID": bool(env("SHOPEE_APP_ID")),
                    "SHOPEE_SECRET": bool(env("SHOPEE_SECRET")),
                },
                "hint": "defina ADSPIRER_TOKEN / ML_AFFILIATE_ID / SHOPEE_APP_ID / SHOPEE_SECRET no ambiente",
            })
            return

        if u.path == "/signals":
            self._proxy_cached(PRODINTEL + "/api/signals", 900)
            return

        if u.path == "/reputation":
            domain = (q.get("domain") or [""])[0] or (q.get("url") or [""])[0]
            if not domain:
                self._json(400, {"error": "informe ?domain= ou ?url="})
                return
            url = PRODINTEL + "/api/reputation?" + urllib.parse.urlencode(
                {"url" if domain.startswith("http") else "domain": domain})
            self._proxy_cached(url, 3600)
            return

        if u.path == "/rally/tools":
            self._json(200, rally.list_tools())
            return

        self._json(404, {"error": "rota desconhecida", "routes": ["/health", "/signals", "/reputation?domain=", "/rally/tools", "POST /ads/<tool>", "POST /rally/<tool>"]})

    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        parts = [p for p in u.path.split("/") if p]
        if len(parts) != 2 or parts[0] not in ("ads", "rally"):
            self._json(404, {"error": "use POST /ads/<tool> ou POST /rally/<tool>"})
            return
        kind, tool = parts
        body = self._body()

        if kind == "ads":
            token = env("ADSPIRER_TOKEN")
            if not token:
                self._json(401, {"error": "ADSPIRER_TOKEN ausente. Gere em https://adspirer.ai/keys e exporte no ambiente do bridge."})
                return
            status, raw = http_json(
                ADSPIRER_API.format(tool=urllib.parse.quote(tool)),
                payload=body,
                headers={"Authorization": "Bearer " + token},
            )
            self._send(status, raw)
            return

        # kind == "rally"
        self._json(200, rally.call(tool, body))

    # ---------------- proxy com cache ----------------
    def _proxy_cached(self, url: str, ttl: int) -> None:
        now = time.time()
        with _cache_lock:
            hit = _cache.get(url)
            if hit and now - hit[0] < ttl:
                self._send(hit[2], hit[1])
                return
        status, raw = http_json(url, timeout=25)
        if status == 200:
            with _cache_lock:
                _cache[url] = (now, raw, status)
        self._send(status, raw)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8791)
    ap.add_argument("--host", default="127.0.0.1",
                    help="127.0.0.1 (recomendado) ou 0.0.0.0 se precisar expor")
    args = ap.parse_args()

    print("Bridge do Copiloto — http://%s:%d" % (args.host, args.port))
    print("Token Adspirer: %s" % ("OK" if env("ADSPIRER_TOKEN") else "AUSENTE (rotas /ads vao falhar)"))
    print("Rally env: ML=%s SHOPEE_APP=%s SHOPEE_SECRET=%s" % (
        "ok" if env("ML_AFFILIATE_ID") else "-",
        "ok" if env("SHOPEE_APP_ID") else "-",
        "ok" if env("SHOPEE_SECRET") else "-"))
    print("Ctrl+C para parar.\n")

    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando.")
    finally:
        if rally.proc and rally.proc.poll() is None:
            rally.proc.terminate()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

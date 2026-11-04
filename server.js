/* BlogMaster CRM — servidor estático + API de conexão WhatsApp Oficial
   (Meta Cloud API). Sem dependências externas.

   Credenciais (ambiente, recomendado):
     WA_TOKEN              token permanente da Cloud API
     WA_PHONE_NUMBER_ID    ID do número no Meta for Developers
     WA_VERIFY_TOKEN       token do webhook (padrão: blogmaster-acelera-2026)
   Alternativa: o front pode enviar o token no header x-wa-token
   (guardado apenas no navegador do corretor).

   Endpoints:
     GET  /api/whatsapp/status?phoneNumberId=...   testa a conexão
     POST /api/whatsapp/send                       envia template/texto oficial
     GET  /api/whatsapp/webhook                    verificação da Meta
     POST /api/whatsapp/webhook                    recebe mensagens/status
     GET  /api/whatsapp/inbox                      últimos eventos recebidos
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const GRAPH = "https://graph.facebook.com/v21.0";
const VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN || "blogmaster-acelera-2026";
const inbox = []; // eventos do webhook (memória — últimos 200)

function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let dados = "";
    req.on("data", c => { dados += c; if (dados.length > 1024 * 1024) req.destroy(); });
    req.on("end", () => { try { resolve(dados ? JSON.parse(dados) : {}); } catch (e) { reject(new Error("JSON inválido no corpo")); } });
    req.on("error", reject);
  });
}
function credenciais(req, corpo = {}, query = {}) {
  const token = req.headers["x-wa-token"] || process.env.WA_TOKEN || process.env.WHATSAPP_TOKEN || "";
  const phoneNumberId = corpo.phoneNumberId || query.phoneNumberId || process.env.WA_PHONE_NUMBER_ID || "";
  return { token: String(token).trim(), phoneNumberId: String(phoneNumberId).trim() };
}
async function graph(token, endpoint, options = {}) {
  const r = await fetch(`${GRAPH}/${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const txt = await r.text();
  let obj; try { obj = JSON.parse(txt); } catch (e) { obj = { raw: txt }; }
  if (!r.ok) throw new Error(`Meta Graph ${r.status}: ${obj.error?.message || txt.slice(0, 300)}`);
  return obj;
}

async function apiWhatsapp(req, res, url) {
  const rota = url.pathname;
  try {
    if (rota === "/api/whatsapp/status") {
      const { token, phoneNumberId } = credenciais(req, {}, Object.fromEntries(url.searchParams));
      if (!token || !phoneNumberId) return json(res, 200, { configurado: false, conectado: false, dica: "Informe Phone Number ID e token (ou WA_TOKEN/WA_PHONE_NUMBER_ID no servidor)." });
      const info = await graph(token, `${phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`);
      return json(res, 200, { configurado: true, conectado: true, numero: info.display_phone_number, nomeVerificado: info.verified_name, qualidade: info.quality_rating });
    }
    if (rota === "/api/whatsapp/send" && req.method === "POST") {
      const corpo = await lerCorpo(req);
      const { token, phoneNumberId } = credenciais(req, corpo);
      if (!token || !phoneNumberId) return json(res, 400, { ok: false, erro: "API não configurada (token/Phone Number ID)." });
      const to = String(corpo.to || "").replace(/\D/g, "");
      if (!to) return json(res, 400, { ok: false, erro: "Destinatário (to) vazio." });
      let payload;
      if (corpo.templateName) {
        payload = { messaging_product: "whatsapp", to, type: "template", template: { name: corpo.templateName, language: { code: corpo.language || "pt_BR" } } };
        if (Array.isArray(corpo.bodyParams) && corpo.bodyParams.length) {
          payload.template.components = [{ type: "body", parameters: corpo.bodyParams.map(v => ({ type: "text", text: String(v) })) }];
        }
      } else if (corpo.text) {
        payload = { messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { body: String(corpo.text), preview_url: false } };
      } else return json(res, 400, { ok: false, erro: "Informe templateName (oficial) ou text (janela de 24h)." });
      const r = await graph(token, `${phoneNumberId}/messages`, { method: "POST", body: JSON.stringify(payload) });
      return json(res, 200, { ok: true, messageId: r.messages?.[0]?.id || null, para: to });
    }
    if (rota === "/api/whatsapp/webhook") {
      if (req.method === "GET") {
        const mode = url.searchParams.get("hub.mode"), tok = url.searchParams.get("hub.verify_token"), ch = url.searchParams.get("hub.challenge");
        if (mode === "subscribe" && tok === VERIFY_TOKEN) { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end(ch || ""); }
        res.writeHead(403); return res.end("verify token inválido");
      }
      if (req.method === "POST") {
        const corpo = await lerCorpo(req).catch(() => ({}));
        inbox.unshift({ quando: new Date().toISOString(), evento: corpo });
        if (inbox.length > 200) inbox.length = 200;
        res.writeHead(200); return res.end("EVENT_RECEIVED");
      }
    }
    if (rota === "/api/whatsapp/inbox") return json(res, 200, { total: inbox.length, eventos: inbox.slice(0, 50) });
    if (rota === "/api/whatsapp/webhook-info") return json(res, 200, { verifyToken: VERIFY_TOKEN });
    return json(res, 404, { ok: false, erro: "Rota de API não encontrada." });
  } catch (e) {
    return json(res, 502, { ok: false, conectado: false, erro: String(e.message || e) });
  }
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (url.pathname.startsWith("/api/whatsapp/")) return apiWhatsapp(req, res, url);
    let urlPath = decodeURIComponent(url.pathname);
    if (urlPath === "/") urlPath = "/index.html";
    const file = path.join(ROOT, urlPath);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("404 — arquivo não encontrado"); }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(data);
    });
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(PORT, "0.0.0.0", () => console.log(`BlogMaster CRM rodando em http://0.0.0.0:${PORT} (API WhatsApp em /api/whatsapp/*)`));

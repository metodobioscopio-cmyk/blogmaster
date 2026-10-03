#!/usr/bin/env node
/* =========================================================================
   servir.js — servidor estático simples para o app (sem dependências)
   Uso: node scripts/servir.js  [porta]
   Abre em: http://localhost:8080
   ========================================================================= */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = parseInt(process.argv[2] || process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIR = path.join(__dirname, '..', 'app');

const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const servidor = http.createServer((req, res) => {
  let caminho = decodeURIComponent(req.url.split('?')[0]);
  if (caminho === '/' || caminho === '') caminho = '/index.html';

  // impede path traversal
  const alvo = path.normalize(path.join(DIR, caminho));
  if (!alvo.startsWith(DIR)) {
    res.writeHead(403).end('403');
    return;
  }

  fs.readFile(alvo, (erro, dados) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — não encontrado: ' + caminho);
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIMES[path.extname(alvo).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(dados);
  });
});

servidor.listen(PORTA, HOST, () => {
  console.log('📌 PinMind rodando em http://localhost:' + PORTA);
  console.log('   Servindo: ' + DIR);
  console.log('   (Ctrl+C para parar)');
});

const assert = require("assert");
const { parseTextoParaLeads, parseMoeda } = require("../js/parser.js");

const ficha = ` PRECISO DE UM CONTATO INICIAL COM MEU NOME E FALANDO QUE MRV É A MAIOR CONSTRUTORA DA AMERICA LATINA sé Fernando Ribeiro Matos

📞 Contato: 62991074310

💰 Dados Financeiros:
    Renda Mensal: R$ 5.000,00
    FGTS: não informou
    Entrada disponível: R$ 5.000,00

📍 Região de Interesse:
    Empreendimento: Gran Verona
    Cidade de interesse inicial: não informado
    Bairro de interesse inicial: Papillon Park

---

Classificação: em amadurecimento. Está buscando comprar sozinho.`;

const leads = parseTextoParaLeads(ficha);
assert(leads.length >= 1, "deve encontrar ao menos 1 lead");
const j = leads.find(l => l.telefone === "62991074310");
assert(j, "José Fernando (62991074310) deve ser extraído");
assert.strictEqual(j.renda, 5000);
assert.strictEqual(j.entrada, 5000);
assert.strictEqual(j.empreendimento, "Gran Verona");
assert(/Papillon/i.test(j.bairro), "bairro Papillon Park");
console.log("✔ ficha José Fernando:", j.nome || "(nome via fallback)", j.telefone, j.renda, j.entrada, j.empreendimento, j.bairro);

const csv = "nome;telefone;renda;entrada;empreendimento;bairro\nMaria Silva;62988887777;4200;10000;Gran Safira;Parque Atheneu\nJoão Souza;(62) 97777-6666;3000;;Vert;Parque Amazônia";
const lcsv = parseTextoParaLeads(csv);
assert.strictEqual(lcsv.length, 2);
assert.strictEqual(lcsv[0].nome, "Maria Silva");
assert.strictEqual(lcsv[1].telefone, "62977776666");
console.log("✔ CSV:", lcsv.length, "leads");

const linhas = "Ana Paula - 62 96666-5555\nCarlos Dias - 62955554444";
const ll = parseTextoParaLeads(linhas);
assert.strictEqual(ll.length, 2);
console.log("✔ 1 por linha:", ll.map(x => x.telefone).join(", "));

assert.strictEqual(parseMoeda("R$ 5.000,00"), 5000);
assert.strictEqual(parseTextoParaLeads("").length, 0);
console.log("✅ parser.test.js OK");

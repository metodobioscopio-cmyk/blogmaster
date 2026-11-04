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

// formato do box de importação (onboarding): "Nome - Tel - renda 5000 - ..."
const box = "José Fernando Ribeiro Matos - (62) 99107-4310 - renda 5000 - entrada 5000 - Gran Verona - Papillon Park\nMaryana - 62 98888-1111 - renda 3200 - Aparecida de Goiânia";
const lbox = parseTextoParaLeads(box);
assert.strictEqual(lbox.length, 2);
assert.strictEqual(lbox[0].nome, "José Fernando Ribeiro Matos");
assert.strictEqual(lbox[0].renda, 5000); assert.strictEqual(lbox[0].entrada, 5000);
assert.strictEqual(lbox[0].bairro, "Papillon Park");
assert.strictEqual(lbox[1].nome, "Maryana"); assert.strictEqual(lbox[1].cidade, "Aparecida de Goiânia");
console.log("✔ formato box onboarding:", lbox.map(x => x.nome).join(" + "));

// lista corrida (sem quebras): "Nome Tel Nome2 Tel2 ..." — formato real do corretor
const corrida = "Ketuly 62990001001 MURILO HENRIQUE DIAS DOS SANTOS 62990001002 luiz 62990001003 Larissa dos Reis e silva 62990001004 Nome não informado 62990001005 David Reithon Muniz 5562990001006 Fê 12990001007 maryana barbosa 62990001008";
const lc = parseTextoParaLeads(corrida);
assert.strictEqual(lc.length, 8, "8 leads na lista corrida");
assert.strictEqual(lc[0].nome, "Ketuly"); assert.strictEqual(lc[0].telefone, "62990001001");
assert.strictEqual(lc[1].nome, "Murilo Henrique Dias dos Santos");
assert.strictEqual(lc[2].nome, "Luiz");
assert.strictEqual(lc[3].nome, "Larissa dos Reis e Silva");
assert.strictEqual(lc[4].nome, ""); assert.strictEqual(lc[4].telefone, "62990001005"); // "Nome não informado" mantém só o telefone
assert.strictEqual(lc[5].telefone, "62990001006"); // prefixo 55 removido
assert.strictEqual(lc[6].nome, "Fê"); assert.strictEqual(lc[6].telefone, "12990001007");
assert.strictEqual(lc[7].nome, "Maryana Barbosa");
console.log("✔ lista corrida:", lc.length, "leads separados nome/telefone");

// 1 por linha sem traço: "Nome 62999998888"
const junto = parseTextoParaLeads("Ketuly 62990002001\nMurilo Sousa 62990002002");
assert.strictEqual(junto.length, 2);
assert.strictEqual(junto[0].nome, "Ketuly");
console.log("✔ nome+telefone por linha sem traço");

assert.strictEqual(parseMoeda("R$ 5.000,00"), 5000);
assert.strictEqual(parseTextoParaLeads("").length, 0);
console.log("✅ parser.test.js OK");

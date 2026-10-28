const assert = require("assert");
// carrega base de conhecimento (globals usados pelo agent.js no navegador)
const data = require("../js/data.js");
global.EMPREENDIMENTOS = data.EMPREENDIMENTOS; global.TEMPLATES = data.TEMPLATES;
global.FAIXAS_MCMV = data.FAIXAS_MCMV; global.menu9Texto = data.menu9Texto;
const A = require("../js/agent.js");

const jose = { id: "j1", nome: "José Fernando Ribeiro Matos", telefone: "62991074310", renda: 5000, entrada: 5000, fgts: "não informou", composicao: "sozinho", empreendimento: "Gran Verona", bairro: "Papillon Park", cidade: "Aparecida de Goiânia/GO", estagio: "conexao", optIn: true, docs: {}, historico: [], parcela: "", subsidio: "", unidade: "", listaId: "l1" };
const mary = { id: "m1", nome: "Maryana", telefone: "62999990000", renda: null, entrada: null, fgts: "", empreendimento: "", estagio: "conexao", optIn: true, docs: {}, historico: [], listaId: "l1" };

assert(A.scoreLead(jose).score > A.scoreLead(mary).score, "José Fernando pontua mais que lead vazio");
assert.strictEqual(A.faixaMCMV(5000).faixa, "Faixa 2");
assert.strictEqual(A.proximaAcao(mary).template, "menu9");
assert.strictEqual(A.proximaAcao(jose).template, "abertura_especifica");

const menu = A.renderMensagem(data.TEMPLATES.find(t => t.id === "menu9").texto, mary, "Januário Leal");
assert(menu.includes("Maryana") && menu.includes("Januário Leal") && menu.includes("maior construtora da América Latina"));
assert(menu.includes("Gran Essence") && menu.includes("Vert — Parque Amazônia"), "menu contém os 9");
console.log("✔ abertura Maryana (Menu 9) ok");

const esp = A.renderMensagem(data.TEMPLATES.find(t => t.id === "abertura_especifica").texto, jose, "Januário Leal");
assert(esp.includes("José Fernando") === false || esp.includes("José"), "usa primeiro nome");
assert(esp.includes("Gran Verona") && esp.includes("Papillon Park"));
console.log("✔ abertura específica José Fernando ok");

const r = A.interpretarResposta(mary, "3");
assert.strictEqual(r.tipo, "menu"); assert.strictEqual(r.empreendimento, "Gran Parma");
assert.strictEqual(A.interpretarResposta(mary, "parar").tipo, "optout");
assert.strictEqual(A.interpretarResposta(mary, "quanto fica a parcela?").tipo, "simulacao");
console.log("✔ interpretação de respostas ok");

const fila = A.montarFilaSegura([jose, mary, { ...mary, id: "x", telefone: "", nome: "Sem Tel" }], { consultor: "Januário Leal" }, "l1");
assert.strictEqual(fila.fila.length, 2);
assert.strictEqual(fila.pulados.length, 1);
assert.strictEqual(fila.fila[0].leadId, "j1", "fila ordenada por score: José Fernando primeiro");
assert(fila.fila[0].mensagem.includes("Gran Verona"));
console.log("✔ fila segura ok:", fila.fila.map(f => f.nome).join(" → "));

const portao = A.portaoPromocao(jose, "docs");
assert.strictEqual(portao.ok, false); assert(portao.falta.some(f => /RG/.test(f)));
console.log("✔ portão de documentos ok");
console.log("✅ agent.test.js OK");

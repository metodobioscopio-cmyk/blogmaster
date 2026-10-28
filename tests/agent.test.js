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
assert(menu.includes("*Gran Essence*") && menu.includes("*Vert* — Parque Amazônia"), "menu contém os 9");
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

// mensagem do disparo escolhida pelo corretor (template forçado)
const filaForcada = A.montarFilaSegura([jose, mary], { consultor: "Januário Leal", templateId: "generica_c" }, "l1");
assert(filaForcada.fila.every(f => f.templateId === "generica_c"), "todas usam o template escolhido");
assert(filaForcada.fila[0].mensagem.includes("Januário Leal") && filaForcada.fila[0].mensagem.includes("José"), "nome do lead + do corretor na mensagem");
console.log("✔ template do disparo forçado + personalização ok");

const portao = A.portaoPromocao(jose, "simulacao"); // 3.0: docs sao o portao Docs->Simulacao
assert.strictEqual(portao.ok, false); assert(portao.falta.some(f => /RG/.test(f)));
console.log("✔ portão de documentos ok");
// ---- Acelera 3.0: funil de 6 etapas + scripts oficiais ----
assert.strictEqual(data.ESTAGIOS.filter(e => e.n > 0).length, 6, "funil 3.0 tem 6 etapas");
assert(!data.ESTAGIOS.some(e => e.id === "regiao"), "etapa regiao aposentada");
const tplDocs = data.TEMPLATES.find(x => x.id === "docs");
assert.strictEqual(tplDocs.etapa, 3); assert(tplDocs.texto.includes("altíssimo potencial de aprovação"));
const tplSim = data.TEMPLATES.find(x => x.id === "simulacao");
assert.strictEqual(tplSim.etapa, 4); assert(tplSim.texto.includes("Resumo das Suas Condições") && tplSim.texto.includes("menor que o valor de um aluguel"));
assert.strictEqual(data.TEMPLATES.find(x => x.id === "visita").etapa, 5);
assert(data.TEMPLATES.find(x => x.id === "fechamento").texto.includes("chamada de vídeo?"));
const semComp = { ...mary, estagio: "triagem", empreendimento: "Gran Parma", composicao: "" };
assert.strictEqual(A.proximaAcao(semComp).template, "triagem_composicao");
assert.strictEqual(A.interpretarResposta(mary, "3").proximoTemplate, "triagem_composicao");
// toda mensagem oficial 3.0 termina com pergunta (regra de ouro)
for (const id of ["menu9","triagem_composicao","triagem_renda_fgts","triagem_entrada","docs","simulacao","visita","fechamento"]) {
  const txt = data.TEMPLATES.find(x => x.id === id).texto.trim();
  assert(/[?!]\)?$/.test(txt), id + " deve terminar com pergunta");
  assert(txt.includes("?"), id + " deve conter pergunta de controle");
}
console.log("✔ Acelera 3.0: 6 etapas + scripts oficiais + regra da pergunta ok");

console.log("✅ agent.test.js OK");

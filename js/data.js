/* BlogMaster CRM — Base de conhecimento MRV / Método Acelera 3.0
   Conteúdo fornecido pelo consultor Januário Leal. Preços/prazos
   não informados ficam como "a confirmar" — nunca inventar condição. */

const CONSULTOR_PADRAO = "Januário Leal";
const ASSINATURA_MRV = "MRV — a maior construtora da América Latina";

/* Funil oficial Acelera 3.0 — 6 etapas (regiao e validada na Etapa 1,
   pela resposta ao Menu 1-9). Leads antigos "regiao" migram p/ triagem. */
const ESTAGIOS = [
  { id: "conexao",    n: 1, nome: "Primeiro Contato",   curto: "Novo / 1º contato",  acao: "Enviar script padronizado com os 9 empreendimentos", gatilho: "Lead responder com o número/região" },
  { id: "triagem",    n: 2, nome: "Triagem Financeira", curto: "Em atendimento",     acao: "Composição, renda, FGTS e entrada (dupla escolha)", gatilho: "Mapeamento completo dos dados financeiros" },
  { id: "docs",       n: 3, nome: "Coleta de Documentos", curto: "Análise de crédito", acao: "Enviar lista numerada de documentos p/ Caixa", gatilho: "Recebimento dos documentos legíveis" },
  { id: "simulacao",  n: 4, nome: "Simulação",          curto: "Proposta",           acao: "Apresentar aprovação destacando subsídio e parcela", gatilho: "Aprovação do cliente sobre os valores" },
  { id: "visita",     n: 5, nome: "Agendamento / Estande", curto: "Agendado",        acao: "Oferecer 2 opções de horário (fim de semana)", gatilho: "Confirmar data e horário da visita" },
  { id: "fechamento", n: 6, nome: "Fechamento",         curto: "Fechamento / Venda", acao: "Enviar link de reserva e assinatura digital", gatilho: "Contrato assinado e lead promovido a Venda" },
  { id: "perdido",    n: 0, nome: "Perdido / Opt-out",  curto: "Perdido",            acao: "Arquivar e respeitar opt-out", gatilho: "Pedido de parada ou sem retorno após cadência" },
];

/* Os 9 empreendimentos do menu oficial de abertura (ordem exata do consultor).
   + Gran Verona como ficha-modelo (lead José Fernando). */
const EMPREENDIMENTOS = [
  { num: 1, nome: "Gran Essence", cidade: "Aparecida de Goiânia", bairro: "Parque das Nações", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Região do Parque das Nações — Aparecida de Goiânia" },
  { num: 2, nome: "Gran Safira", cidade: "Aparecida de Goiânia", bairro: "Parque Atheneu", status: "Em construção", tipologia: "Aptos 42m² · 2 quartos | 45m² · 2 quartos + varanda", preco: "R$ 240 mil a R$ 285 mil", entrega: "2028",
    lazer: ["Churrasqueira", "Fitness externo", "Playgrounds", "Praças", "Bicicletário", "Piscina adulto e infantil", "Quadra", "Salão de festas"],
    destaques: "Vaga de garagem · Térreo + 9 andares",
    pontos: "Região do Parque Atheneu, próximo ao Colégio Militar CEPMG, Instituto San Damiano, PUC Goiás, Av. Engler e Hospital HECAD" },
  { num: 3, nome: "Gran Parma", cidade: "Aparecida de Goiânia", bairro: "Papillon Park", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Papillon Park — Aparecida de Goiânia" },
  { num: 4, nome: "Gran Terrazzo", cidade: "Goiânia", bairro: "Jardim Nova Esperança (Noroeste)", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Região Noroeste de Goiânia" },
  { num: 5, nome: "Golden Ville", cidade: "Goiânia", bairro: "Noroeste (atrás da Unialfa)", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Atrás da Unialfa — Região Noroeste" },
  { num: 6, nome: "Priville", cidade: "Goiânia", bairro: "Carolina Parque", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Carolina Parque — Goiânia" },
  { num: 7, nome: "Gran Aurora", cidade: "Goiânia", bairro: "Jardim Gardênia", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Jardim Gardênia — Goiânia" },
  { num: 8, nome: "Gran Porto", cidade: "Goiânia", bairro: "Jardim Novo Mundo", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Jardim Novo Mundo — Goiânia" },
  { num: 9, nome: "Vert", cidade: "Goiânia", bairro: "Parque Amazônia", status: "a confirmar", tipologia: "a confirmar", preco: "a confirmar", entrega: "a confirmar", lazer: [], destaques: "a confirmar", pontos: "Parque Amazônia — Goiânia" },
  { num: 10, nome: "Gran Verona", cidade: "Aparecida de Goiânia", bairro: "Papillon Park", status: "Em construção", tipologia: "Aptos 2 quartos (opção varanda ou área privativa)", preco: "A partir de R$ 240 mil (sujeito a alteração)", entrega: "2028",
    lazer: ["Espaço Gourmet / Churrasqueira", "Fitness", "Playground / Kids Room", "Praça / Área verde", "Piscina adulto e infantil", "Quadra gramada", "Salão de festas"],
    destaques: "Vaga de garagem · Torres modernas com elevador · Ficha-modelo (fora do menu 1–9)",
    pontos: "Região do Papillon Park, próximo ao Aparecida Shopping, UPA Brasicon, Parque da Criança e Av. Veiga Cabral" },
];

/* Faixas MCMV 2026 — estimativa para triagem (confirmar tabela Caixa vigente). */
const FAIXAS_MCMV = [
  { faixa: "Faixa 1", teto: 3200,  obs: "Maior subsídio · juros ~4%–4,5% a.a." },
  { faixa: "Faixa 2", teto: 5000,  obs: "Subsídio + juros reduzidos ~4,75%–6,5% a.a." },
  { faixa: "Faixa 3", teto: 9600,  obs: "Juros ~6,66%–7,66% a.a. · teto de imóvel ampliado" },
  { faixa: "Faixa 4", teto: Infinity, obs: "Classe média · confirmar teto de renda/imóvel vigente" },
];

const DOCS_CHECKLIST = [
  { id: "doc_id", label: "RG ou CNH (frente e verso)" },
  { id: "doc_end", label: "Comprovante de endereço atualizado" },
  { id: "doc_renda", label: "Comprovante de renda (3 contracheques/extratos)" },
  { id: "doc_fgts", label: "Extrato do FGTS (se for utilizar)" },
];

/* ---------- Templates de mensagem (Método Acelera 3.0) ----------
   Variáveis: {primeiroNome} {nome} {corretor} {empreendimento}
   {bairro} {cidade} {parcela} {subsidio} {unidade} {menu9}        */
const TEMPLATES = [
  {
    id: "menu9", etapa: 1, titulo: "⭐ Etapa 1 · Primeiro Contato Acelera 3.0 (Menu 1–9)",
    quando: "Lead sem empreendimento definido — ele responde só com o número",
    texto: `Olá, {primeiroNome}, tudo bem?

Sou o {corretor}, especialista de atendimento da MRV — a maior construtora da América Latina! 🏢✨

Posso te fazer uma pergunta rápida? Para eu te enviar os detalhes exatos e calcular as melhores condições para você, qual destas localizações você prefere?

{menu9}

Me responda apenas com o número da opção que mais te interessa!`
  },
  {
    id: "abertura_especifica", etapa: 1, titulo: "Abertura específica (empreendimento já conhecido)",
    quando: "Lead já demonstrou interesse num empreendimento (ex.: José Fernando / Gran Verona)",
    texto: `Olá, {primeiroNome}! Tudo bem?

Aqui é o {corretor}, especialista de atendimento da MRV — a maior construtora da América Latina! 🏢✨

Vi que você demonstrou interesse no {empreendimento}, no {bairro}. É uma excelente escolha de região e um empreendimento incrível!

Para que eu possa te apresentar as melhores condições e valores de parcela que caibam no seu bolso, posso te fazer 3 perguntas rápidas?`
  },
  {
    id: "saudacao_1", etapa: 1, titulo: "Saudação 1 · Direta e profissional",
    quando: "Saudação curta de conexão",
    texto: `Olá, {primeiroNome}! Tudo bem?

Aqui é o {corretor}, consultor de vendas da MRV — a maior construtora da América Latina! 🏢✨

Vi seu interesse no {empreendimento}, no {bairro}. Como posso te ajudar hoje?`
  },
  {
    id: "saudacao_2", etapa: 1, titulo: "Saudação 2 · Cordial e acolhedora",
    quando: "Saudação curta de conexão",
    texto: `Olá, {primeiroNome}, excelente dia!

Meu nome é {corretor} e falo em nome da MRV, a maior construtora da América Latina.

É um prazer conectar com você! Vi que você tem interesse no projeto do {empreendimento}. Como estão seus planos para essa conquista?`
  },
  {
    id: "saudacao_3", etapa: 1, titulo: "Saudação 3 · Objetiva e dinâmica",
    quando: "Saudação curta de conexão",
    texto: `Oi, {primeiroNome}! Tudo ótimo por aí?

Sou o {corretor}, especialista de atendimento da MRV, a maior construtora da América Latina.

Recebi sua mensagem sobre o {empreendimento} em {cidade} e estou à disposição para te apresentar todos os detalhes do empreendimento!`
  },
  {
    id: "generica_a", etapa: 1, titulo: "Genérica A · Agilidade e sondagem (recomendada)",
    quando: "Base fria/mista dos 9 empreendimentos",
    texto: `Olá, {primeiroNome}! Tudo bem?

Aqui é o {corretor}, especialista de atendimento da MRV — a maior construtora da América Latina! 🏢✨

Vi que você está em busca do seu novo imóvel e demonstrou interesse em nossas opções. Para que eu possa te enviar a opção ideal e calcular as menores parcelas para o seu perfil, me conta: você busca um apê para morar ou para investir?`
  },
  {
    id: "generica_b", etapa: 1, titulo: "Genérica B · Oportunidade e subsídio",
    quando: "Base fria/mista dos 9 empreendimentos",
    texto: `Olá, {primeiroNome}, excelente dia!

Meu nome é {corretor} e falo em nome da MRV, a maior construtora da América Latina.

Vi seu contato sobre os nossos empreendimentos! Temos excelentes condições de entrada facilitada e subsídios do Governo para esta região.

Para eu já separar as melhores unidades dentro do seu orçamento, você pretende fazer essa compra sozinho(a) ou vai compor renda com mais alguém?`
  },
  {
    id: "generica_c", etapa: 1, titulo: "Genérica C · Curta e direta",
    quando: "Base fria/mista dos 9 empreendimentos",
    texto: `Oi, {primeiroNome}! {corretor} por aqui, da MRV (a maior construtora da América Latina).

Recebi o seu interesse nos nossos lançamentos e quero te ajudar a conquistar o seu apê com as melhores condições do mercado!

Posso te fazer 3 perguntas rápidas para montar uma simulação sem compromisso?`
  },
  {
    id: "abordagem_simulacao", etapa: 2, titulo: "Abordagem 1 · Direta, foco simulação (recomendada)",
    quando: "Lead com renda/entrada já informadas — empurrar p/ simulação",
    texto: `Olá, {primeiroNome}! Tudo bem?

Aqui é o {corretor}, consultor de vendas da MRV — a maior construtora da América Latina! 🏢✨

Vi que você demonstrou interesse no {empreendimento}, no {bairro}. É uma excelente escolha de região e um empreendimento incrível!

Pelo que vi, você já tem os dados de renda e entrada definidos para darmos o próximo passo. Consegue falar agora para eu rodar uma simulação personalizada e te mostrar as melhores condições de financiamento para o seu perfil?`
  },
  {
    id: "abordagem_vizinhanca", etapa: 2, titulo: "Abordagem 2 · Experiência e vizinhança",
    quando: "Lead consultivo, valoriza localização",
    texto: `Olá, {primeiroNome}! Como vai?

Sou o {corretor}, especialista da MRV, a maior construtora da América Latina.

Recebi seu contato sobre o {empreendimento}, no bairro {bairro} em {cidade}. Além da estrutura do condomínio ser fantástica, a localização é excelente para quem busca praticidade no dia a dia.

Posso te enviar o material completo com fotos do projeto e agendarmos uma simulação rápida sem compromisso? 📲`
  },
  {
    id: "abordagem_acolhedora", etapa: 2, titulo: "Abordagem 3 · Curta e acolhedora",
    quando: "Lead morno — pedir melhor horário",
    texto: `Olá, {primeiroNome}, excelente dia!

Meu nome é {corretor} e falo em nome da MRV, a maior construtora da América Latina.

Vi que você está interessado no {empreendimento} ({bairro}) e quero te ajudar a realizar esse projeto! Já organizei os dados que você enviou de renda e entrada.

Qual o melhor horário para eu te enviar a simulação dos valores de parcela?`
  },
  {
    id: "triagem_composicao", etapa: 2, titulo: "Etapa 2.1 · Composição de renda (Acelera 3.0)",
    quando: "Logo após o lead escolher o número/região no Menu 1–9",
    texto: `{primeiroNome}, excelente escolha! O {empreendimento} é um dos projetos mais procurados da MRV, a maior construtora da América Latina.

Para eu estruturar uma proposta com o maior subsídio do Governo possível para você: você pretende comprar sozinho(a) ou vai compor renda com cônjuge, irmão ou familiar?`
  },
  {
    id: "triagem_renda_fgts", etapa: 2, titulo: "Etapa 2.2 · Renda bruta + FGTS (Acelera 3.0)",
    quando: "Depois da composição — mapear renda e direito ao FGTS",
    texto: `Perfeito! E qual é a renda bruta familiar aproximada hoje?

(Aproveitando: você possui mais de 3 anos de trabalho somados sob o regime CLT para usarmos o seu FGTS na entrada?)`
  },
  {
    id: "triagem_entrada", etapa: 2, titulo: "Etapa 2.3 · Recurso de entrada (Acelera 3.0)",
    quando: "Fechar a triagem financeira",
    texto: `Ótimo! Em relação ao valor inicial de entrada, quanto você teria disponível hoje em recursos próprios (dinheiro, PIX ou veículo) para abater nas parcelas?`
  },
  {
    id: "validacao_regiao", etapa: 1, titulo: "Complemento Etapa 1 · Desempate de região",
    quando: "Lead em dúvida entre 2 opções do Menu 1–9 (no Acelera 3.0 a região é validada na Etapa 1)",
    texto: `Analisando seu perfil, temos ótimas opções no Papillon Park e Parque Amazônia. Qual localização fica melhor para a sua rotina?`
  },
  {
    id: "docs", etapa: 3, titulo: "Etapa 3 · Coleta de documentação (Acelera 3.0)",
    quando: "Mover lead da curiosidade para análise de crédito Caixa (sem custo)",
    texto: `{primeiroNome}, analisando o seu perfil financeiro, você tem *altíssimo potencial de aprovação* com as condições facilitadas da MRV, a maior construtora da América Latina!

O próximo passo sem custo algum para você é rodar a sua análise oficial na Caixa para travar o seu subsídio e garantir a menor taxa de juros do ano.

Para dar entrada na aprovação, preciso que me envie por aqui as fotos (ou PDF) de:
1. *RG ou CNH* (frente e verso)
2. *Comprovante de Residência* (atualizado)
3. *Comprovante de Renda* (últimos 3 contracheques ou extratos)
4. *Extrato do FGTS* (caso vá utilizar)

Pode me enviar por aqui agora para eu dar prioridade no seu cadastro?`
  },
  {
    id: "simulacao", etapa: 4, titulo: "Etapa 4 · Simulação & ancoragem de valor (Acelera 3.0)",
    quando: "Ancorar valor: entrada facilitada + parcela + subsídio",
    texto: `Tenho excelentes notícias, {primeiroNome}! 🎉

A sua análise foi *pré-aprovada com sucesso* pela MRV! Conseguimos estruturar o seu financiamento com as melhores taxas do mercado.

📊 *Resumo das Suas Condições:*
• *Empreendimento:* {empreendimento}
• *Subsídio Liberado pelo Governo:* {subsidio}
• *Parcela do Financiamento:* {parcela} (menor que o valor de um aluguel!)
• *Entrada Facilitada MRV:* parcelada em condições especiais.

Ficou uma condição super confortável para o seu planejamento! Para alinharmos a escolha da sua unidade (andar/posição do sol), você prefere conversar hoje à tarde ou à noite?`
  },
  {
    id: "visita", etapa: 5, titulo: "Etapa 5 · Agendamento VIP no estande (Acelera 3.0)",
    quando: "Levar ao estande — pergunta de dupla escolha",
    texto: `{primeiroNome}, ver a simulação na tela é ótimo, mas ver de perto onde será a sua nova vida é inesquecível.

Estou separando um atendimento VIP no nosso estande da MRV (a maior construtora da América Latina) para tomarmos um café, conhecermos a maquete completa e escolhermos a sua unidade no mapa.

Para eu reservar a sua vaga na minha agenda: fica melhor para você no *sábado às 10h* ou no *domingo às 14h*?`
  },
  {
    id: "fechamento", etapa: 6, titulo: "Etapa 6 · Fechamento & assinatura digital (Acelera 3.0)",
    quando: "Crédito aprovado + unidade escolhida + condição cabe no orçamento",
    texto: `{primeiroNome}, sua aprovação está garantida, a parcela cabe perfeitamente no seu bolso e a unidade que escolhemos é a melhor do empreendimento.

Para evitarmos perda de tabela ou virada de lote de unidades da MRV, vou gerar o seu link de reserva e assinatura digital do contrato agora.

Posso enviar o link no seu WhatsApp ou prefere que eu te auxilie por chamada de vídeo?`
  },
  {
    id: "followup_d1", etapa: 0, titulo: "Follow-up D+1 · Sem resposta",
    quando: "Cadência Acelera — curto, uma pergunta só",
    texto: `Oi, {primeiroNome}! {corretor}, da MRV. Só confirmando se você viu minha mensagem sobre o {empreendimento}. Quer que eu te envie a simulação rapidinho, sem compromisso?`
  },
  {
    id: "followup_d3", etapa: 0, titulo: "Follow-up D+3 · Valor/prova",
    quando: "Enviar ficha do empreendimento + pergunta fechada",
    texto: `{primeiroNome}, separei a ficha completa do {empreendimento} ({bairro}) pra você 👇 Posso calcular a parcela no seu perfil de renda?`
  },
  {
    id: "followup_d7", etapa: 0, titulo: "Follow-up D+7 · Encerramento elegante",
    quando: "Última tentativa antes de arquivar (evita spam/ban)",
    texto: `{primeiroNome}, vou encerrar seu atendimento por aqui para não te incomodar, tudo bem? Se voltar a pensar no seu apê, é só me chamar que reativo suas condições na hora. — {corretor}, MRV`
  },
];

const MANUAL_ACELERA = {
  pilares: [
    "Identidade: {corretor} — Especialista/Consultor de Vendas MRV (em TODAS as abordagens e etapas).",
    "Ancoragem de marca: a MRV é a maior construtora da América Latina — segurança jurídica, liquidez, sólida garantia de entrega e condições facilitadas pelo Minha Casa Minha Vida (+500 mil chaves, +40 anos).",
    "Acompanhamento contínuo: o cliente é guiado do primeiro 'olá' até a entrega das chaves.",
  ],
  regrasOuro: [
    "Autoridade imediata: apresente-se com nome e sobrenome ancorando a MRV (maior da América Latina).",
    "Regra de Ouro Acelera 3.0 — controle da conversa: TODA mensagem DEVE terminar com pergunta clara de dupla escolha ou resposta direta.",
    "Validação progressiva: nunca avance de etapa (simulação/visita) sem validar a etapa anterior (dados/documentos).",
    "Tempo de resposta: lead novo em até 5 minutos — velocidade no 1º contato é determinante p/ conversão.",
    "Áudios curtos (máx. 40s), tom confiante e entusiasmado, após o primeiro texto.",
    "Não envie simulação sem antes coletar/validar dados financeiros e documentação básica.",
  ],
  promocao: [
    "1 Primeiro Contato → 2 Triagem: lead respondeu com o número/região do Menu 1–9.",
    "2 Triagem → 3 Documentos: composição, renda, FGTS e entrada mapeados.",
    "3 Documentos → 4 Simulação: documentos legíveis recebidos (análise Caixa rodada).",
    "4 Simulação → 5 Agendamento: cliente aprovou subsídio/parcela apresentados.",
    "5 Agendamento → 6 Fechamento: data/horário de visita confirmados.",
    "6 Fechamento → Venda: contrato assinado (link de reserva/assinatura digital).",
  ],
};

/* Leads-semente (do material do consultor). Dados ficam no navegador (localStorage). */
const SEED_LISTAS = [
  { id: "lista-mrv-base", nome: "Base MRV — 1º contato (9 empreendimentos)", origem: "Lista inicial do consultor", criadaEm: "2026-10-28" },
];

const SEED_LEADS = [
  {
    id: "lead-jose-fernando", listaId: "lista-mrv-base", nome: "José Fernando Ribeiro Matos", telefone: "62991074310",
    renda: 5000, entrada: 5000, fgts: "não informou / sem FGTS disponível", composicao: "sozinho",
    empreendimento: "Gran Verona", bairro: "Papillon Park", cidade: "Aparecida de Goiânia/GO",
    estagio: "triagem", classificacao: "em amadurecimento", optIn: true, canal: "WhatsApp",
    docs: {}, parcela: "", subsidio: "", unidade: "",
    obs: "Interesse no Gran Verona (Papillon Park). Solicitou simulações e detalhes do imóvel. Interesse na vizinhança. Respostas rápidas no WhatsApp. Ainda não decidiu avançar p/ simulação.",
    insights: ["Interesse em conhecer o Gran Verona e fazer simulação", "Compra sozinho · renda R$ 5.000 · entrada R$ 5.000", "Sem FGTS disponível", "Interesse na vizinhança", "Respostas rápidas — contato quente p/ retorno rápido"],
    historico: [{ quando: "2026-10-28 09:00", tipo: "sistema", texto: "Lead importado da ficha do consultor. Classificação: em amadurecimento." }],
    criadoEm: "2026-10-28",
  },
  {
    id: "lead-maryana", listaId: "lista-mrv-base", nome: "Maryana", telefone: "",
    renda: null, entrada: null, fgts: "", composicao: "",
    empreendimento: "", bairro: "", cidade: "",
    estagio: "conexao", classificacao: "novo", optIn: true, canal: "WhatsApp",
    docs: {}, parcela: "", subsidio: "", unidade: "",
    obs: "Lead de exemplo da abertura com Menu 9. Completar telefone para enviar.",
    insights: ["Usar abertura Menu 1–9: ela responde só com o número da região"],
    historico: [{ quando: "2026-10-28 09:00", tipo: "sistema", texto: "Lead criado a partir do script de abertura (Maryana)." }],
    criadoEm: "2026-10-28",
  },
];

function menu9Texto() {
  const numEmoji = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
  const ap = EMPREENDIMENTOS.filter(e => e.num <= 3);
  const go = EMPREENDIMENTOS.filter(e => e.num >= 4 && e.num <= 9);
  const linha = e => `${numEmoji[e.num-1]} *${e.nome}* — ${e.bairro}`;
  return `📍 *APARECIDA DE GOIÂNIA*\n${ap.map(linha).join("\n")}\n\n📍 *GOIÂNIA*\n${go.map(linha).join("\n")}`;
}

function fichaEmpreendimento(emp) {
  const lazer = emp.lazer.length ? emp.lazer.map(l => `• ${l}`).join("\n") : "• Área de lazer (confirmar itens na tabela vigente)";
  return `🟠 ${emp.nome.toUpperCase()} 🟠

🚧 ${emp.status}.

🏢 ${emp.tipologia}

✨ ${emp.destaques}

🎡 Área de lazer:
${lazer}

📍 ${emp.pontos.toUpperCase()}

Localização: *${emp.bairro.toUpperCase()} — ${emp.cidade.toUpperCase()}*
Faixa de preço: ${emp.preco}

🏗️ PREVISÃO DE ENTREGA: ${emp.entrega}`;
}

if (typeof module !== "undefined") {
  module.exports = { ESTAGIOS, EMPREENDIMENTOS, FAIXAS_MCMV, DOCS_CHECKLIST, TEMPLATES, MANUAL_ACELERA, menu9Texto, fichaEmpreendimento };
}

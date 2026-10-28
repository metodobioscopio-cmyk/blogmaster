# 🟠 BlogMaster CRM — Agente Acelera MRV

CRM próprio e **agêntico de WhatsApp em modo "sem ban"** (human-in-the-loop), com **painel por listas**, **espelho do WhatsApp do lead** e o **Método Acelera MRV** completo — feito para o consultor **Januário Leal** (MRV, a maior construtora da América Latina) atender os **9 empreendimentos de Goiânia e Aparecida de Goiânia**.

## ▶ Como rodar

```bash
npm start        # http://localhost:5173  (zero dependências — só Node)
npm test         # testes do parser de listas + motor do Agente
```

Sem Node? Abra `index.html` direto no navegador (tudo roda 100% no cliente; dados em `localStorage`).

## O que tem dentro

| Tela | O que faz |
|---|---|
| 📊 **Visão Geral** | KPIs, funil 7 etapas, próximas ações do Agente e **Kanban com promoção validada** |
| 🗂️ **Painel por Listas** | **Colar TXT** ou enviar **.txt/.csv/.md** (offline) e **.pdf/.docx** (leitor no navegador). O Agente extrai nome, telefone, renda, entrada, FGTS, empreendimento, bairro e cidade, deduplica por telefone e pontua cada lead |
| 👥 **Leads / CRM** | Ficha completa: dados financeiros, faixa MCMV estimada, **checklist de documentos**, insights, linha do tempo, exportação CSV |
| 📱 **Espelho WhatsApp** | Celular com a conversa como o lead vê. Gera o 1º contato personalizado, 20 scripts do Método Acelera, simula/interpreta respostas (número do menu, simulação, visita, opt-out) e envia via `wa.me` com 1 clique |
| 🛡️ **Fila Segura Anti-Ban** | O **processo agêntico de 1º contato**: fila personalizada por lista, ordenada por score, com limite diário, intervalo e horário comercial — envio sempre humano, 1 a 1 |
| 🏢 **9 Empreendimentos** | Fichas 🟠 prontas p/ WhatsApp (Gran Safira e Gran Verona completas; demais "a confirmar") + Menu 1–9 copiável |
| 📖 **Manual & Scripts** | Manual de Conduta completo, matriz de etapas, checklist de promoção e biblioteca de scripts |
| 🔎 **Pesquisa Sales & Marketing** | Playbook real estate/MCMV: tese por região, métricas, cadência D0–D7 e canais de aquisição |
| ⚙️ **Configurações** | Nome do consultor nos scripts, referências da API Oficial e **backup JSON/CSV** |

## 🛡️ Por que "sem ban" — e a honestidade por trás

Nenhum robô de disparo em massa é seguro: é exatamente isso que derruba números no WhatsApp. Aqui o Agente **prepara** mensagens únicas e priorizadas, e o consultor **envia manualmente 1 a 1** (link oficial `wa.me`), só para quem demonstrou interesse, em horário comercial, com opt-out imediato. Para automatizar em escala, o caminho aprovado é a **API Oficial (Cloud API/BSP) com templates** — tudo explicado em [`docs/ANTI-BAN-WHATSAPP.md`](docs/ANTI-BAN-WHATSAPP.md).

## 📥 Começando em 2 minutos

1. Abra **Painel por Listas** → cole o texto da sua lista (ou use `exemplos/lista-exemplo.txt`) → **Analisar com o Agente** → **Confirmar importação**.
2. Na **Fila Segura**, clique **Montar fila de 1º contato** → revise no **Espelho** → envie 1 a 1.
3. Quando o lead responder (ex.: o número do Menu 1–9), cole a resposta no Espelho → o Agente define o empreendimento, promove a etapa e já carrega o próximo script.

Leads-semente incluídos: **José Fernando Ribeiro Matos** (Gran Verona, em amadurecimento) e **Maryana** (abertura Menu 9).

## Estrutura

```
index.html · css/style.css · js/{data,parser,agent,app}.js · server.js
docs/  MANUAL-METODO-ACELERA-MRV.md · ANTI-BAN-WHATSAPP.md · PESQUISA-SALES-MARKETING-REAL-ESTATE.md
exemplos/ lista-exemplo.txt · leads-exemplo.csv     tests/ parser + agent
```

⚠️ **Privacidade:** os dados ficam só no navegador onde você usa o CRM. Exporte backup com frequência e trate listas/documentos conforme a LGPD. Preços/prazos marcados "a confirmar" nunca devem ser inventados para o lead.

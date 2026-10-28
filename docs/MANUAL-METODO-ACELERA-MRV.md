# Manual de Conduta e Processo de Atendimento — Método Acelera MRV

> Consultor: **Januário Leal** · MRV — a maior construtora da América Latina
> Este manual vive dentro do BlogMaster CRM (aba **Manual & Scripts Acelera**) e rege os portões de promoção do lead.

## 1. Posicionamento de Marca & Pilar de Segurança

**O que é a MRV?** A MRV é a maior construtora e incorporadora da América Latina, com mais de 40 anos de mercado e centenas de milhares de chaves entregues (+500 mil).

**Transmitindo segurança:**
- **Tradição:** líder absoluta de mercado no segmento e parceira do programa Minha Casa Minha Vida.
- **Garantia de entrega:** milhares de famílias atendidas com transparência e solididez financeira.
- **Acompanhamento contínuo:** o cliente é guiado do primeiro "olá" até a entrega das chaves.

## 2. Diretriz de Abertura Universal & Validação por Etapas — Regras de Ouro

1. **Autoridade imediata:** apresente-se com nome e sobrenome, ancorando a reputação da MRV (maior da América Latina).
2. **Controle da conversa:** termine todas as interações com uma pergunta direta (fechada ou de dupla escolha).
3. **Validação progressiva:** nunca avance de etapa (ex.: enviar simulação ou agendar visita) sem validar a etapa anterior (confirmação de dados/documentos).
4. **Tempo de resposta:** novos leads em até 5 minutos — velocidade no primeiro contato é determinante para a conversão.
5. **Áudios curtos** (máx. 40s), tom de voz confiante e entusiasmado, após o envio do primeiro texto.

## 3. Visão Geral das Etapas

```
[1 Conexão] → [2 Triagem] → [3 Validação de Região] → [4 Docs / Análise Caixa]
→ [5 Simulação / Proposta] → [6 Visita / Estande] → [7 Fechamento]
```

## 4. Abertura padrão (Menu 9) — primeiro contato para todos os empreendimentos

> Olá, {Nome}, tudo bem? Sou o **Januário Leal**, consultor MRV. Posso te fazer uma pergunta rápida? Para eu direcionar as informações certas, qual localização você prefere?
>
> 📍 **APARECIDA DE GOIÂNIA**
> 1️⃣ Gran Essence — Parque das Nações
> 2️⃣ Gran Safira — Parque Atheneu
> 3️⃣ Gran Parma — Papillon Park
>
> 📍 **GOIÂNIA**
> 4️⃣ Gran Terrazzo — Jardim Nova Esperança (Noroeste)
> 5️⃣ Golden Ville — Noroeste (atrás da Unialfa)
> 6️⃣ Priville — Carolina Parque
> 7️⃣ Gran Aurora — Jardim Gardênia
> 8️⃣ Gran Porto — Jardim Novo Mundo
> 9️⃣ Vert — Parque Amazônia
>
> Me responda com o número da região que te interessa.

Versão completa (usada pelo Agente): com assinatura "especialista de atendimento da MRV — a maior construtora da América Latina! 🏢✨" e pergunta de permissão. Há ainda as aberturas genéricas A (agilidade/sondagem), B (oportunidade/subsídio) e C (curta/direta), as 3 saudações e as 3 abordagens (simulação, vizinhança, acolhedora) — todas na biblioteca de scripts do CRM (`js/data.js`).

## 5. Scripts por etapa (resumo — textos integrais no CRM)

- **Etapa 1 · Conexão:** abertura específica quando o empreendimento já é conhecido; Menu 9 quando não é. Objetivo: autoridade + segurança + engajamento imediato.
- **Etapa 2 · Triagem (uma pergunta por vez):** renda individual x composição → FGTS (+3 anos de carteira, somando empregos) → entrada em dinheiro/veículo.
- **Etapa 3 · Validação de região:** travar o empreendimento principal pela rotina do cliente ("Papillon Park ou Parque Amazônia — qual fica melhor?").
- **Etapa 4 · Documentação:** RG/CNH (frente/verso), comprovante de endereço, comprovante de renda (3 contracheques/extratos), extrato FGTS se for usar. Âncora: "aprovar sua ficha na Caixa sem custo algum".
- **Etapa 5 · Simulação:** entrada facilitada + parcela + subsídio do Governo → fechar com dupla escolha ("à tarde ou à noite?").
- **Etapa 6 · Visita:** "nada se compara a ver de perto" → café + maquete → "sábado 10h ou domingo 14h?".
- **Etapa 7 · Fechamento:** análise aprovada + unidade atende + parcela cabe → "vou gerar o link de assinatura digital do contrato".

## 6. Matriz do processo completo

| Etapa | Ação principal | Script / pergunta de validação | Critério para avançar (gatilho) |
|---|---|---|---|
| 1. Conexão | Apresentação e rapport | "Olá! Sou o Januário Leal da MRV…" | Cliente responder confirmando o interesse |
| 2. Triagem | Coleta financeira básica | "Renda individual ou conjunta? FGTS +3 anos?" | Renda bruta, entrada e FGTS obtidos |
| 3. Validação de Região | Confirmar bairro/projeto | "…qual localização fica melhor para sua rotina?" | Empreendimento principal definido |
| 4. Pré-Análise / Doc | Documentos p/ Caixa | "…preciso RG, renda e residência. Pode enviar por aqui?" | Documentos recebidos e legíveis |
| 5. Apresentação | Simulação pré-aprovada | "Parcela de R$ X. Vamos ver a maquete?" | Cliente aprovar parcela/entrada |
| 6. Visita / Estande | Apresentação presencial/virtual | "Sábado 10h ou domingo 14h?" | Comparecer ou reunião online |
| 7. Fechamento | Assinatura e reserva | "Vou enviar o link de assinatura digital!" | Contrato assinado / sinal pago |

## 7. Checklist de promoção do lead (status no CRM)

- Lead Novo → Em Atendimento: mensagem enviada **e cliente respondeu**.
- Em Atendimento → Em Qualificação: renda, entrada e localização coletados.
- Em Qualificação → Em Análise de Crédito: documentação completa enviada.
- Em Análise → Proposta/Agendado: crédito aprovado e visita agendada.
- Proposta → Fechamento: contrato gerado e enviado para assinatura.

> No BlogMaster CRM, o botão **Promover ▶** executa esse checklist automaticamente (portões de validação em `js/agent.js`).

## 8. Ficha-modelo de empreendimento (WhatsApp)

### 🟠 GRAN SAFIRA 🟠
🚧 Em Construção. 🏢 Aptos de 42m² — 2 quartos · 45m² — 2 quartos + varanda. 🚗 Vaga de garagem. 🏙️ Térreo + 9 andares.
🎡 Lazer: 🍗 Churrasqueira · 👟 Fitness Externo · 🛝 Playgrounds · 🌳 Praças · 🚲 Bicicletário · 🤽 Piscina adulto e infantil · ⚽ Quadra · 🪩 Salão de festas.
📍 Região do Parque Atheneu, próximo ao Colégio Militar CEPMG, Instituto San Damiano, PUC Goiás, Av. Engler, Hospital HECAD. **Faixa de preço: R$ 240 mil a R$ 285 mil. Entrega: 2028.**

### 🟠 GRAN VERONA 🟠 (adaptada)
🚧 Em Construção. 🏢 Aptos de 2 quartos (varanda ou área privativa). 🚗 Vaga. Torres com elevador.
🎡 Lazer: Espaço Gourmet/Churrasqueira · Fitness · Playground/Kids Room · Praça · Piscina · Quadra Gramada · Salão de Festas.
📍 Papillon Park — Aparecida de Goiânia, próximo ao Aparecida Shopping, UPA Brasicon, Parque da Criança, Av. Veiga Cabral. **A partir de R$ 240 mil (sujeito a alteração). Entrega: 2028.**

> ⚠️ Empreendimentos sem ficha fornecida aparecem no CRM como "a confirmar" — **nunca inventar preço, prazo ou subsídio** para o lead.

# WhatsApp "sem ban" — como este CRM protege o número do consultor

## A verdade técnica (sem promessa milagrosa)

O WhatsApp bane números por: **disparo em massa sem opt-in, automação não-oficial** (robôs que controlam o app/web, extensões "bulk sender", WhatsApp modificado) e **alto índice de bloqueio/denúncia de spam**. Portanto:

> **Nenhum sistema pode garantir "zero ban" disparando automaticamente em massa por ferramenta não-oficial.** Quem promete isso está vendendo o caminho mais rápido para perder o número.

## O desenho adotado no BlogMaster CRM (human-in-the-loop)

1. **O Agente prepara, o humano envia.** A *Fila Segura* monta mensagens **personalizadas e únicas por lead** (nome, empreendimento, bairro + variação leve de texto), ordenadas por score. O envio é **1 clique humano** via link oficial `wa.me/<número>?text=…`, que abre o WhatsApp do consultor já com o texto — comportamento idêntico ao de digitar manualmente.
2. **Só entra na fila quem demonstrou interesse/opt-in** (checkbox no cadastro/importação), com telefone válido, e que ainda não recebeu 1º contato.
3. **Ritmo humano:** limite diário configurável (padrão 40), intervalo sugerido entre envios (padrão 3 min) e janela de horário comercial (8h–20h).
4. **Opt-out imediato:** resposta com "parar/sair/não quero" → lead sai de todas as filas, vai para *Perdido/Opt-out* e nunca mais é disparável.
5. **Cadência curta:** D0 → D+1 → D+3 → D+7 (encerramento elegante). Sem resposta depois disso = arquivar. Insistência é o maior gerador de bloqueio.
6. **Conteúdo que não parece spam:** abertura com nome e sobrenome + marca forte (MRV), 1 pergunta por mensagem, sem links encurtados suspeitos no 1º contato, sem anexo pesado antes da resposta.

## Quando precisar escalar de verdade: API Oficial (Cloud API / BSP)

O caminho **oficialmente permitido** para automação e broadcast é a **WhatsApp Business Platform (Cloud API)** via Meta ou provedor BSP:

- Mensagens iniciadas pela empresa exigem **template pré-aprovado** pela Meta (marketing/utilidade) e **opt-in comprovável** do contato.
- Há **quality rating** do número e limites progressivos de envio (começa ~1.000 conversas/dia e sobe com boa reputação).
- Broadcast no **app WhatsApp Business** comum é limitado a listas de transmissão de **256 contatos salvos** — não é ferramenta de cold outreach.
- No BlogMaster: tela **Configurações → API Oficial** guarda BSP, número verificado e nome do template aprovado (ex.: `mrv_abertura_menu9_v1`) como referência para a migração. O template sugerido para aprovar é a **abertura Menu 9** com variáveis `{{1}} = nome` e `{{2}} = consultor`.

## Checklist antes de cada sessão de 1º contato

- [ ] Lista tem origem/opt-in registrado (anúncio, formulário, indicação, atendimento anterior)?
- [ ] Fila montada e revisada no Espelho WhatsApp (nome/empreendimento corretos)?
- [ ] Horário comercial (8h–20h) e ritmo: pausas reais entre envios?
- [ ] Respostas chegando → responder em ≤ 5 min (regra de ouro Acelera)?
- [ ] Alguém pediu para parar → opt-out aplicado na hora, sem retruca?

## Referências (out/2026)

- WhatsApp Business Platform: templates aprovados + opt-in são obrigatórios para mensagens iniciadas pela empresa; limites escalam com o quality rating.
- Guias de compliance 2026 (bulk messaging): ferramentas "bulk sender" não-oficiais e extensões de navegador são a causa mais comum de banimento; a rota segura é API oficial ou envio manual 1-a-1.
- LGPD: trate listas e documentos como dados pessoais — finalidade (análise de crédito/atendimento), acesso restrito, descarte quando não houver mais interesse.

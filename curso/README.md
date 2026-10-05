# Curso — padrão de gravação e ordem de produção

28 aulas · 6 módulos · ~4 h. Os roteiros estão em dois arquivos:

| Arquivo | Aulas | Uso |
|---|---|---|
| `roteiros-m1-m2.md` | 10 aulas (M1 + M2) | **Grave isto primeiro.** São as duas aulas que liberam a abertura do carrinho. |
| `roteiros-m3-m6.md` | 18 aulas (M3 a M6) | Gravação do restante, já com o modelo validado. |

Cada roteiro traz: gancho literal, promessa, blocos de demonstração em ordem numerada,
o erro que deve aparecer de propósito, o artefato entregue e a recapitulação.

---

## 1. Antes de gravar qualquer coisa

- [ ] As 6 APIs assinadas na **sua conta** RapidAPI e um site-alvo próprio (nunca o site de um cliente
      sem autorização escrita para aparecer no vídeo).
- [ ] Chave da API em variável de ambiente. Nenhuma chave visível na tela em nenhum frame.
- [ ] Navegador com janela limpa: sem abas de e-mail, sem favoritos com nome de cliente, sem notificação.
- [ ] Zoom do navegador em **125%** (o texto precisa ser legível em celular).
- [ ] Área de membros aberta em outra janela — é ela que recebe os artefatos.
- [ ] Roteiro impresso ou em segunda tela. Não leia da tela que está sendo gravada.

## 2. Padrão técnico (não negociável)

| Item | Valor |
|---|---|
| Vídeo | 1920×1080, 30 fps |
| Áudio | microfone lapela ou headset — nunca o microfone interno do notebook |
| Música | nenhuma durante a explicação |
| Exportação | H.264, CRF 18, áudio −16 LUFS |
| Legenda | PT-BR queimada **ou** arquivo `.srt` ao lado (obrigatório para a edição internacional) |
| Nome do arquivo | `M1-01-design-exponencial.mp4` (módulo, número, slug) |

## 3. Esqueleto de toda aula

| Bloco | Tempo | O que acontece |
|---|---|---|
| Gancho | 0:00–0:20 | O problema em uma frase. Sem logo, sem trilha, sem “olá pessoal”. |
| Promessa | 0:20–0:40 | “Ao final desta aula você terá [entregável concreto].” |
| Demonstração | 40 s – 80% | Tela real, sem corte no erro. Mostrar o erro e a correção ensina mais que o caminho perfeito. |
| Artefato | 80%–95% | Mostrar o arquivo que o aluno baixa, aberto, e dizer onde ele está na área de membros. |
| Recapitulação | final | 3 bullets + “próximo passo”. |

## 4. Ordem de produção

1. **M1 e M2** (10 aulas). Assista seguido: se você se perder no módulo 1, refaça antes do 2.
2. Valide com **duas pessoas** que nunca usaram as APIs: elas conseguem rodar o funil depois de assistir?
   Se não, o problema é o roteiro, não o aluno.
3. **M3** — inclui o estudo de caso (3.5), a aula mais valiosa do curso. Grave com um projeto real.
4. **M4 e M5** — apoio operacional e comercial.
5. **M6** — tour da biblioteca, 6 min por aula.

> Trave de decisão do plano de lançamento: **sem M1 e M2 gravados, o carrinho não abre.**
> Ver `vendas/plano-de-lancamento.md`, gate do dia 7.

## 5. Depois de gravar cada aula

- [ ] Assistir na velocidade 2× procurando: chave de API visível, dado de cliente, promessa de resultado.
- [ ] Subir o vídeo e **colar a URL no item correspondente** da área de membros (os marcadores `[VÍDEO]`).
- [ ] Confirmar que o artefato citado existe em `site/area/materiais/` e abre no navegador.
- [ ] Exportar o `.srt` e guardar junto do master.

## 6. Edição internacional

O curso é gravado em PT-BR. Para vender a edição em inglês no Gumroad, a legenda `.srt` em inglês
resolve a maior parte — e os artefatos já são bilíngues (prompts, planilhas, e-book, template).
Não regrave os vídeos: legende.

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
retoque_audios.py — monta as faixas de áudio guiado do Volume 4 no ritmo do roteiro.

O que ele faz:
  1. decodifica mp3 → PCM 44,1 kHz mono s16le (via ffmpeg do imageio-ffmpeg);
  2. acha as pausas naturais da narração (RMS por janela de 20 ms);
  3. ESTICA as pausas: insere silêncio nos trechos mais longos (as pausas de verdade,
     entre frases), que é onde o ouvinte precisa de tempo para fazer o exercício;
  4. concatena os blocos com pontes de silêncio planejadas;
  5. reencoda em mp3 96 kbps com fade-in/fade-out e metadados.

Uso:  python3 tools/retoque_audios.py
"""
import os, io, wave, audioop, subprocess, tempfile, shutil

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD  = os.path.join(RAIZ, "projeto-4-infoprodutos", "livro-4", "audios")
SEG  = os.path.join(AUD, "_seg")
TMP  = os.path.join(RAIZ, ".tmp-audio")
SR, CH = 44100, 1
FRAME  = int(SR*0.02)*2          # 20 ms em bytes (s16 mono)
LIMIAR = 150                     # RMS abaixo disso = silêncio (~ -46 dB)
MIN_PAUSA = int(0.35/0.02)       # 0,35 s

import imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

def sh(args, entrada=None):
    r = subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y"] + args,
                       input=entrada, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if r.returncode:
        raise RuntimeError(r.stderr.decode()[:400])
    return r.stdout

def pcm(caminho_mp3):
    return sh(["-i", caminho_mp3, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])

def pausas(dados):
    """Lista de (inicio, fim) em bytes das pausas naturais da narração."""
    saida, ini = [], None
    for i in range(0, len(dados)-FRAME, FRAME):
        if audioop.rms(dados[i:i+FRAME], 2) < LIMIAR:
            if ini is None: ini = i
        else:
            if ini is not None:
                if (i-ini)//FRAME >= MIN_PAUSA:
                    saida.append((ini, i))
                ini = None
    return saida

def esticar(dados, quantas=0, extra_s=0.0, inicial=False, minimo_s=0.0):
    """Insere `extra_s` de silêncio nas `quantas` pausas mais longas."""
    if quantas <= 0 or extra_s <= 0:
        return dados
    lista = [p for p in pausas(dados) if (p[1]-p[0])/2/SR >= minimo_s]
    lista.sort(key=lambda p: p[0]-p[1])          # mais longas primeiro
    alvos = sorted(lista[:quantas])              # aplica do fim para o começo
    adic = int(extra_s*SR)*2
    for i, (a, b) in enumerate(reversed(alvos)):
        meio = a + (b-a)//2
        dados = dados[:meio] + b"\x00"*adic + dados[meio:]
        del i
    return dados

def fade(dados, entrada_s=0.3, saida_s=3.0):
    n_in, n_out = int(entrada_s*SR)*2, int(saida_s*SR)*2
    if len(dados) > n_in:
        dados = audioop.mul(dados[:n_in], 2, 0.0) if False else \
                audioop.mul(dados[:n_in], 2, 0.35) + dados[n_in:]
    if len(dados) > n_out:
        dados = dados[:-n_out] + audioop.mul(dados[-n_out:], 2, 0.15)
    return dados

def silencio(s):
    return b"\x00" * (int(s*SR)*2)

def encodar(dados, destino, titulo):
    mp3 = sh(["-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
              "-b:a", "96k", "-metadata", f"title={titulo}",
              "-metadata", "artist=Coleção Vida em Ordem",
              "-metadata", "album=Energia em 21 Dias",
              "-metadata", "genre=Áudio guiado", "-f", "mp3", "-"], entrada=dados)
    with open(destino, "wb") as f:
        f.write(mp3)
    dur = len(dados)/2/SR
    return dur

def mmss(s):
    return f"{int(s)//60}:{int(s)%60:02d}"

def montar(blocos, pontes, destino, titulo, ajustes=None):
    """blocos: lista de mp3 de origem · pontes: silêncio (s) entre eles."""
    pedacos = []
    ajustes = ajustes or {}
    for i, b in enumerate(blocos):
        d = pcm(b)
        cfg = ajustes.get(i, {})
        d = esticar(d, cfg.get("quantas", 0), cfg.get("extra", 0.0), minimo_s=cfg.get("minimo", 0.5))
        pedacos.append(d)
        if i < len(pontes):
            pedacos.append(silencio(pontes[i]))
    dados = fade(b"".join(pedacos))
    dur = encodar(dados, destino, titulo)
    print(f"  {os.path.basename(destino):28s} {mmss(dur)}  ({dur:.0f} s)")
    return dur

def main():
    os.makedirs(TMP, exist_ok=True)
    print("Faixa 1 — respiração (pausas + longas)")
    montar([os.path.join(AUD, "01-respiracao-guiada.mp3")], [],
           os.path.join(TMP, "f1.mp3"), "01 - Respiração guiada",
           ajustes={0: dict(quantas=22, extra=4.6, minimo=0.45)})
    print("Faixa 2 — soltar o dia")
    montar([os.path.join(AUD, "02-soltar-o-dia.mp3")], [],
           os.path.join(TMP, "f2.mp3"), "02 - Soltar o dia",
           ajustes={0: dict(quantas=20, extra=12.0, minimo=0.5)})
    print("Faixa 3 — foco para começar (reconstruída)")
    montar([os.path.join(SEG, n) for n in ["f3a1.mp3", "f3a2.mp3", "f3b.mp3", "f3c.mp3", "f3d.mp3"]],
           [7, 10, 45, 80, 65], os.path.join(TMP, "f3.mp3"), "03 - Foco para começar",
           ajustes={2: dict(quantas=8, extra=6.0, minimo=0.5),
                    3: dict(quantas=6, extra=8.0, minimo=0.5)})
    print("Faixa 4 — luz da manhã (nova, acompanha os 10 min de sol)")
    montar([os.path.join(SEG, n) for n in ["f4a.mp3", "f4b.mp3", "f4c.mp3", "f4d.mp3"]],
           [12, 14, 20, 12], os.path.join(TMP, "f4.mp3"), "04 - Luz da manhã",
           ajustes={1: dict(quantas=5, extra=38.0, minimo=0.5),
                    2: dict(quantas=5, extra=38.0, minimo=0.5)})
    finais = {"f1.mp3": "01-respiracao-guiada.mp3", "f2.mp3": "02-soltar-o-dia.mp3",
              "f3.mp3": "03-foco-para-comecar.mp3", "f4.mp3": "04-sol-da-manha.mp3"}
    print("\nPublicando:")
    for tmp, nome in finais.items():
        shutil.copy(os.path.join(TMP, tmp), os.path.join(AUD, nome))
        print("  ", nome)
    shutil.rmtree(TMP, ignore_errors=True)
    shutil.rmtree(SEG, ignore_errors=True)

if __name__ == "__main__":
    main()

import shutil
import sys
from pathlib import Path

PASTA = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads"
TIPOS = {
    "Imagens": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "Documentos": [".pdf", ".docx", ".txt", ".xlsx", ".pptx"],
    "Músicas": [".mp3", ".wav", ".m4a"],
    "Vídeos": [".mp4", ".mov", ".mkv"],
    "Compactados": [".zip", ".rar", ".7z"],
}


def destino(arquivo):
    for pasta, extensoes in TIPOS.items():
        if arquivo.suffix.lower() in extensoes:
            return pasta
    return "Outros"


if input(f"Organizar {PASTA}? (s/n) ").strip().lower() != "s":
    sys.exit("Nada foi mexido.")

movidos = 0
for arquivo in PASTA.iterdir():
    if not arquivo.is_file() or arquivo.name.startswith(".") or arquivo.name == "desktop.ini":
        continue
    nova_pasta = PASTA / destino(arquivo)
    nova_pasta.mkdir(exist_ok=True)
    alvo = nova_pasta / arquivo.name
    if alvo.exists():
        print(f"Pulei {arquivo.name}: já existe em {nova_pasta.name}")
        continue
    shutil.move(arquivo, alvo)
    print(f"{arquivo.name} -> {nova_pasta.name}")
    movidos += 1

print(f"\nPronto! {movidos} arquivos organizados.")

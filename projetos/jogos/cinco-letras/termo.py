import random

PALAVRAS = ['TERMO', 'CARTA', 'PORTA', 'LIVRO', 'NUVEM', 'PRAIA',
            'SENHA', 'TECLA', 'VIDRO', 'FESTA', 'BANCO', 'CAMPO']
VERDE, AMARELO, CINZA = '\033[42m', '\033[43m', '\033[100m'
BRANCO, FIM = '\033[1;97m', '\033[0m'


def cores(chute, certa):
    cor = [CINZA] * 5
    sobra = list(certa)
    for i in range(5):
        if chute[i] == certa[i]:
            cor[i] = VERDE
            sobra.remove(chute[i])
    for i in range(5):
        if cor[i] == CINZA and chute[i] in sobra:
            cor[i] = AMARELO
            sobra.remove(chute[i])
    return cor


def pinta(chute, cor):
    return ' '.join(f'{c}{BRANCO} {letra} {FIM}' for letra, c in zip(chute, cor))


def joga(certa, entrada=input):
    for vez in range(1, 7):
        chute = entrada(f'Tentativa {vez} de 6: ').strip().upper()
        while len(chute) != 5 or not chute.isalpha():
            chute = entrada('Digite 5 letras: ').strip().upper()
        print(pinta(chute, cores(chute, certa)))
        if chute == certa:
            print(f'Acertou em {vez}!')
            return True
    print('A palavra era', certa)
    return False


if __name__ == '__main__':
    joga(random.choice(PALAVRAS))

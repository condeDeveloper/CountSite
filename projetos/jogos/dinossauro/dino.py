import tkinter as tk
import random

L, A, CHAO, P = 600, 200, 160, 4
DINO = ['      #### ',
        '      # ###',
        '      #####',
        '#    ###   ',
        '##  #####  ',
        ' ######    ',
        '  #####    ']
PERNAS = ['  #  #     ', '   # #     ']

janela = tk.Tk()
janela.title('Jogo do dinossauro')
tela = tk.Canvas(janela, width=L, height=A, bg='white')
tela.pack()

def novo():
    global y, vel, cactos, pontos, ritmo, folga, vivo
    y, vel, cactos, pontos, ritmo, folga, vivo = CHAO, 0, [], 0, 6, 0, True

def pula(_=None):
    global vel
    if not vivo: novo()
    elif y == CHAO: vel = -13

def passo():
    global y, vel, pontos, ritmo, folga, vivo
    if vivo:
        vel += 1
        y = min(CHAO, y + vel)
        if not cactos or cactos[-1][0] < L - folga:
            cactos.append([L, random.choice([24, 32, 40])])
            folga = random.randint(280, 480)
        for c in cactos: c[0] -= ritmo
        cactos[:] = [c for c in cactos if c[0] > -20]
        pontos += 1
        ritmo = min(11, 6 + pontos // 300)
        vivo = not any(c[0] < 76 and c[0] + 14 > 44 and y > CHAO - c[1] for c in cactos)
    desenha()
    janela.after(20, passo)

def bloco(x, y0, w, h):
    tela.create_rectangle(x, y0, x + w, y0 + h, fill='#535353', width=0)

def desenha():
    tela.delete('all')
    bloco(0, CHAO, L, 2)
    corpo = DINO + [PERNAS[pontos // 6 % 2 if y == CHAO else 0]]
    for i, linha in enumerate(corpo):
        for j, c in enumerate(linha):
            if c == '#': bloco(40 + j * P, y - (len(corpo) - i) * P, P, P)
    for x, h in cactos:
        bloco(x + 4, CHAO - h, 6, h)
        bloco(x, CHAO - h * 0.45, 14, 3)
        bloco(x, CHAO - h * 0.75, 3, h * 0.3); bloco(x + 11, CHAO - h * 0.85, 3, h * 0.4)
    tela.create_text(L - 12, 18, text=f'{pontos // 5:05d}', anchor='e', font=('Consolas', 14), fill='#535353')
    if not vivo:
        tela.create_text(L / 2, 70, text='FIM DE JOGO', font=('Consolas', 18, 'bold'), fill='#535353')
        tela.create_text(L / 2, 96, text='espaço para jogar de novo', font=('Consolas', 11), fill='#535353')

janela.bind('<space>', pula)
janela.bind('<Up>', pula)
novo()
if __name__ == '__main__':
    passo()
    janela.mainloop()

const tela = document.getElementById('tela')
const g = tela.getContext('2d')
const L = 600, A = 324, VAO = 100
const LARG = 46, X = 120, R = 13
let y, vel, canos, pontos, vivo, passo

function novo() {
  y = A / 2; vel = 0; canos = []
  pontos = 0; vivo = true; passo = 0
}

function bate(c) {
  const dentro = X + R > c.x && X - R < c.x + LARG
  const fora = y - R < c.topo || y + R > c.topo + VAO
  return dentro && fora
}

function anda() {
  if (!vivo) return
  vel += 0.35
  y += vel
  if (passo++ % 80 === 0) {
    const topo = 40 + Math.random() * (A - VAO - 80)
    canos.push({ x: L, topo, contou: false })
  }
  for (const c of canos) {
    c.x -= 2.4
    if (!c.contou && c.x + LARG < X) {
      c.contou = true
      pontos++
    }
    if (bate(c)) vivo = false
  }
  canos = canos.filter((c) => c.x > -LARG)
  if (y + R > A || y - R < 0) vivo = false
}

function desenha() {
  g.fillStyle = '#8fd3ff'
  g.fillRect(0, 0, L, A)
  for (const c of canos) {
    const baixo = c.topo + VAO
    g.fillStyle = '#3aa655'
    g.fillRect(c.x, 0, LARG, c.topo)
    g.fillRect(c.x, baixo, LARG, A)
    g.fillStyle = '#2b7d40'
    g.fillRect(c.x - 4, c.topo - 16, LARG + 8, 16)
    g.fillRect(c.x - 4, baixo, LARG + 8, 16)
  }
  g.fillStyle = '#ffd43b'
  g.beginPath(); g.arc(X, y, R, 0, 7); g.fill()
  g.fillStyle = '#ff8a3c'
  g.fillRect(X + 9, y - 2, 11, 6)
  g.fillStyle = '#16233a'
  g.fillRect(X + 3, y - 7, 5, 5)
  const asa = Math.sin(passo / 3) * 5
  g.fillStyle = '#fff3b0'
  g.beginPath()
  g.ellipse(X - 4, y + 2 + asa, 8, 5, 0, 0, 7)
  g.fill()
  g.fillStyle = '#16233a'
  g.font = 'bold 28px Arial'
  g.fillText(pontos, 16, 36)
  if (!vivo) g.fillText('FIM DE JOGO', L / 2 - 90, A / 2)
}

function bateAsa() {
  if (vivo) vel = -5
  else novo()
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') bateAsa()
})
tela.addEventListener('pointerdown', bateAsa)

novo()
setInterval(() => { anda(); desenha() }, 16)

const tela = document.getElementById('jogo')
const ctx = tela.getContext('2d')
const T = 20
let cobra = [{ x: 10, y: 10 }]
let dir = { x: 1, y: 0 }
let comida = { x: 15, y: 10 }
let pontos = 0

const sorteia = () => Math.floor(Math.random() * T)

function desenha() {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, 400, 400)
  ctx.fillStyle = '#f7df1e'
  cobra.forEach(p => ctx.fillRect(p.x * T, p.y * T, 18, 18))
  ctx.fillStyle = '#ff5c5c'
  ctx.fillRect(comida.x * T, comida.y * T, 18, 18)
  ctx.fillText('Pontos: ' + pontos, 10, 20)
}

function passo() {
  const c = { x: cobra[0].x + dir.x, y: cobra[0].y + dir.y }
  const bateu = c.x < 0 || c.y < 0 || c.x >= T || c.y >= T
    || cobra.some(p => p.x === c.x && p.y === c.y)
  if (bateu) return clearInterval(relogio)
  cobra.unshift(c)
  if (c.x === comida.x && c.y === comida.y) {
    pontos++
    comida = { x: sorteia(), y: sorteia() }
  } else cobra.pop()
  desenha()
}

const relogio = setInterval(passo, 120)

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') dir = { x: 0, y: -1 }
  if (e.key === 'ArrowDown') dir = { x: 0, y: 1 }
  if (e.key === 'ArrowLeft') dir = { x: -1, y: 0 }
  if (e.key === 'ArrowRight') dir = { x: 1, y: 0 }
})

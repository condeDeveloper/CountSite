const ctx = document.getElementById('jogo').getContext('2d')
const L = 10, A = 20, T = 30
const CORES = ['#111', '#34d27b', '#ffc93c', '#4b8dff', '#ff8a3d', '#5fd0f3']
const FORMAS = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]]
]
let grade = Array.from({ length: A }, () => Array(L).fill(0))
let peca, px, py, linhas = 0

function nova() {
  const n = Math.floor(Math.random() * FORMAS.length)
  peca = FORMAS[n].map(l => l.map(v => v * (n + 1)))
  px = 3
  py = 0
  if (bate(peca, px, py)) clearInterval(relogio)
}

const bate = (p, x, y) => p.some((l, i) => l.some((v, j) =>
  v && (x + j < 0 || x + j >= L || y + i >= A || grade[y + i][x + j])))

function desce() {
  if (!bate(peca, px, py + 1)) py++
  else {
    peca.forEach((l, i) => l.forEach((v, j) => { if (v) grade[py + i][px + j] = v }))
    grade = grade.filter(l => l.includes(0))
    linhas += A - grade.length
    while (grade.length < A) grade.unshift(Array(L).fill(0))
    nova()
  }
  desenha()
}

function quadrado(x, y, v) {
  ctx.fillStyle = CORES[v]
  ctx.fillRect(x * T, y * T, T - 1, T - 1)
}

function desenha() {
  grade.forEach((l, i) => l.forEach((v, j) => quadrado(j, i, v)))
  peca.forEach((l, i) => l.forEach((v, j) => v && quadrado(px + j, py + i, v)))
  ctx.fillStyle = '#fff'
  ctx.fillText('Linhas: ' + linhas, 8, 16)
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && !bate(peca, px - 1, py)) px--
  if (e.key === 'ArrowRight' && !bate(peca, px + 1, py)) px++
  if (e.key === 'ArrowDown') desce()
  if (e.key === 'ArrowUp') {
    const girada = peca[0].map((_, j) => peca.map(l => l[j]).reverse())
    if (!bate(girada, px, py)) peca = girada
  }
  desenha()
})

const relogio = setInterval(desce, 400)
nova()

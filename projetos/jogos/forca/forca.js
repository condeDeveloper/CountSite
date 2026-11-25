const tela = document.getElementById('tela')
const g = tela.getContext('2d')
const PALAVRAS = ['PYTHON', 'TECLADO', 'INTERNET', 'PROGRAMA',
  'ALGORITMO', 'SERVIDOR', 'MEMORIA', 'SENHA']
let palavra, letras, erros

function novo() {
  const sorteio = Math.floor(Math.random() * PALAVRAS.length)
  palavra = PALAVRAS[sorteio]
  letras = []; erros = 0
  desenha()
}

function linha(x1, y1, x2, y2) {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke()
}

const BONECO = [
  () => { g.beginPath(); g.arc(250, 110, 22, 0, 7); g.stroke() },
  () => linha(250, 132, 250, 210),
  () => { linha(250, 150, 215, 185); linha(215, 185, 207, 180) },
  () => { linha(250, 150, 285, 185); linha(285, 185, 293, 180) },
  () => { linha(250, 210, 225, 265); linha(225, 265, 210, 265) },
  () => { linha(250, 210, 275, 265); linha(275, 265, 290, 265) },
]

function ganhou() {
  return [...palavra].every((c) => letras.includes(c))
}

function desenha() {
  g.fillStyle = '#fdf6e3'
  g.fillRect(0, 0, 400, 400)
  g.strokeStyle = '#3b2f2f'; g.lineWidth = 6; g.lineCap = 'round'
  linha(60, 300, 200, 300); linha(110, 300, 110, 50)
  linha(110, 50, 250, 50); linha(250, 50, 250, 88)
  for (let i = 0; i < erros; i++) BONECO[i]()
  if (erros === 6) {
    g.lineWidth = 3
    linha(238, 102, 246, 110); linha(246, 102, 238, 110)
    linha(254, 102, 262, 110); linha(262, 102, 254, 110)
  }
  const perdeu = erros === 6
  const mostra = [...palavra].map((c) => (letras.includes(c) || perdeu ? c : '_'))
  g.fillStyle = '#3b2f2f'; g.textAlign = 'center'
  g.font = 'bold 30px monospace'
  g.fillText(mostra.join(' '), 200, 350)
  const erradas = letras.filter((c) => !palavra.includes(c)).join(' ')
  g.font = '16px monospace'
  if (ganhou()) g.fillText('GANHOU! Enter joga de novo', 200, 385)
  else if (perdeu) g.fillText('ENFORCADO! Enter joga de novo', 200, 385)
  else g.fillText('erradas: ' + erradas, 200, 385)
}

document.addEventListener('keydown', (e) => {
  const fim = erros === 6 || ganhou()
  if (fim && e.key === 'Enter') return novo()
  const c = e.key.toUpperCase()
  if (fim || !/^[A-Z]$/.test(c) || letras.includes(c)) return
  letras.push(c)
  if (!palavra.includes(c)) erros++
  desenha()
})

novo()

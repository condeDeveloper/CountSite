// Carrega ANTES do código do jogo. Faz duas coisas sem mudar o código do vídeo:
// 1) segura o relógio (setInterval) até a pessoa tocar em "Jogar" (senão a cobrinha bate antes de alguém ver);
// 2) percebe o fim de jogo: o jogo só para o relógio (clearInterval) quando a partida acaba.
// ?demo=1 (vitrine que joga sozinha): não mexe em nada. ?auto=1 (jogar de novo): já começa rodando.
(function () {
  const q = new URLSearchParams(location.search)
  if (q.get('demo') === '1') { window.__comecar = function () {}; return }
  const auto = q.get('auto') === '1'
  const fila = []
  let comecou = auto
  const setOrig = window.setInterval.bind(window)
  const clearOrig = window.clearInterval.bind(window)
  const fim = () => setTimeout(() => document.dispatchEvent(new Event('fimdejogo')), 350)

  window.setInterval = function (fn, ms) {
    if (comecou) return setOrig(fn, ms)
    const h = { fn, ms, id: null, cancelado: false }
    fila.push(h)
    return h
  }
  window.clearInterval = function (h) {
    if (h && typeof h === 'object') {
      if (h.id !== null) { clearOrig(h.id); fim() } else h.cancelado = true
      return
    }
    clearOrig(h)
    fim()
  }
  window.__comecar = function () {
    if (comecou) return
    comecou = true
    fila.forEach((h) => { if (!h.cancelado) h.id = setOrig(h.fn, h.ms) })
    document.body.classList.add('rodando')
  }
  if (auto) document.addEventListener('DOMContentLoaded', () => document.body.classList.add('rodando'))
})()

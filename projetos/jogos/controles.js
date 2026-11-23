// Moldura dos jogos do canal: botões de toque (o código do vídeo só escuta o teclado),
// botão de recomeçar e, com ?demo=1 no endereço, o jogo jogando sozinho (vitrine).
// O código do projeto não muda: tudo aqui só aperta as mesmas setas do teclado.
(function () {
  const params = new URLSearchParams(location.search)
  const demo = params.get('demo') === '1'
  const jogo = document.body.dataset.jogo // 'cobrinha' | 'blocos'

  const aperta = (key) => document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  const comeca = () => { if (window.__comecar) window.__comecar() }

  // Regra clássica da cobrinha: a seta contrária ao movimento é ignorada (a cobra não dá meia-volta).
  // O código do vídeo não confere isso; a moldura confere, olhando o corpo de verdade (cabeça menos pescoço),
  // o que também segura dois toques rápidos dentro do mesmo passo.
  if (jogo === 'cobrinha' && !demo) {
    const SETAS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
    document.addEventListener('keydown', (e) => {
      const s = SETAS[e.key]
      if (!s) return
      try {
        if (cobra.length < 2) return
        const dx = cobra[0].x - cobra[1].x, dy = cobra[0].y - cobra[1].y
        if (s[0] === -dx && s[1] === -dy) e.stopImmediatePropagation()
      } catch (err) { /* jogo ainda não começou */ }
    }, true)
  }

  // Seta não rola a página quando o jogo está dentro de outra página.
  window.addEventListener('keydown', (e) => { if (e.key.startsWith('Arrow')) { e.preventDefault(); if (!demo) comeca() } }, { passive: false })

  if (demo) {
    document.body.classList.add('demo')
    piloto()
    return
  }

  const pad = document.getElementById('pad')
  if (pad) {
    pad.querySelectorAll('[data-key]').forEach((b) => {
      const dispara = (e) => { e.preventDefault(); comeca(); aperta(b.dataset.key); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 120) }
      b.addEventListener('touchstart', dispara, { passive: false })
      b.addEventListener('mousedown', dispara)
    })
  }
  const de = document.getElementById('denovo')
  // Jogar de novo já volta rodando, sem pedir o toque em "Jogar" outra vez.
  if (de) de.addEventListener('click', () => location.replace(location.pathname + '?auto=1'))
  // Fim de jogo: placar e "jogar de novo" (o jogo avisa pelo evento que o inicio.js solta).
  const telaFim = document.getElementById('fim')
  document.addEventListener('fimdejogo', () => {
    if (!telaFim) return
    let txt = ''
    try { txt = jogo === 'cobrinha' ? 'Pontos: ' + pontos : 'Linhas: ' + linhas } catch (e) {}
    document.getElementById('fim-pontos').textContent = txt
    telaFim.hidden = false
  })
  const fd = document.getElementById('fim-denovo')
  if (fd) fd.addEventListener('click', () => location.replace(location.pathname + '?auto=1'))
  const bj = document.getElementById('comecar')
  if (bj) bj.addEventListener('click', comeca)

  // Deslizar o dedo em cima do jogo também vale como seta.
  const tela = document.getElementById('jogo')
  let ini = null
  tela.addEventListener('touchstart', (e) => { const t = e.touches[0]; ini = { x: t.clientX, y: t.clientY } }, { passive: true })
  tela.addEventListener('touchend', (e) => {
    if (!ini) return
    comeca()
    const t = e.changedTouches[0], dx = t.clientX - ini.x, dy = t.clientY - ini.y
    ini = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { if (jogo === 'blocos') aperta('ArrowUp'); return }
    if (Math.abs(dx) > Math.abs(dy)) aperta(dx > 0 ? 'ArrowRight' : 'ArrowLeft')
    else aperta(dy > 0 ? 'ArrowDown' : 'ArrowUp')
  })

  function piloto() {
    // Se nada muda por 3 s, o jogo acabou: recomeça.
    let ultimo = '', parado = 0
    setInterval(() => {
      let assinatura = ''
      try { assinatura = jogo === 'cobrinha' ? JSON.stringify(cobra) : JSON.stringify(grade) + py } catch (e) {}
      parado = assinatura === ultimo ? parado + 1 : 0
      ultimo = assinatura
      if (parado >= 6) location.reload()
    }, 500)

    if (jogo === 'cobrinha') {
      // Vai atrás da comida sem bater em si mesma nem na parede.
      const livre = (x, y) => x >= 0 && y >= 0 && x < T && y < T && !cobra.some((p) => p.x === x && p.y === y)
      setInterval(() => {
        try {
          const c = cobra[0]
          const opcoes = [
            { key: 'ArrowRight', x: 1, y: 0 }, { key: 'ArrowLeft', x: -1, y: 0 },
            { key: 'ArrowDown', x: 0, y: 1 }, { key: 'ArrowUp', x: 0, y: -1 },
          ].filter((o) => !(o.x === -dir.x && o.y === -dir.y) && livre(c.x + o.x, c.y + o.y))
          if (!opcoes.length) return
          opcoes.sort((a, b) => (Math.abs(c.x + a.x - comida.x) + Math.abs(c.y + a.y - comida.y)) - (Math.abs(c.x + b.x - comida.x) + Math.abs(c.y + b.y - comida.y)))
          const o = opcoes[0]
          if (o.x !== dir.x || o.y !== dir.y) aperta(o.key)
        } catch (e) {}
      }, 60)
    } else {
      // Vitrine começa no meio da partida: as últimas linhas já com blocos (um buraco por linha).
      try {
        for (let i = A - 7; i < A; i++) {
          const buraco = Math.floor(Math.random() * L)
          for (let j = 0; j < L; j++) grade[i][j] = j === buraco || Math.random() < 0.15 ? 0 : 1 + Math.floor(Math.random() * 5)
        }
      } catch (e) {}
      // Peça nova: escolhe uma coluna e um giro e vai até lá.
      let alvo = null, pecaVista = null
      setInterval(() => {
        try {
          if (peca !== pecaVista && py <= 1) { pecaVista = peca; alvo = { x: Math.floor(Math.random() * 8), giros: Math.floor(Math.random() * 4) } }
          if (!alvo) return
          if (alvo.giros > 0) { aperta('ArrowUp'); alvo.giros--; pecaVista = peca; return }
          if (px < alvo.x) aperta('ArrowRight')
          else if (px > alvo.x) aperta('ArrowLeft')
          pecaVista = peca
        } catch (e) {}
      }, 140)
    }
  }
})()

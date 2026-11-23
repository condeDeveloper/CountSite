// CondeClub (22/11/2026): janela do jogo, chat de IA de demonstração e código colorido
// no tema de cada linguagem. Usado na página de vendas e nas páginas de projeto.
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/assets\/clube\/clube\.js.*$/, '')

  /* ---------- código colorido (tema de editor, por linguagem) ---------- */
  var KW = {
    js: /^(const|let|var|function|return|if|else|for|while|of|in|new|true|false|null|undefined|class|async|await|try|catch)$/,
    java: /^(public|private|protected|class|static|final|void|int|long|double|boolean|char|new|return|if|else|for|while|import|true|false|null|this|extends|implements|var|switch|case|default|try|catch)$/,
    py: /^(def|return|if|elif|else|for|while|in|not|and|or|import|from|as|with|True|False|None|break|continue|try|except|class|lambda|pass)$/,
    cs: /^(using|var|new|if|else|for|foreach|in|while|return|static|string|int|decimal|double|bool|true|false|null|await|async|continue|break|switch|and|or|not)$/,
    sql: /^(create|table|integer|primary|key|text|real|insert|into|values|select|from|where|group|by|order|desc|asc|as|case|when|then|else|end|sum|round|and|or|not)$/i,
  }
  var CTL = /^(if|elif|else|for|foreach|while|return|of|in|import|from|using|break|continue|switch|case|default|try|catch|except)$/
  var COMENTARIO = { js: '\\/\\/[^\\n]*', java: '\\/\\/[^\\n]*', cs: '\\/\\/[^\\n]*', py: '#[^\\n]*', sql: '--[^\\n]*' }
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
  function pintaJava(cod) { return pintaJS(cod, 'java') }
  // Um tokenizador só pra JS, Java, Python, C# e SQL: muda a lista de palavras-chave e o jeito de comentar.
  function pintaJS(cod, lang) {
    lang = KW[lang] ? lang : 'js'
    var tipos = lang === 'java' || lang === 'cs'
    var re = new RegExp('(' + COMENTARIO[lang] + ")|('(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"|`(?:\\\\.|[^`\\\\])*`)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$À-ú][\\w$À-ú]*)(\\s*\\()?|(=>|===|!==|&&|\\|\\||[{}()[\\]])", 'g')
    var out = '', ult = 0, m
    while ((m = re.exec(cod))) {
      out += esc(cod.slice(ult, m.index)); ult = re.lastIndex
      if (m[1]) out += '<span class="c-com">' + esc(m[1]) + '</span>'
      else if (m[2]) out += '<span class="c-str">' + esc(m[2]) + '</span>'
      else if (m[3]) out += '<span class="c-num">' + m[3] + '</span>'
      else if (m[4]) {
        var cls = KW[lang].test(m[4]) ? (CTL.test(m[4].toLowerCase()) ? 'c-ctl' : 'c-kw') : m[5] ? 'c-fn' : /^[A-Z][A-Z0-9_]*$/.test(m[4]) ? 'c-const' : tipos && /^[A-Z]/.test(m[4]) ? 'c-tipo' : 'c-var'
        out += '<span class="' + cls + '">' + m[4] + '</span>' + (m[5] ? esc(m[5]) : '')
      } else out += '<span class="c-pun">' + esc(m[6]) + '</span>'
    }
    return out + esc(cod.slice(ult))
  }
  // Uma passada só: tag, atributo="valor" e fechamento. O resto é texto.
  function pintaHTML(cod) {
    var re = /(<\/?)([a-zA-Z!][\w-]*)|([a-zA-Z-]+)=("[^"]*")|(\/?>)/g
    var out = '', ult = 0, m
    while ((m = re.exec(cod))) {
      out += esc(cod.slice(ult, m.index)); ult = re.lastIndex
      if (m[2]) out += '<span class="c-pun">' + esc(m[1]) + '</span><span class="c-tag">' + m[2] + '</span>'
      else if (m[3]) out += '<span class="c-attr">' + m[3] + '</span>=<span class="c-str">' + esc(m[4]) + '</span>'
      else out += '<span class="c-pun">' + esc(m[5]) + '</span>'
    }
    return out + esc(cod.slice(ult))
  }
  function pinta(el) {
    var lang = el.getAttribute('data-lang')
    var cod = el.textContent
    el.innerHTML = lang === 'html' || lang === 'xml' ? pintaHTML(cod) : pintaJS(cod, lang)
  }
  document.querySelectorAll('code[data-lang]').forEach(pinta)

  /* ---------- copiar código ---------- */
  document.querySelectorAll('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = document.getElementById(b.getAttribute('data-copiar')).textContent
      var ok = function () { b.textContent = 'Copiado ✓'; setTimeout(function () { b.textContent = 'Copiar' }, 1600) }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () { b.textContent = 'Segure no código pra copiar' })
      else b.textContent = 'Segure no código pra copiar'
    })
  })

  /* ---------- o jogo roda no lugar da capa (sem janela por cima) ---------- */
  document.querySelectorAll('[data-jogo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = BASE + b.getAttribute('data-jogo') + '?auto=1'
      var altura = b.getAttribute('data-altura') || (/blocos/.test(src) ? '680' : '560')
      var caixa = document.createElement('div')
      caixa.className = 'jogo-inline'
      caixa.innerHTML = '<button type="button" class="jogo-inline__fechar">✕ Fechar</button><iframe title="' + (b.getAttribute('data-titulo') || 'Jogo') + '" style="height:' + altura + 'px" src="' + src + '"></iframe>'
      b.replaceWith(caixa)
      caixa.querySelector('iframe').focus()
      caixa.querySelector('.jogo-inline__fechar').addEventListener('click', function () { caixa.replaceWith(b) })
    })
  })

  /* ---------- chat de IA (demonstração: roteiro fixo, sem IA de verdade) ---------- */
  var PEDIDOS = {
    cobrinha: {
      pedido: 'Faz o jogo da cobrinha em JavaScript puro, num canvas de 400 por 400. A cobra cresce quando come e o jogo acaba se bater na parede ou nela mesma.',
      arquivo: 'cobrinha.js', titulo: 'Jogo da cobrinha',
      resposta: 'Pronto, fiz! 🐍 O jogo da cobrinha em <b>36 linhas de JavaScript</b>, sem biblioteca nenhuma. O truque: a cobra é só uma lista. A cada passo entra uma cabeça na frente e sai o rabo; quando ela come, o rabo fica e ela cresce. Aqui está o <b>cobrinha.js</b>:',
      confere: 'Agora o pulo do gato: aperta a seta contrária enquanto ela anda. Ela morre na hora. A IA não te avisou, né? No clube você aprende a achar isso e a pedir a correção certa.',
    },
    pomodoro: {
      pedido: 'Faz um timer Pomodoro em Java, com janela: 25 minutos de foco e 5 de pausa, botão de iniciar e pausar, e um contador de ciclos.',
      arquivo: 'Pomodoro.java', titulo: 'Pomodoro em Java', lang: 'java', rodando: 'Tá aqui, a janela do programa rodando. Toca em <b>Iniciar</b>:',
      resposta: 'Pronto, fiz! 🍅 Um Pomodoro em <b>Java</b>, com janela de verdade (Swing). O segredo: um <b>Timer</b> que tira 1 segundo por vez; quando chega no zero, troca entre foco e pausa e conta mais um ciclo. Aqui está o <b>Pomodoro.java</b>:',
    },
  }
  var ETAPAS = ['Pensando no jogo', 'Escrevendo o código', 'Conferindo as regras', 'Quase lá']
  document.querySelectorAll('[data-iachat]').forEach(function (chat) {
    var msgs = chat.querySelector('[data-msgs]'), sug = chat.querySelector('[data-sugestoes]')
    var ocupado = false
    var pedidosOriginais = sug.innerHTML
    function rola() { msgs.scrollTop = msgs.scrollHeight }
    function bolha(cls, html) { var d = document.createElement('div'); d.className = 'iachat__msg ' + cls; d.innerHTML = html; msgs.appendChild(d); rola(); return d }
    function espera(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

    // 1) o pedido → "Fazendo..." por uns 5 s → resposta + código
    sug.addEventListener('click', function (e) {
      var mostra = e.target.closest('[data-mostra]')
      if (mostra) return mostraJogo(mostra.getAttribute('data-mostra'))
      var b = e.target.closest('[data-pedido]')
      if (!b || ocupado) return
      ocupado = true
      var slug = b.getAttribute('data-pedido'), p = PEDIDOS[slug]
      sug.hidden = true
      bolha('iachat__msg--eu', esc(p.pedido))
      var faz = bolha('iachat__msg--ia', '<span class="iachat__fazendo">Fazendo<i>.</i><i>.</i><i>.</i></span><small class="iachat__etapa">' + ETAPAS[0] + '</small>')
      var etapa = faz.querySelector('.iachat__etapa'), k = 0
      var troca = setInterval(function () { k = Math.min(k + 1, ETAPAS.length - 1); etapa.textContent = ETAPAS[k] }, 1300)
      var codigo = ''
      fetch(BASE + 'projetos/jogos/' + slug + '/' + p.arquivo).then(function (r) { return r.text() }).catch(function () { return '' }).then(function (txt) {
        codigo = txt.replace(/\s+$/, '')
        return espera(5000)
      }).then(function () {
        clearInterval(troca)
        faz.innerHTML = p.resposta
        rola()
        return espera(700)
      }).then(function () {
        var lang = p.lang || 'js'
        var bloco = bolha('iachat__msg--codigo', '<div class="codigo codigo--' + lang + '"><div class="codigo__topo">' + p.arquivo + '</div><pre><code></code></pre></div>')
        var alvo = bloco.querySelector('code'), linhas = codigo.split('\n'), i = 0
        return new Promise(function (ok) {
          var t = setInterval(function () {
            i += 1
            alvo.innerHTML = (lang === 'java' ? pintaJava : pintaJS)(linhas.slice(0, i).join('\n'))
            alvo.parentNode.scrollTop = alvo.parentNode.scrollHeight
            rola()
            if (i >= linhas.length) { clearInterval(t); ok() }
          }, 55)
        })
      }).then(function () { return espera(500) }).then(function () {
        bolha('iachat__msg--ia', 'Quer ver funcionando?')
        sug.innerHTML = '<button type="button" class="iachat__mostra" data-mostra="' + slug + '">▶ Mostra pra mim</button>'
        sug.hidden = false
        rola()
      })
    })

    // 2) "Mostra pra mim" → o jogo rodando → o que conferir → botão do clube
    function mostraJogo(slug) {
      var p = PEDIDOS[slug]
      sug.hidden = true
      bolha('iachat__msg--eu', 'Mostra pra mim')
      var faz = bolha('iachat__msg--ia', '<span class="iachat__fazendo">Abrindo<i>.</i><i>.</i><i>.</i></span>')
      espera(1200).then(function () {
        faz.innerHTML = p.rodando || 'Tá aqui, rodando de verdade. Toca em <b>▶ Jogar</b>:'
        // Primeiro o rodapé (botão do clube e "pedir outro"), depois mede o espaço que sobrou.
        sug.innerHTML = '<a class="btn btn--primary iachat__cta" href="#plano-anual" data-analytics="ver_planos chat_ia">Quero aprender isso</a><button type="button" class="iachat__denovo">Pedir outro</button>'
        sug.hidden = false
        sug.querySelector('.iachat__denovo').addEventListener('click', function () { sug.innerHTML = pedidosOriginais })
        // O botão só desce até os planos: o clique em assinar é contado nos botões dos cartões.
        // O jogo ocupa a área da conversa inteira (o chat não muda de tamanho) e fica todo à vista.
        var altura = Math.max(300, msgs.clientHeight - 20)
        bolha('iachat__msg--jogo', '<iframe title="' + p.titulo + '" src="' + BASE + 'projetos/jogos/' + slug + '/" class="iachat__frame" style="height:' + altura + 'px"></iframe>')
        msgs.scrollTop = msgs.scrollHeight
        ocupado = false
      })
    }
  })
})()

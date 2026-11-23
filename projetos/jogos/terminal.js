// Terminal das demonstrações: escreve linhas, "digita" devagar e pergunta (como o input() / Scanner / ReadLine).
// Não foca o campo sozinho ao abrir: foco automático dentro de iframe faz a página de fora rolar.
window.Terminal = function (raiz) {
  const tela = raiz.querySelector('.term-saida')
  const linha = raiz.querySelector('.term-entrada')
  const campo = linha.querySelector('input')
  const rotulo = linha.querySelector('.term-rotulo')
  const enviar = linha.querySelector('button')
  let interagiu = false
  raiz.addEventListener('pointerdown', () => { interagiu = true })
  const espera = (ms) => new Promise((r) => setTimeout(r, ms))
  const desce = () => { tela.scrollTop = tela.scrollHeight }

  function escreve(texto, cls) {
    const d = document.createElement('div')
    d.className = 'term-linha ' + (cls || '')
    d.textContent = texto
    tela.appendChild(d)
    desce()
    return d
  }

  async function digita(texto, cls, ms = 16) {
    const d = escreve('', cls)
    for (const ch of texto) {
      d.textContent += ch
      desce()
      await espera(ms)
    }
    return d
  }

  let resolver = null
  function responde(valor) {
    if (!resolver) return
    const ok = resolver
    resolver = null
    escreve(rotulo.textContent + valor, 'eco')
    linha.hidden = true
    ok(valor)
  }
  campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); responde(campo.value) } })
  if (enviar) enviar.addEventListener('click', () => responde(campo.value))

  function pergunta(texto) {
    rotulo.textContent = texto
    campo.value = ''
    linha.hidden = false
    desce()
    if (interagiu) campo.focus({ preventScroll: true })
    return new Promise((ok) => { resolver = ok })
  }

  return { escreve, digita, pergunta, responde, espera, limpa: () => { tela.innerHTML = '' } }
}

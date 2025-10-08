let nomes = []
let anguloAtual = 0
let rodando = false

function adicionarNome() {
    let input = document.getElementById("nome")
    let nome = input.value.trim()
    let lista = document.getElementById("lista-nomes")

    if (nome === "") {
        alert("Digite um nome válido!")
        return
    }

    if (!nomes.includes(nome)) {
        nomes.push(nome)

        let li = document.createElement("li")
        li.textContent = nome
        lista.appendChild(li)

        desenharRoleta()
    } else {
        alert("Nome já adicionado!")
    }

    input.value = ""
}

function desenharRoleta() {
    let canvas = document.getElementById("roleta")
    let ctx = canvas.getContext("2d")
    let total = nomes.length
    if (total === 0) return

    let raio = canvas.width / 2
    let centroX = canvas.width / 2
    let centroY = canvas.height / 2
    let anguloPorSetor = (2 * Math.PI) / total

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.lineWidth = 2
    ctx.strokeStyle = "black"

    for (let i = 0; i < total; i++) {
        let anguloInicial = i * anguloPorSetor + anguloAtual
        let anguloFinal = (i + 1) * anguloPorSetor + anguloAtual

            ctx.fillStyle = i % 2 === 0 ? "#00aeff" : "#a93be9"

        ctx.beginPath()
        ctx.moveTo(centroX, centroY)
        ctx.arc(centroX, centroY, raio, anguloInicial, anguloFinal)
        ctx.lineTo(centroX, centroY)
        ctx.closePath()

        ctx.fill()
        ctx.stroke()

        // Melhor ajuste do tamanho da fonte
        ctx.font = `${Math.min(20, Math.max(12, 180 / total))}px Arial`
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        let anguloTexto = anguloInicial + anguloPorSetor / 2
        let textoX = centroX + raio * 0.7 * Math.cos(anguloTexto)
        let textoY = centroY + raio * 0.7 * Math.sin(anguloTexto)

        ctx.fillText(nomes[i], textoX, textoY)
    }

    desenharSeta()
}

function desenharSeta() {
    let canvas = document.getElementById("roleta")
    let ctx = canvas.getContext("2d")
    let centroX = canvas.width / 0
    let tamanhoSeta = 15

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.moveTo(centroX - tamanhoSeta, 30)
    ctx.lineTo(centroX + tamanhoSeta, 10)
    ctx.lineTo(centroX, 30)
    ctx.closePath()
    ctx.fill()
}
function sortear() {
    resultado.textContent = "🎉 Sorteado: 🎉"
    if (nomes.length === 0) {
        alert("Adicione nomes antes de sortear!")
        return
    
    }

    if (rodando) return
    rodando = true

    let total = nomes.length
    let anguloPorSetor = (2 * Math.PI) / total

    // Sorteio de um índice aleatório
    let indiceSorteado = Math.floor(Math.random() * total)

    // Calculando o ângulo alvo para que o índice sorteado fique na posição do ponteiro
    let anguloDestino =
        Math.PI / 2 - indiceSorteado * anguloPorSetor - anguloPorSetor / 2

    // Adicionando voltas extras para o efeito de rotação
    let voltasExtras = Math.PI * 10 // 5 voltas completas
    let anguloFinal = anguloDestino + voltasExtras

    let velocidade = Math.random() * (0.9 - 0.4) + 0.4 // Velocidade inicial da rotação
    let desaceleracao = 0.98 // Taxa de desaceleração

    function animar() {
        if (velocidade <= 0.001) {
            rodando = false

            // Normaliza o ângulo final entre 0 e 2*PI

            anguloAtual =
                ((anguloAtual % (2 * Math.PI)) - 2 * Math.PI) % (2 * Math.PI)

            // Determina o índice do nome baseado na posição final da roleta
            let indiceFinal =
                Math.floor(
                    (2 * Math.PI - anguloAtual - Math.PI / 2) / anguloPorSetor
                ) % total
            // **Inverter o resultado** para pegar o oposto na roleta

            desenharRoleta()

            // Exibir o nome sorteado invertido
            let resultado = document.getElementById("resultado")
            resultado.textContent = `🎉 Sorteado: ${nomes[indiceFinal]} 🎉`
            resultado.style.fontWeight = "bold"
            resultado.style.fontSize = "20px"
            resultado.style.color = "black"

            return
        }

        anguloAtual += velocidade // Atualizando o ângulo atual da roleta
        velocidade *= desaceleracao // Aplicando a desaceleração para suavizar a rotação

        desenharRoleta() // Desenhando a roleta novamente no canvas
        requestAnimationFrame(animar) // Chamando a função recursivamente para a animação contínua
    }

    animar() // Iniciando a animação da roleta
}

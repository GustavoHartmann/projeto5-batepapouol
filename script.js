let nome = "";
const statusCode400 = 400;
const statusCode404 = 404;

function perguntarNome() {
    nome = prompt("Qual o seu nome?");
    enviarNome();
}

perguntarNome();

function enviarNome() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {
        name: nome
    });
    
    promessa.then(carregarMensagens);
    promessa.catch(tratarErroNome);

}

function carregarMensagens(resposta) {
    //console.log(resposta.data);
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promessa.then(imprimirMensagens);
    promessa.catch(tratarErroMensagensRecebidas);
}

const idMensagens = setInterval(carregarMensagens, 3000)

function tratarErroNome(erro) {
    tratarErro404(erro);
    if(erro.response.status == statusCode400) {
        alert("O nome escolhido já está sendo usado, por favor escolha outro");
        perguntarNome();
    }

}

function tratarErro404(erro) {
    if(erro.response.status == statusCode404) {
        alert("API inválida");
    }
}

function manterConexao() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
        name: nome
      })

      promessa.then(continuaConectado);
      promessa.catch(desconectou);
}

function continuaConectado() {
    console.log("ainda to on");
}

function desconectou() {
    console.log("desconectou");
    clearInterval(idConexao);
}

const idConexao = setInterval(manterConexao, 5000);

function imprimirMensagens(resposta) {
    const mensagens = document.querySelector(".mensagens");
    const arrayMensagens = resposta.data;
    for(let i = 0; i < arrayMensagens.length; i++) {
        if(arrayMensagens[i].type === "status") {
            mensagens.innerHTML += `
            <div class="mensagem ${arrayMensagens[i].type}">
                <h1 class="tempo">(${arrayMensagens[i].time})</h1>
                <p><b>${arrayMensagens[i].from}</b> ${arrayMensagens[i].text}</p>
            </div>
            `
        } if(arrayMensagens[i].type === "message") {
            mensagens.innerHTML += `
            <div class="mensagem ${arrayMensagens[i].type}">
                <h1 class="tempo">(${arrayMensagens[i].time})</h1>
                <p><b>${arrayMensagens[i].from}</b> para <b>${arrayMensagens[i].to}</b>: ${arrayMensagens[i].text}</p>
            </div>
            `
        } if(arrayMensagens[i].type === "private_message" && arrayMensagens[i].to === nome) {
            mensagens.innerHTML += `
            <div class="mensagem ${arrayMensagens[i].type}">
                <h1 class="tempo">(${arrayMensagens[i].time})</h1>
                <p><b>${arrayMensagens[i].from}</b> reservadamente para <b>${arrayMensagens[i].to}</b>: ${arrayMensagens[i].text}</p>
            </div>
            `
        }
    }
    const ultimaMensagem = document.querySelector(".mensagem:last-child");
    ultimaMensagem.scrollIntoView();
}

function tratarErroMensagensRecebidas(erro) {
    tratarErro404(erro);
    if(erro.response.status == statusCode400) {
        prompt("Algo de errado aconteceu");
    }
}

function enviarMensagem() {
    const mensagemDigitada = document.querySelector("input").value;
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
        from: nome,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    });
    promessa.then(imprimirMensagens);
    promessa.catch(tratarErroMensagensEnviada);
}

function tratarErroMensagensEnviada(erro) {
    tratarErro404(erro);
    if(erro.response.status == statusCode400) {
        prompt("Não foi possível enviar a mensagem pois você foi desconectado");
        window.location.reload();
    }
}
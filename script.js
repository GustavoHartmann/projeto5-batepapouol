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
    console.log(resposta.data);
}

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
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
        name: nome
      })
      console.log("ainda to on");
}

const idConexao = setInterval(manterConexao, 5000);

function imprimirMensagens() {

}
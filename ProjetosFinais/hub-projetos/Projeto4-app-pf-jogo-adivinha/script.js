// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
let numeroSecreto = gerarNumeroAleatorio();
let tentativas = [];
let tentativasRestantes = 10;

document.addEventListener("DOMContentLoaded", () => {
  atualizarTentativasRestantes();
  atualizarHistorico();
});

function gerarNumeroAleatorio() {
  return Math.floor(Math.random() * 100) + 1;
}

function tentarChute() {
  const input = document.getElementById("chute");
  const mensagem = document.getElementById("mensagem");
  const valor = parseInt(input.value.trim());

  if (isNaN(valor) || valor < 1 || valor > 100) {
    alert("Digite um número entre 1 e 100.");
    return;
  }

  if (tentativasRestantes <= 0) {
    alert("Você atingiu o limite de tentativas!");
    return;
  }

  const resultado = valor === numeroSecreto ? "Acertou" : valor > numeroSecreto ? "Menor" : "Maior";

  mensagem.textContent = resultado === "Acertou"
    ? `Parabéns! Você acertou!`
    : `Tente um número ${resultado.toLowerCase()}.`;

  tentativas.push({
    id: Date.now(),
    chute: valor,
    resultado
  });

  tentativasRestantes--;
  atualizarTentativasRestantes();
  salvarHistorico();
  atualizarHistorico();

  if (resultado === "Acertou" || tentativasRestantes === 0) {
    setTimeout(() => {
      alert("O jogo será reiniciado.");
      reiniciarJogo();
    }, 1000);
  }

  input.value = "";
}

function atualizarTentativasRestantes() {
  document.getElementById("tentativas-restantes").textContent = tentativasRestantes;
}

function salvarHistorico() {
  localStorage.setItem("historicoTentativas", JSON.stringify(tentativas));
}

function carregarHistorico() {
  return JSON.parse(localStorage.getItem("historicoTentativas")) || [];
}

function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  const historico = carregarHistorico();

  historico.forEach(tentativa => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatarNumero(tentativa.chute)}</td>
      <td>${tentativa.resultado}</td>
      <td>
        <button onclick="detalharTentativa(${tentativa.id})">Detalhes</button>
        <button onclick="editarTentativa(${tentativa.id})">Editar</button>
        <button onclick="excluirTentativa(${tentativa.id})">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function detalharTentativa(id) {
  const tentativa = tentativas.find(t => t.id === id);
  alert(`Chute: ${tentativa.chute}\nResultado: ${tentativa.resultado}`);
}

function editarTentativa(id) {
  const nova = prompt("Novo chute entre 1 e 100:");
  const valor = parseInt(nova);

  if (isNaN(valor) || valor < 1 || valor > 100) {
    alert("Valor inválido.");
    return;
  }

  const tentativa = tentativas.find(t => t.id === id);
  tentativa.chute = valor;
  tentativa.resultado = valor === numeroSecreto ? "Acertou" : valor > numeroSecreto ? "Menor" : "Maior";

  salvarHistorico();
  atualizarHistorico();
}

function excluirTentativa(id) {
  tentativas = tentativas.filter(t => t.id !== id);
  salvarHistorico();
  atualizarHistorico();
}

function formatarNumero(n) {
  return n.toString().padStart(2, "0");
}

function reiniciarJogo() {
  numeroSecreto = gerarNumeroAleatorio();
  tentativas = [];
  tentativasRestantes = 10;
  salvarHistorico();
  atualizarTentativasRestantes();
  atualizarHistorico();
  document.getElementById("mensagem").textContent = "";
  document.getElementById("chute").value = "";
}

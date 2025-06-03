// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
let historico = JSON.parse(localStorage.getItem("historicoSenhas")) || [];

document.addEventListener("DOMContentLoaded", () => {
  atualizarHistorico();
});

function gerarSenha() {
  const tamanho = parseInt(document.getElementById("tamanho").value);
  const usarLetras = document.getElementById("letras").checked;
  const usarNumeros = document.getElementById("numeros").checked;
  const usarSimbolos = document.getElementById("simbolos").checked;

  if (isNaN(tamanho) || tamanho < 4 || tamanho > 20) {
    alert("Escolha um tamanho entre 4 e 20 caracteres.");
    return;
  }

  if (!usarLetras && !usarNumeros && !usarSimbolos) {
    alert("Selecione ao menos um tipo de caractere.");
    return;
  }

  const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  const simbolos = "!@#$%^&*()_+[]{}<>?";

  let conjunto = "";
  if (usarLetras) conjunto += letras;
  if (usarNumeros) conjunto += numeros;
  if (usarSimbolos) conjunto += simbolos;

  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    const aleatorio = Math.floor(Math.random() * conjunto.length);
    senha += conjunto[aleatorio];
  }

  document.getElementById("senha-gerada").value = senha;

  const registro = {
    id: Date.now(),
    senha,
    tamanho
  };

  historico.push(registro);
  localStorage.setItem("historicoSenhas", JSON.stringify(historico));
  atualizarHistorico();
}

function copiarSenha() {
  const input = document.getElementById("senha-gerada");
  if (!input.value) {
    alert("Nenhuma senha gerada.");
    return;
  }

  input.select();
  document.execCommand("copy");
  alert("Senha copiada para a área de transferência!");
}

function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  historico.forEach(reg => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reg.senha}</td>
      <td>${reg.tamanho}</td>
      <td>
        <button onclick="detalhar(${reg.id})">Detalhes</button>
        <button onclick="editar(${reg.id})">Editar</button>
        <button onclick="excluir(${reg.id})">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function detalhar(id) {
  const reg = historico.find(r => r.id === id);
  alert(`Senha: ${reg.senha}\nTamanho: ${reg.tamanho} caracteres`);
}

function editar(id) {
  const novaSenha = prompt("Digite a nova senha:");
  if (novaSenha && novaSenha.length >= 4) {
    const reg = historico.find(r => r.id === id);
    reg.senha = novaSenha;
    reg.tamanho = novaSenha.length;
    localStorage.setItem("historicoSenhas", JSON.stringify(historico));
    atualizarHistorico();
  } else {
    alert("Senha inválida. Mínimo de 4 caracteres.");
  }
}

function excluir(id) {
  historico = historico.filter(r => r.id !== id);
  localStorage.setItem("historicoSenhas", JSON.stringify(historico));
  atualizarHistorico();
}

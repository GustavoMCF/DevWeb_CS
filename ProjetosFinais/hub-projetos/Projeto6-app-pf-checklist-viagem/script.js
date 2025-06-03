// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
let lista = [];
let historico = JSON.parse(localStorage.getItem("historicoViagem")) || [];

document.addEventListener("DOMContentLoaded", () => {
  atualizarLista();
  atualizarHistorico();
});

function adicionarItem() {
  const input = document.getElementById("item");
  const nome = input.value.trim();

  if (nome.length < 2) {
    alert("O nome do item deve ter pelo menos 2 caracteres.");
    return;
  }

  if (lista.some(i => i.nome.toLowerCase() === nome.toLowerCase())) {
    alert("Este item já está na lista.");
    return;
  }

  lista.push({
    id: Date.now(),
    nome,
    pronto: false
  });

  input.value = "";
  atualizarLista();
}

function atualizarLista() {
  const ul = document.getElementById("lista-itens");
  ul.innerHTML = "";

  lista.forEach(item => {
    const li = document.createElement("li");
    li.className = item.pronto ? "pronto" : "pendente";

    li.innerHTML = `
      <span onclick="alternarStatus(${item.id})">${item.pronto ? "✔️" : "❌"} ${item.nome}</span>
      <button class="remover" onclick="removerItem(${item.id})">Remover</button>
      <button class="salvar" onclick="salvarChecklist()">Salvar</button>
    `;

    ul.appendChild(li);
  });
}

function alternarStatus(id) {
  const item = lista.find(i => i.id === id);
  if (item) {
    item.pronto = !item.pronto;
    atualizarLista();
  }
}

function removerItem(id) {
  lista = lista.filter(i => i.id !== id);
  atualizarLista();
}

function salvarChecklist() {
  if (lista.length === 0) {
    alert("Não é possível salvar uma checklist vazia.");
    return;
  }

  const data = new Date().toLocaleString("pt-BR");
  const itensFormatados = lista.map(i => `${i.pronto ? "✔️" : "❌"} ${i.nome}`).join(", ");

  const registro = {
    id: Date.now(),
    data,
    itens: itensFormatados
  };

  historico.push(registro);
  localStorage.setItem("historicoViagem", JSON.stringify(historico));

  lista = [];
  atualizarLista();
  atualizarHistorico();
}

function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  historico.forEach(reg => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reg.data}</td>
      <td>${reg.itens}</td>
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
  alert(`Data: ${reg.data}\nItens:\n${reg.itens}`);
}

function editar(id) {
  const novoTexto = prompt("Edite os itens salvos (ex: ✔️ Passaporte, ❌ Escova):");
  if (novoTexto && novoTexto.trim().length > 0) {
    const reg = historico.find(r => r.id === id);
    reg.itens = novoTexto.trim();
    localStorage.setItem("historicoViagem", JSON.stringify(historico));
    atualizarHistorico();
  }
}

function excluir(id) {
  historico = historico.filter(r => r.id !== id);
  localStorage.setItem("historicoViagem", JSON.stringify(historico));
  atualizarHistorico();
}

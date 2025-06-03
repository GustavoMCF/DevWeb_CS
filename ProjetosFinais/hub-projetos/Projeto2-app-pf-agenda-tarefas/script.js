// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
const diasSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || {};

document.addEventListener("DOMContentLoaded", () => {
  diasSemana.forEach(dia => renderizarLista(dia));
  atualizarTabela();
});

// Adiciona tarefa
function adicionarTarefa(dia) {
  const input = document.querySelector(`[data-dia="${dia}"] input`);
  const texto = input.value.trim();

  if (!texto) {
    alert("A tarefa não pode estar vazia.");
    return;
  }

  if (!tarefas[dia]) tarefas[dia] = [];

  if (tarefas[dia].length >= 5) {
    alert("Limite de 5 tarefas por dia atingido.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto,
    feito: false
  };

  tarefas[dia].push(novaTarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  input.value = "";
  renderizarLista(dia);
  atualizarTabela();
}

// Renderiza lista do dia
function renderizarLista(dia) {
  const ul = document.getElementById(`lista-${dia}`);
  ul.innerHTML = "";

  if (!tarefas[dia]) return;

  tarefas[dia].forEach(tarefa => {
    const li = document.createElement("li");
    li.className = tarefa.feito ? "feita" : "";
    li.innerHTML = `
      <span onclick="alternarFeito('${dia}', ${tarefa.id})">${tarefa.texto}</span>
      <button onclick="removerTarefa('${dia}', ${tarefa.id})">🗑</button>
    `;
    ul.appendChild(li);
  });
}

// Alterna tarefa feita
function alternarFeito(dia, id) {
  const lista = tarefas[dia];
  const tarefa = lista.find(t => t.id === id);
  tarefa.feito = !tarefa.feito;
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarLista(dia);
  atualizarTabela();
}

// Remove tarefa
function removerTarefa(dia, id) {
  tarefas[dia] = tarefas[dia].filter(t => t.id !== id);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarLista(dia);
  atualizarTabela();
}

// Atualiza a tabela geral
function atualizarTabela() {
  const tbody = document.querySelector("#tabela-tarefas tbody");
  tbody.innerHTML = "";

  diasSemana.forEach(dia => {
    if (!tarefas[dia]) return;

    tarefas[dia].forEach(tarefa => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${capitalizar(dia)}</td>
        <td>${tarefa.texto}</td>
        <td>${tarefa.feito ? "Feita" : "Pendente"}</td>
        <td>
          <button onclick="detalharTarefa('${dia}', ${tarefa.id})">Detalhes</button>
          <button onclick="editarTarefa('${dia}', ${tarefa.id})">Editar</button>
          <button onclick="removerTarefa('${dia}', ${tarefa.id})">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  });
}

// Função para mostrar detalhes da tarefa
function detalharTarefa(dia, id) {
  const tarefa = tarefas[dia].find(t => t.id === id);
  if (tarefa) {
    alert(`Dia: ${capitalizar(dia)}\nTarefa: ${tarefa.texto}\nStatus: ${tarefa.feito ? "Feita" : "Pendente"}`);
  }
}

// Editar tarefa (substitui o texto atual)
function editarTarefa(dia, id) {
  const novaTarefa = prompt("Digite o novo texto da tarefa:");
  if (novaTarefa && novaTarefa.trim()) {
    const tarefa = tarefas[dia].find(t => t.id === id);
    tarefa.texto = novaTarefa.trim();
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    renderizarLista(dia);
    atualizarTabela();
  }
}

// Função para deixar os nomes bonitos
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

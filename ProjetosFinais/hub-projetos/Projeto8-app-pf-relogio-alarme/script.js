// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
let historico = JSON.parse(localStorage.getItem("historicoAlarmes")) || [];
let alarmeAtivo = null;
let audio = document.getElementById("som-alarme");

// Atualiza o relógio em tempo real
setInterval(() => {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");
  const segundos = String(agora.getSeconds()).padStart(2, "0");

  const horarioAtual = `${horas}:${minutos}:${segundos}`;
  document.getElementById("relogio").textContent = horarioAtual;

  if (alarmeAtivo && `${horas}:${minutos}` === alarmeAtivo) {
    dispararAlarme();
  }
}, 1000);

// Máscara para input do horário (hh:mm)
document.getElementById("alarme").addEventListener("input", function () {
  this.value = this.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1:$2")
    .slice(0, 5);
});

// Ativa alarme
function definirAlarme() {
  const input = document.getElementById("alarme");
  const valor = input.value.trim();

  if (!/^\d{2}:\d{2}$/.test(valor)) {
    alert("Informe um horário válido no formato hh:mm.");
    return;
  }

  const [h, m] = valor.split(":").map(Number);
  const agora = new Date();
  const alvo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), h, m);

  if (alvo <= agora) {
    alert("Não é possível definir um alarme para o passado.");
    return;
  }

  alarmeAtivo = valor;
  alert(`Alarme definido para ${valor}.`);
  input.value = "";
}

// Disparo do alarme
function dispararAlarme() {
  document.getElementById("relogio-container").classList.add("alerta-visual");
  audio.play();

  const horarioDisparo = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

  const registro = {
    id: Date.now(),
    horario: horarioDisparo,
    status: "Disparado"
  };

  historico.push(registro);
  localStorage.setItem("historicoAlarmes", JSON.stringify(historico));
  atualizarHistorico();

  // Para o som e remove alerta depois de 10 segundos
  setTimeout(() => {
    document.getElementById("relogio-container").classList.remove("alerta-visual");
    audio.pause();
    audio.currentTime = 0;
    alarmeAtivo = null;
  }, 10000);
}

// Atualiza a tabela do histórico
function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  historico.forEach(reg => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reg.horario}</td>
      <td>${reg.status}</td>
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
  alert(`Horário do alarme: ${reg.horario}\nStatus: ${reg.status}`);
}

function editar(id) {
  const novoHorario = prompt("Digite o novo horário (hh:mm):");
  if (!novoHorario || !/^\d{2}:\d{2}$/.test(novoHorario)) {
    alert("Horário inválido.");
    return;
  }

  const reg = historico.find(r => r.id === id);
  reg.horario = novoHorario;
  reg.status = "Editado";
  localStorage.setItem("historicoAlarmes", JSON.stringify(historico));
  atualizarHistorico();
}

function excluir(id) {
  historico = historico.filter(r => r.id !== id);
  localStorage.setItem("historicoAlarmes", JSON.stringify(historico));
  atualizarHistorico();
}

// Inicializa histórico ao carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarHistorico();
});

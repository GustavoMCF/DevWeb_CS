// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
let historico = JSON.parse(localStorage.getItem("historicoIdade")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("data-nascimento");

  // Máscara de data dd/mm/aaaa
  input.addEventListener("input", () => {
    input.value = input.value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 10);
  });

  atualizarHistorico();
});

function calcularIdade() {
  const input = document.getElementById("data-nascimento");
  const resultado = document.getElementById("resultado");
  const dataStr = input.value.trim();

  // Validação básica de formato
  if (!dataStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
    alert("Informe uma data no formato válido dd/mm/aaaa.");
    return;
  }

  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const nascimento = new Date(ano, mes - 1, dia);

  // Verificação de validade real da data
  if (
    nascimento.getDate() !== dia ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getFullYear() !== ano
  ) {
    alert("A data digitada não é uma data real.");
    return;
  }

  const hoje = new Date();
  if (nascimento > hoje) {
    alert("A data de nascimento não pode ser futura.");
    return;
  }

  const idade = calcularDiferenca(hoje, nascimento);
  const texto = `${idade.anos} anos, ${idade.meses} meses e ${idade.dias} dias`;

  resultado.textContent = texto;

  const registro = {
    id: Date.now(),
    dataNascimento: dataStr,
    resultado: texto
  };

  historico.push(registro);
  localStorage.setItem("historicoIdade", JSON.stringify(historico));
  atualizarHistorico();
  input.value = "";
}

function calcularDiferenca(dataAtual, dataNascimento) {
  let anos = dataAtual.getFullYear() - dataNascimento.getFullYear();
  let meses = dataAtual.getMonth() - dataNascimento.getMonth();
  let dias = dataAtual.getDate() - dataNascimento.getDate();

  if (dias < 0) {
    meses--;
    dias += new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0).getDate();
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  return { anos, meses, dias };
}

function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  historico.forEach(reg => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reg.dataNascimento}</td>
      <td>${reg.resultado}</td>
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
  alert(`Data de nascimento: ${reg.dataNascimento}\nResultado: ${reg.resultado}`);
}

function editar(id) {
  const novaData = prompt("Digite a nova data (dd/mm/aaaa):");
  if (!novaData || !/^\d{2}\/\d{2}\/\d{4}$/.test(novaData)) {
    alert("Data inválida.");
    return;
  }

  const [dia, mes, ano] = novaData.split("/").map(Number);
  const nova = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  if (
    nova.getDate() !== dia ||
    nova.getMonth() !== mes - 1 ||
    nova.getFullYear() !== ano
  ) {
    alert("A nova data digitada não é válida.");
    return;
  }

  if (nova > hoje) {
    alert("A data de nascimento não pode ser futura.");
    return;
  }

  const idade = calcularDiferenca(hoje, nova);
  const texto = `${idade.anos} anos, ${idade.meses} meses e ${idade.dias} dias`;

  const reg = historico.find(r => r.id === id);
  reg.dataNascimento = novaData;
  reg.resultado = texto;

  localStorage.setItem("historicoIdade", JSON.stringify(historico));
  atualizarHistorico();
}

function excluir(id) {
  historico = historico.filter(r => r.id !== id);
  localStorage.setItem("historicoIdade", JSON.stringify(historico));
  atualizarHistorico();
}

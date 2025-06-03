// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');

  const nome = document.getElementById('nome');
  const sobrenome = document.getElementById('sobrenome');
  const email = document.getElementById('email');
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const dataNascimento = document.getElementById('dataNascimento');
  const cep = document.getElementById('cep');
  const rua = document.getElementById('rua');
  const numero = document.getElementById('numero');
  const bairro = document.getElementById('bairro');
  const estado = document.getElementById('estado');

  // Máscara de CPF
  cpf.addEventListener('input', () => {
    cpf.value = cpf.value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  });

  // Máscara de telefone
  telefone.addEventListener('input', () => {
    telefone.value = telefone.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      .slice(0, 15);
  });

  // Máscara de data
  dataNascimento.addEventListener('input', () => {
    dataNascimento.value = dataNascimento.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  });

  // Validação do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (
      !nome.value.trim() ||
      !sobrenome.value.trim() ||
      !email.value.trim() ||
      !cpf.value.trim() ||
      !telefone.value.trim() ||
      !dataNascimento.value.trim() ||
      !cep.value.trim() ||
      !rua.value.trim() ||
      !numero.value.trim() ||
      !bairro.value.trim() ||
      !estado.value
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarEmail(email.value)) {
      alert('E-mail inválido.');
      return;
    }

    if (cpf.value.length !== 14) {
      alert('CPF deve ter o formato 000.000.000-00.');
      return;
    }

    if (!validarIdadeMinima(dataNascimento.value, 18)) {
      alert('O cliente deve ter pelo menos 18 anos.');
      return;
    }

    salvarCliente();
    form.reset();
  });
});

// Validações auxiliares
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarIdadeMinima(data, idadeMinima) {
  const [dia, mes, ano] = data.split('/');
  const nascimento = new Date(`${ano}-${mes}-${dia}`);
  const hoje = new Date();
  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  return (
    idade > idadeMinima ||
    (idade === idadeMinima && m >= 0 && hoje.getDate() >= nascimento.getDate())
  );
}

function salvarCliente() {
  const cliente = obterDadosDoFormulario();
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  cliente.id = Date.now(); // ID único
  clientes.push(cliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));
  atualizarTabela();
}

function obterDadosDoFormulario() {
  return {
    nome: document.getElementById('nome').value.trim(),
    sobrenome: document.getElementById('sobrenome').value.trim(),
    email: document.getElementById('email').value.trim(),
    cpf: document.getElementById('cpf').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    dataNascimento: document.getElementById('dataNascimento').value.trim(),
    endereco: {
      cep: document.getElementById('cep').value.trim(),
      rua: document.getElementById('rua').value.trim(),
      numero: document.getElementById('numero').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      estado: document.getElementById('estado').value
    }
  };
}

function visualizarDados() {
  atualizarTabela();
}

function atualizarTabela() {
  const tbody = document.querySelector('#tabela-clientes tbody');
  tbody.innerHTML = '';

  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  clientes.forEach((cliente) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${cliente.nome} ${cliente.sobrenome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.dataNascimento}</td>
      <td>
        <button onclick="detalharCliente(${cliente.id})">Detalhes</button>
        <button onclick="editarCliente(${cliente.id})">Editar</button>
        <button onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function detalharCliente(id) {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const cliente = clientes.find((c) => c.id === id);
  if (cliente) {
    alert(`
Nome: ${cliente.nome} ${cliente.sobrenome}
Email: ${cliente.email}
CPF: ${cliente.cpf}
Telefone: ${cliente.telefone}
Nascimento: ${cliente.dataNascimento}
Endereço: ${cliente.endereco.rua}, Nº ${cliente.endereco.numero}, ${cliente.endereco.bairro}, ${cliente.endereco.estado}
CEP: ${cliente.endereco.cep}`);
  }
}

function editarCliente(id) {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return;

  // Preencher formulário
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('sobrenome').value = cliente.sobrenome;
  document.getElementById('email').value = cliente.email;
  document.getElementById('cpf').value = cliente.cpf;
  document.getElementById('telefone').value = cliente.telefone;
  document.getElementById('dataNascimento').value = cliente.dataNascimento;
  document.getElementById('cep').value = cliente.endereco.cep;
  document.getElementById('rua').value = cliente.endereco.rua;
  document.getElementById('numero').value = cliente.endereco.numero;
  document.getElementById('bairro').value = cliente.endereco.bairro;
  document.getElementById('estado').value = cliente.endereco.estado;

  excluirCliente(id); // remove temporariamente para poder salvar como novo depois
}

function excluirCliente(id) {
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  clientes = clientes.filter((c) => c.id !== id);
  localStorage.setItem('clientes', JSON.stringify(clientes));
  atualizarTabela();
}

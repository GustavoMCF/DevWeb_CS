// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
const produtos = [
  { id: 1, nome: "Camiseta", preco: 49.9 },
  { id: 2, nome: "Calça", preco: 89.9 },
  { id: 3, nome: "Tênis", preco: 199.9 }
];

let carrinho = [];
let historico = JSON.parse(localStorage.getItem("historicoCompras")) || [];

document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrinho();
  atualizarHistorico();
});

// Adiciona item ao carrinho
function adicionarAoCarrinho(id) {
  const item = produtos.find(p => p.id === id);

  const itemNoCarrinho = carrinho.find(i => i.id === id);
  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

  if (totalItens >= 10) {
    alert("Limite de 10 itens no carrinho atingido.");
    return;
  }

  if (itemNoCarrinho) {
    itemNoCarrinho.quantidade += 1;
  } else {
    carrinho.push({ ...item, quantidade: 1 });
  }

  atualizarCarrinho();
}

// Atualiza a lista do carrinho
function atualizarCarrinho() {
  const ul = document.getElementById("lista-carrinho");
  const totalItens = document.getElementById("total-itens");
  const totalValor = document.getElementById("total-valor");

  ul.innerHTML = "";

  let total = 0;
  let qtdTotal = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    qtdTotal += item.quantidade;

    const li = document.createElement("li");
    li.innerHTML = `${item.nome} (x${item.quantidade}) - ${formatarPreco(subtotal)}`;
    ul.appendChild(li);
  });

  totalItens.textContent = qtdTotal;
  totalValor.textContent = formatarPreco(total);
}

// Finaliza a compra
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio. Adicione itens antes de finalizar.");
    return;
  }

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const itens = carrinho.map(item => `${item.nome} (x${item.quantidade})`).join(", ");

  const compra = {
    id: Date.now(),
    data: new Date().toLocaleString("pt-BR"),
    itens,
    total
  };

  historico.push(compra);
  localStorage.setItem("historicoCompras", JSON.stringify(historico));

  carrinho = [];
  atualizarCarrinho();
  atualizarHistorico();
}

// Atualiza a tabela de histórico
function atualizarHistorico() {
  const tbody = document.getElementById("tabela-historico");
  tbody.innerHTML = "";

  historico.forEach(compra => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${compra.data}</td>
      <td>${compra.itens}</td>
      <td>${formatarPreco(compra.total)}</td>
      <td>
        <button onclick="detalharCompra(${compra.id})">Detalhes</button>
        <button onclick="editarCompra(${compra.id})">Editar</button>
        <button onclick="excluirCompra(${compra.id})">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Formata R$ 0,00
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Detalhes
function detalharCompra(id) {
  const compra = historico.find(c => c.id === id);
  alert(`Data: ${compra.data}\nItens: ${compra.itens}\nTotal: ${formatarPreco(compra.total)}`);
}

// Editar (só o campo de itens)
function editarCompra(id) {
  const novaDescricao = prompt("Edite os itens da compra:");
  if (novaDescricao && novaDescricao.trim()) {
    const compra = historico.find(c => c.id === id);
    compra.itens = novaDescricao.trim();
    localStorage.setItem("historicoCompras", JSON.stringify(historico));
    atualizarHistorico();
  }
}

// Excluir
function excluirCompra(id) {
  historico = historico.filter(c => c.id !== id);
  localStorage.setItem("historicoCompras", JSON.stringify(historico));
  atualizarHistorico();
}

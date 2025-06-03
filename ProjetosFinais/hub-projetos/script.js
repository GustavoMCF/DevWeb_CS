// Aplicar tema escuro se estiver salvo no localStorage
if (localStorage.getItem("temaEscuroAtivo") === "true") {
  document.body.classList.add("dark");
}
document.addEventListener("DOMContentLoaded", () => {
  // Atualiza o ano no rodapé
  const anoSpan = document.getElementById("ano-atual");
  if (anoSpan) {
    anoSpan.textContent = new Date().getFullYear();
  }

  // Mensagem de boas-vindas
  console.log(
    "%cBem-vindo ao HUB de Projetos do GustavoMCF!",
    "color: #2563eb; font-weight: bold; font-size: 14px;"
  );

  // Animação ao clicar em links
  document.querySelectorAll(".projetos a").forEach(link => {
    link.addEventListener("click", () => {
      link.classList.add("clicado");
      setTimeout(() => link.classList.remove("clicado"), 300);
    });
  });

  // Toggle modo escuro
  const toggleBtn = document.getElementById("toggle-tema");
  const temaSalvo = localStorage.getItem("tema");

  if (temaSalvo === "dark") {
    document.body.classList.add("dark");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const temaAtual = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("tema", temaAtual);
    });
  }

    // Filtro de projetos em tempo real
  const campoBusca = document.getElementById("filtro-projetos");
  const links = document.querySelectorAll(".projetos a");

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();

    links.forEach(link => {
      const texto = link.textContent.toLowerCase();
      const visivel = texto.includes(termo);
      link.style.display = visivel ? "block" : "none";
    });
  });


document.querySelectorAll(".projetos a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const url = link.getAttribute("data-url");
    const titulo = link.textContent.trim();

    const container = document.getElementById("preview-container");
    const frame = document.getElementById("preview-frame");
    const tituloPreview = document.getElementById("preview-titulo");
    const botaoNovaAba = document.getElementById("abrir-nova-aba");

    frame.src = url;
    tituloPreview.textContent = `Visualizando: ${titulo}`;
    container.style.display = "flex";

    botaoNovaAba.onclick = () => window.open(url, "_blank");

    container.scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("fechar-preview").addEventListener("click", () => {
  document.getElementById("preview-frame").src = "";
  document.getElementById("preview-container").style.display = "none";
});
  

// Filtro por categoria
const botoesCategoria = document.querySelectorAll(".filtro-categoria");
const projetos = document.querySelectorAll(".projetos a");

botoesCategoria.forEach(botao => {
  botao.addEventListener("click", () => {
    // Trocar botão ativo
    botoesCategoria.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    const categoriaSelecionada = botao.dataset.categoria;

    projetos.forEach(proj => {
      const tag = proj.querySelector(".tag")?.textContent || "";
      const corresponde = categoriaSelecionada === "todos" || tag.includes(categoriaSelecionada);
      proj.style.display = corresponde ? "block" : "none";
    });
  });
});


// Alternar modo lista/grid
const botaoVisualizacao = document.getElementById("toggle-visualizacao");
const secaoProjetos = document.querySelector(".projetos");

botaoVisualizacao.addEventListener("click", () => {
  secaoProjetos.classList.toggle("grid");

  const estaEmGrid = secaoProjetos.classList.contains("grid");
  botaoVisualizacao.textContent = estaEmGrid ? "📋" : "🧱";
});



});

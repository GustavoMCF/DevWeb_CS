function salvarCursos() {
        // 🔹 Salva no localStorage (converte para string antes de salvar)
        localStorage.setItem("cursos", JSON.stringify(cursos));
}

function atualizarTabela() {
    tabela.innerHTML = ""

    cursos.forEach((curso, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nome}</td>
            <td>${curso.duracao} horas</td>
            <td>
                <button class="details-btn">Detalhes</button>
                 <button class="delete-btn">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    })
}


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cursoForm");
    const tabela = document.getElementById("tabelaCursos");

    let cursos = [];
    let cursoEditando = null;

    // 🔹 Carrega cursos salvos
    const cursosSalvos = localStorage.getItem("cursos");
    if (cursosSalvos) {
        cursos = JSON.parse(cursosSalvos); // Converte de texto para objeto
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const idCurso = document.getElementById("idCurso").value.trim();
        const nomeCurso = document.getElementById("cursoNome").value.trim();
        const descricaoCurso = document.getElementById("cursoDescricao").value.trim();

        if (!idCurso || !nomeCurso || !descricaoCurso) {
            alert("Preencha todos os campos!");
            return;
        }

        const novoCurso = {
            id: idCurso,
            nome: nomeCurso,
            descricao: descricaoCurso
        };

        if (cursoEditando !== null) {
            cursos[cursoEditando] = novoCurso; // Edita curso existente
            cursoEditando = null;
            document.querySelector(".cursoSubmit").textContent = "Adicionar Curso";
        } else {
            cursos.push(novoCurso); // Adiciona novo curso
        }



        salvarCursos();
        atualizarTabela();


        form.reset(); // Limpa o formulário
    });
});


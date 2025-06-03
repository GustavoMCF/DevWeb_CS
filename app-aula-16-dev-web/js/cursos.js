document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cursoForm");
    const tabela = document.getElementById("cursoTabela");

    let cursos = [];
    let cursoEditando = null;

    // 🔹 Carrega os cursos do localStorage
    const cursosSalvos = localStorage.getItem("cursos");
    if (cursosSalvos) {
        cursos = JSON.parse(cursosSalvos);
        atualizarTabela();
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const idCurso = document.getElementById("idCurso").value.trim();
        const nomeCurso = document.getElementById("cursoNome").value.trim();
        const duracaoCurso = document.getElementById("cursoDuracao").value.trim();
        const descricaoCurso = document.getElementById("cursoDescricao").value.trim();

        if (!idCurso || !nomeCurso || !duracaoCurso || !descricaoCurso) {
            alert("Preencha todos os campos!");
            return;
        }

        const novoCurso = {
            id: idCurso,
            nome: nomeCurso,
            duracao: duracaoCurso,
            descricao: descricaoCurso,
        };

        if (cursoEditando !== null) {
            cursos[cursoEditando] = novoCurso;
            cursoEditando = null;
            document.querySelector(".cursoSubmit").textContent = "Adicionar Curso";
        } else {
            cursos.push(novoCurso);
        }

        salvarCursos();
        atualizarTabela();
        form.reset();
    });

    function atualizarTabela() {
        tabela.innerHTML = "";

        cursos.forEach((curso, index) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.nome}</td>
                <td>${curso.duracao} horas</td>
                <td>${curso.descricao}</td>
                <td>
                    <button class="details-btn">Detalhes</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    }

    function salvarCursos() {
        localStorage.setItem("cursos", JSON.stringify(cursos));
    }
});

document.querySelector('#loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (email === "" || senha === "") {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    if (email === "exemplo@gmail.com" && senha === "1234") {
        window.location.href = "index.html"; 
        return;
    }
    else{
        alert('Usuário ou senha inválida.');
        return
    }
});

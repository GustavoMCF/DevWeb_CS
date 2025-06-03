// script.js

// Seleciona o botão de menu e o botão de texto
const menuToggle = document.querySelector('.menu-toggle');
const toggleButton = document.querySelector('.toggle-button');
const menu = document.querySelector('.menu');

// Adiciona evento ao ícone do hambúrguer
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  const hamburger = document.querySelector('.hamburger');
  hamburger.classList.toggle('open');
});

// Adiciona evento ao botão adicional
toggleButton.addEventListener('click', () => {
  menu.classList.toggle('active');

  // Alterna o texto do botão entre "Abrir Menu" e "Fechar Menu"
  if (menu.classList.contains('active')) {
    toggleButton.textContent = 'Fechar Menu';
  } else {
    toggleButton.textContent = 'Abrir Menu';
  }
});

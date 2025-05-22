document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de sellos cargada');

  const sello = document.querySelector('.fade-in');
  if (sello) {
    sello.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    sello.classList.add('animate');
  }
});

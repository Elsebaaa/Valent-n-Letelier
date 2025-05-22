document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de inicio cargada');

  // Ejemplo: resaltar cards al hacer hover (solo como efecto visual)
  const cards = document.querySelectorAll('.zona-noticias .card');
  cards.forEach(card => {
    card.addEventListener('mouseover', () => {
      card.classList.add('shadow-lg');
    });
    card.addEventListener('mouseout', () => {
      card.classList.remove('shadow-lg');
    });
  });
});

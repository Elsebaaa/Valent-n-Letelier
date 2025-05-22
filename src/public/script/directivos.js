document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de directivos cargada');

  const eliminarForms = document.querySelectorAll('.form-eliminar-directivo');
  eliminarForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const nombre = form.getAttribute('data-nombre') || 'este directivo';
      const confirmar = confirm(`¿Estás seguro de eliminar a ${nombre}?`);
      if (!confirmar) {
        e.preventDefault();
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de noticias cargada');

  const forms = document.querySelectorAll('.form-eliminar-noticia');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      const titulo = form.getAttribute('data-titulo') || 'esta noticia';
      const confirmar = confirm(`¿Estás seguro de eliminar "${titulo}"?`);
      if (!confirmar) e.preventDefault();
    });
  });
});

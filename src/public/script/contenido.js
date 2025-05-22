document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de contenido cargada');

  const toggleButtons = document.querySelectorAll('.btn-toggle-upload');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const cursoID = button.getAttribute('data-id');
      const form = document.getElementById('formulario-' + cursoID);
      if (form) {
        form.classList.toggle('d-none');
      }
    });
  });
});

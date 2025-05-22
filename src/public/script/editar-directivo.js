document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista editar directivo cargada');

  const form = document.querySelector('.formulario-directivo form');
  if (form) {
    form.addEventListener('submit', () => {
      console.log('Formulario enviado');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de "Nosotros" cargada');

  const textarea = document.querySelector('textarea[name="biografia"]');
  if (textarea) {
    textarea.addEventListener('focus', () => {
      textarea.style.borderColor = '#28a745';
    });
    textarea.addEventListener('blur', () => {
      textarea.style.borderColor = '';
    });
  }
});

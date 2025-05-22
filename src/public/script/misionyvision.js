document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista Misión y Visión cargada');

  // Enfocar automáticamente el textarea si existe y está visible
  const textarea = document.getElementById('mision');
  if (textarea) {
    textarea.focus();
  }
});

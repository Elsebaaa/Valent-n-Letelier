document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista editar contenido cargada');

  const archivoInput = document.getElementById('archivo');
  if (archivoInput) {
    archivoInput.addEventListener('change', () => {
      if (archivoInput.files.length > 0) {
        console.log('Archivo seleccionado para reemplazo:', archivoInput.files[0].name);
      }
    });
  }
});

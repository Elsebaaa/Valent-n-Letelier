document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista subir contenido cargada');

  const archivoInput = document.getElementById('archivo');
  const tituloInput = document.getElementById('titulo');

  // Mostrar nombre del archivo seleccionado
  archivoInput.addEventListener('change', () => {
    if (archivoInput.files.length > 0) {
      console.log('Archivo seleccionado:', archivoInput.files[0].name);
    }
  });

  // Validación rápida en el cliente
  tituloInput.addEventListener('input', () => {
    if (tituloInput.value.length < 3) {
      tituloInput.style.borderColor = 'red';
    } else {
      tituloInput.style.borderColor = '';
    }
  });
});

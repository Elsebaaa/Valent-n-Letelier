document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista subir noticia cargada');

  const titulo = document.getElementById('titulo');
  const imagen = document.getElementById('imagen');
  const link = document.getElementById('link');

  // Validar que imagen tenga nombre válido
  imagen.addEventListener('change', () => {
    if (imagen.files.length > 0) {
      console.log('Imagen seleccionada:', imagen.files[0].name);
    }
  });

  // Validar que el link externo si existe, comience con http
  link.addEventListener('input', () => {
    if (link.value && !/^https?:\/\//.test(link.value)) {
      link.style.borderColor = 'red';
    } else {
      link.style.borderColor = '';
    }
  });
});

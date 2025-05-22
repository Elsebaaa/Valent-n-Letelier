document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de alumnos cargada');

  // Mostrar alerta de confirmación al eliminar (por refuerzo adicional)
  const deleteForms = document.querySelectorAll('form[onsubmit]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const confirmed = confirm('¿Eliminar alumno?');
      if (!confirmed) e.preventDefault();
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de alumnos cargada');
});

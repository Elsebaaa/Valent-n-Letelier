document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista subir directivo cargada');

  const rutInput = document.getElementById('rut');
  const correoInput = document.getElementById('correo');

  // Validación visual rápida de RUT y correo
  rutInput.addEventListener('blur', () => {
    if (!rutInput.value.includes('-')) {
      rutInput.style.borderColor = 'red';
    } else {
      rutInput.style.borderColor = '';
    }
  });

  correoInput.addEventListener('input', () => {
    if (!correoInput.value.includes('@')) {
      correoInput.style.borderColor = 'red';
    } else {
      correoInput.style.borderColor = '';
    }
  });
});

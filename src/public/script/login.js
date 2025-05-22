    document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('contrasena');

    if (toggleBtn && passwordInput) {
      toggleBtn.addEventListener('click', () => {
        const tipoActual = passwordInput.getAttribute('type');
        const nuevoTipo = tipoActual === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', nuevoTipo);

        // Cambiar ícono si deseas
        toggleBtn.textContent = nuevoTipo === 'text' ? '🙈' : '👁️';
      });
    }
  });

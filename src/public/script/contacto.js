document.addEventListener('DOMContentLoaded', () => {
  console.log('Vista de contacto cargada');

  // Ejemplo de funcionalidad: resaltar el QR al pasar el mouse
  const qrImg = document.querySelector('.qr-section img');
  if (qrImg) {
    qrImg.addEventListener('mouseover', () => {
      qrImg.style.transform = 'scale(1.05)';
      qrImg.style.transition = '0.2s';
    });

    qrImg.addEventListener('mouseout', () => {
      qrImg.style.transform = 'scale(1)';
    });
  }
});

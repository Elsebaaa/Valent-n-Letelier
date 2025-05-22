import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// CONFIGURACIÓN EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // SIN subir carpeta

// RUTA DE PRUEBA
app.get('/', (req, res) => {
  res.render('login'); // Esto busca "views/login.ejs"
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor de prueba corriendo en http://localhost:${PORT}`);
});

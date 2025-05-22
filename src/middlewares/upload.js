import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta ABSOLUTA hacia /public/uploads (fuera de src)
const uploadPath = path.resolve(__dirname, '../../public/uploads');

// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('✅ Carpeta creada:', uploadPath);
} else {
  console.log('📁 Carpeta ya existe:', uploadPath);
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('💾 Guardando archivo en:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const nombreFinal = `${timestamp}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, nombreFinal);
  }
});

const upload = multer({ storage });

export default upload;

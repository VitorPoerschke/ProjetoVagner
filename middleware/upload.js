// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + '-' + file.originalname;
    cb(null, nomeUnico);
  }
});

// Filtro de tipo de arquivo permitido
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, tiposPermitidos.includes(ext));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

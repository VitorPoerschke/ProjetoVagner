const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + '-' + file.originalname;
    cb(null, nomeUnico);
  }
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, tiposPermitidos.includes(ext));
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 15 * 1024 * 1024 } // 5 MB
});

module.exports = upload;
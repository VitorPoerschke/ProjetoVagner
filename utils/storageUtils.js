const fs = require('fs');
const path = require('path');

const UPLOADS_PATH = path.join(__dirname, '..', 'uploads');
const MAX_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB
const AVISO_BYTES = 9 * 1024 * 1024 * 1024; // 9 GB

function calcularTamanhoDiretorio(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

function obterEspacoUsado() {
  try {
    return calcularTamanhoDiretorio(UPLOADS_PATH);
  } catch (err) {
    console.error('Erro ao calcular uso de espaço:', err);
    return 0;
  }
}

function estaAcimaDoLimite() {
  return obterEspacoUsado() >= MAX_BYTES;
}

function estaNoAviso() {
  const atual = obterEspacoUsado();
  return atual >= AVISO_BYTES && atual < MAX_BYTES;
}

module.exports = {
  obterEspacoUsado,
  estaAcimaDoLimite,
  estaNoAviso,
  MAX_BYTES
};

const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../logs.json');

function registrarLog({ usuarioId, usuarioNome, role, acao, detalhe }) {
  const log = {
    timestamp: new Date().toISOString(),
    usuarioId,
    usuarioNome,
    role,
    acao,
    detalhe
  };
  let logs = [];
  if (fs.existsSync(LOG_PATH)) {
    logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  }
  logs.push(log);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
}

function listarLogs() {
  if (!fs.existsSync(LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
}

module.exports = { registrarLog, listarLogs };
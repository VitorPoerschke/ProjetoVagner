const { estaAcimaDoLimite } = require('../utils/storageUtils');

module.exports = function limitarUpload(req, res, next) {
  if (estaAcimaDoLimite()) {
    return res.status(403).json({ erro: 'Limite de espaço atingido. Não é possível anexar mais arquivos.' });
  }
  next();
};

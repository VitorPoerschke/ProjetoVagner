const express = require('express');
const router = express.Router();
const { listarLogs } = require('../utils/auditoria');
const autenticarToken = require('../middleware/auth');

router.get('/logs', autenticarToken, (req, res) => {
  if (req.user.role !== 'master') {
    return res.status(403).json({ erro: 'Acesso restrito ao administrador.' });
  }
  res.json(listarLogs());
});

module.exports = router;
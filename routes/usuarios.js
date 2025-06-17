const express = require('express');
const router = express.Router();

// Exemplo de rota GET para listar usuários (só para testar o endpoint)
router.get('/', (req, res) => {
  res.json({ mensagem: 'Rota de usuários funcionando!' });
});

module.exports = router;

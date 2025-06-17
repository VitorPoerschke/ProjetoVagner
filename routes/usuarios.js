const express = require('express');
const router = express.Router();
const usuarios = require('../models/usuarios');

// Apenas um exemplo simples para listar os usuários (pode expandir depois)
router.get('/', (req, res) => {
  res.json(usuarios);
});

module.exports = router;
// Exporta as rotas de usuários para serem usadas no index.js
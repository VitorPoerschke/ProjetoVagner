const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middleware/auth');

// Listar usuários (Protegido)
router.get('/', autenticarToken, usuarioController.listarUsuarios);

// Criar novo usuário (Protegido)
router.post('/', autenticarToken, usuarioController.criarUsuario);

// Deletar usuário por ID (Protegido)
router.delete('/:id', autenticarToken, usuarioController.deletarUsuario);

module.exports = router;
// Exporta as rotas de usuários para serem usadas no index.js
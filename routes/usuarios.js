const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middleware/auth');

// Proteger todas as rotas de usuários
router.use(autenticarToken);

// Rotas CRUD de Usuários
router.get('/', usuarioController.listarUsuarios);
router.get('/buscar/:id', usuarioController.buscarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/atualizar/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;

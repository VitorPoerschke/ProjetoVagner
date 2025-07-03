const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middleware/auth');
const usuarios = require('../models/usuarios');

// Proteger todas as rotas de usuários
router.use(autenticarToken);

// Rotas CRUD de Usuários
router.get('/', usuarioController.listarUsuarios);
router.get('/buscar/:id', usuarioController.buscarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/atualizar/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);

// Nova rota para buscar usuários com papel de responsável
router.get('/responsaveis', (req, res) => {
  try {
    const responsaveis = usuarios
      .filter(u => u.role === 'responsavel')
      .map(u => ({ id: u.id, nome: u.nome }));

    res.json(responsaveis);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err.message);
    res.status(500).json({ erro: 'Erro interno ao buscar responsáveis' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');
const usuarios = require('../models/usuarios');

router.get('/', autenticarToken, tarefaController.listarTarefas);
router.get('/:id', autenticarToken, tarefaController.buscarTarefaPorId);
router.post('/', autenticarToken, tarefaController.criarTarefa);
router.put('/:id', autenticarToken, tarefaController.atualizarTarefa);
router.delete('/:id', autenticarToken, tarefaController.deletarTarefa);
router.put('/:id/atribuir', autenticarToken, tarefaController.atribuirResponsavel);
router.put('/:id/status', autenticarToken, tarefaController.atualizarStatus);
router.get('/historico/concluidas', autenticarToken, tarefaController.historicoConcluidas);

// NOVA ROTA: listar responsáveis
router.get('/responsaveis/listar', autenticarToken, (req, res) => {
  try {
    if (req.user.role !== 'master') {
      return res.status(403).json({ erro: 'Apenas administradores podem acessar essa lista' });
    }

    const responsaveis = usuarios.filter(u => u.role === 'responsavel').map(u => ({
      id: u.id,
      nome: u.nome
    }));

    res.json(responsaveis);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err.message);
    res.status(500).json({ erro: 'Erro interno ao listar responsáveis' });
  }
});

module.exports = router;

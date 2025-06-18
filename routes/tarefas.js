const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');

// Todas as rotas protegidas
router.get('/', autenticarToken, tarefaController.listarTarefas);
router.get('/:id', autenticarToken, tarefaController.buscarTarefaPorId);
router.post('/', autenticarToken, tarefaController.criarTarefa);
router.put('/:id', autenticarToken, tarefaController.atualizarTarefa);
router.delete('/:id', autenticarToken, tarefaController.deletarTarefa);

module.exports = router;

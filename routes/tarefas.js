const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');

router.get('/', autenticarToken, tarefaController.listarTarefas);
router.get('/:id', autenticarToken, tarefaController.buscarTarefaPorId);
router.post('/', autenticarToken, tarefaController.criarTarefa);
router.put('/:id', autenticarToken, tarefaController.atualizarTarefa);
router.delete('/:id', autenticarToken, tarefaController.deletarTarefa);
router.put('/:id/atribuir', autenticarToken, tarefaController.atribuirResponsavel);
router.put('/:id/status', autenticarToken, tarefaController.atualizarStatus);
router.get('/historico/concluidas', autenticarToken, tarefaController.historicoConcluidas);

module.exports = router;
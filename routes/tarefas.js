const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');

router.post('/', autenticarToken, tarefasController.criarTarefa);
router.get('/', autenticarToken, tarefasController.listarTarefas);
router.put('/:id/status', autenticarToken, tarefasController.atualizarStatus);

module.exports = router;
// Exporta as rotas de tarefas para serem usadas no index.js
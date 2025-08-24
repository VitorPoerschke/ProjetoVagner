const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');
const { usuarios } = require('../models/usuarios'); // ajuste: destructuring
const upload = require('../middleware/upload');
const limitarUpload = require('../middleware/limiteUpload');

// ROTA DE LIMITE DE UPLOAD
router.get('/espaco', autenticarToken, tarefaController.verificarEspaco);

// ROTAS DE HISTÓRICO (tem que vir ANTES do router.get('/:id'))
router.get('/historico/concluidas', autenticarToken, tarefaController.historicoConcluidas);
router.put('/historico/:id/restaurar', autenticarToken, tarefaController.restaurarTarefa);
router.delete('/historico/:id', autenticarToken, tarefaController.excluirTarefaHistorico);

// ROTA PARA LISTAR RESPONSÁVEIS (somente master) → também tem que vir ANTES do /:id
router.get('/responsaveis/listar', autenticarToken, (req, res) => {
  try {
    if (req.user.role !== 'master') {
      return res.status(403).json({ erro: 'Apenas administradores podem acessar essa lista' });
    }

    const responsaveis = usuarios
      .filter(u => u.role === 'responsavel')
      .map(u => ({ id: u.id, nome: u.nome }));

    res.json(responsaveis);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err.message);
    res.status(500).json({ erro: 'Erro interno ao listar responsáveis' });
  }
});

// ROTAS PADRÕES
router.get('/', autenticarToken, tarefaController.listarTarefas);
router.post('/', autenticarToken, limitarUpload, upload.array('anexos', 15), tarefaController.criarTarefa);
router.put('/:id', autenticarToken, tarefaController.atualizarTarefa);
router.delete('/:id', autenticarToken, tarefaController.deletarTarefa);
router.put('/:id/atribuir', autenticarToken, tarefaController.atribuirResponsavel);
router.put('/:id/status', autenticarToken, tarefaController.atualizarStatus);
router.put('/:id/responder', autenticarToken, limitarUpload, upload.array('anexos', 15), tarefaController.responderTarefa);
router.put('/:id/devolver', autenticarToken, tarefaController.devolverTarefa);

// ROTA PARA PEGAR UMA TAREFA ESPECÍFICA POR ID (sempre a última)
router.get('/:id', autenticarToken, tarefaController.buscarTarefaPorId);

module.exports = router;

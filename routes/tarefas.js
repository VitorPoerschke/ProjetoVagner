const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefasController');
const autenticarToken = require('../middleware/auth');
const usuarios = require('../models/usuarios');
const upload = require('../middleware/upload'); // Novo: middleware do multer

// ROTAS PADRÕES
router.get('/', autenticarToken, tarefaController.listarTarefas);
router.post('/', autenticarToken, upload.single('anexo'), tarefaController.criarTarefa); // Atualizado com suporte a arquivo
router.put('/:id', autenticarToken, tarefaController.atualizarTarefa);
router.delete('/:id', autenticarToken, tarefaController.deletarTarefa);
router.put('/:id/atribuir', autenticarToken, tarefaController.atribuirResponsavel);
router.put('/:id/status', autenticarToken, tarefaController.atualizarStatus);

// ROTAS DE HISTÓRICO (tem que vir ANTES do router.get('/:id'))
router.get('/historico/concluidas', autenticarToken, tarefaController.historicoConcluidas);
router.put('/historico/:id/restaurar', autenticarToken, tarefaController.restaurarTarefa);
router.delete('/historico/:id', autenticarToken, tarefaController.excluirTarefaHistorico);

// ROTA PARA PEGAR UMA TAREFA ESPECÍFICA POR ID (deve vir por último)
router.get('/:id', autenticarToken, tarefaController.buscarTarefaPorId);

// ROTA PARA LISTAR RESPONSÁVEIS (somente master)
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

module.exports = router;

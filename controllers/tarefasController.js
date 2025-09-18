const { tarefas, historicoTarefas } = require('../models/tarefas');
const { usuarios } = require('../models/usuarios');
const { registrarLog } = require('../utils/auditoria');
const path = require('path');
const fs = require('fs');

// ====================================================
// FUNÇÕES DE CRIAR TAREFA (QUALQUER UM)
// ====================================================

/**
 * Lista tarefas visíveis ao usuário logado.
 */
exports.listarTarefas = (req, res) => {
  try {
    const user = req.user;
    let tarefasFiltradas = [];

    if (user.role === 'master') {
      tarefasFiltradas = tarefas.map(t => {
        const criador = usuarios.find(u => u.id === t.usuarioId);
        const responsavel = usuarios.find(u => u.id === t.responsavel);
        return {
          ...t,
          nomeCriador: t.usuarioId === user.id ? 'Você' : (criador ? criador.nome : 'Desconhecido'),
          responsavelNome: responsavel ? responsavel.nome : '-'
        };
      });
    } else if (user.role === 'cliente') {
      tarefasFiltradas = tarefas
        .filter(t => t.usuarioId === user.id)
        .map(t => ({
          ...t,
          nomeCriador: 'Você'
        }));
    } else if (user.role === 'responsavel') {
      tarefasFiltradas = tarefas
        .filter(t => t.responsavel === user.id)
        .map(t => {
          const criador = usuarios.find(u => u.id === t.usuarioId);
          return {
            ...t,
            nomeCriador: criador ? criador.nome : 'Desconhecido'
          };
        });
    } else {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    res.json(tarefasFiltradas);
  } catch (erro) {
    console.error('Erro ao listar tarefas:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao listar tarefas' });
  }
};

/**
 * Busca uma tarefa por ID.
 */
exports.buscarTarefaPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
  res.json(tarefa);
};

/**
 * Cria nova tarefa (qualquer usuário pode).
 * LOG: registra quem criou e nome dos arquivos anexados (se houver), data automática.
 */
exports.criarTarefa = (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) return res.status(400).json({ erro: 'Campos obrigatórios' });

  const anexos = req.files ? req.files.map(f => f.filename) : [];

  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    status: 'pendente',
    responsavel: '',
    usuarioId: req.user.id,
    anexos
  };

  tarefas.push(novaTarefa);

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Criou nova tarefa',
    detalhe: anexos.length > 0
      ? `Arquivos: ${anexos.join(', ')}`
      : `Sem anexos`
  });

  res.status(201).json(novaTarefa);
};

// ====================================================
// FUNÇÕES DE RESPONDER O ADMIN (E RESPONSÁVEL)
// ====================================================

/**
 * Atualiza tarefa (qualquer usuário pode editar sua tarefa).
 * LOG: registra edição.
 */
exports.atualizarTarefa = (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

  const { titulo, descricao } = req.body;
  if (titulo) tarefa.titulo = titulo;
  if (descricao) tarefa.descricao = descricao;

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Editou tarefa',
    detalhe: `Tarefa #${tarefa.id}`
  });

  res.json(tarefa);
};

/**
 * Deleta tarefa (qualquer usuário pode deletar sua tarefa).
 * LOG: registra deleção.
 */
exports.deletarTarefa = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

  const deleted = tarefas[index];
  tarefas.splice(index, 1);

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Removeu tarefa',
    detalhe: `Tarefa #${deleted.id}`
  });

  res.json({ mensagem: 'Tarefa deletada com sucesso' });
};

/**
 * Atribui responsável (apenas MASTER).
 * LOG: registra atribuição.
 */
exports.atribuirResponsavel = (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'master') {
      return res.status(403).json({ erro: 'Apenas administradores podem atribuir responsáveis' });
    }
    const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    const responsavel = usuarios.find(u => u.id === parseInt(req.body.responsavelId) && u.role === 'responsavel');
    if (!responsavel) return res.status(404).json({ erro: 'Responsável inválido' });

    tarefa.responsavel = responsavel.id;

    // === AUDITORIA ===
    registrarLog({
      usuarioId: req.user.id,
      usuarioNome: req.user.nome,
      acao: 'Atribuiu responsável',
      detalhe: `Tarefa #${tarefa.id} para ${responsavel.nome}`
    });

    res.json({ mensagem: 'Responsável atribuído com sucesso', tarefa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao atribuir responsável' });
  }
};

/**
 * Atualiza status da tarefa (pode concluir).
 * LOG: registra conclusão.
 */
exports.atualizarStatus = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const tarefaIndex = tarefas.findIndex(t => t.id === id);
    if (tarefaIndex === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    const tarefa = tarefas[tarefaIndex];
    tarefa.status = status;

    // Se for concluído, move pro histórico e remove da lista ativa
    if (status === 'concluido') {
      historicoTarefas.push({
        ...tarefa,
        dataConclusao: new Date()
      });
      tarefas.splice(tarefaIndex, 1);

      // === AUDITORIA ===
      registrarLog({
        usuarioId: req.user.id,
        usuarioNome: req.user.nome,
        acao: 'Concluiu tarefa',
        detalhe: `Tarefa #${tarefa.id}`
      });
    }

    res.json({ mensagem: `Status da tarefa ${id} atualizado para: ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao atualizar status da tarefa' });
  }
};

/**
 * Responde tarefa (responsável ou admin).
 * LOG: registra resposta, nome dos arquivos anexados (se houver).
 */
exports.responderTarefas = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { mensagem } = req.body;
    const anexos = req.files ? req.files.map(f => f.filename) : [];

    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    tarefa.respostaMensagem = mensagem || '';
    tarefa.respostaAnexos = anexos;
    tarefa.status = 'em andamento';

    // === AUDITORIA ===
    registrarLog({
      usuarioId: req.user.id,
      usuarioNome: req.user.nome,
      acao: 'Respondeu tarefa',
      detalhe: anexos.length > 0
        ? `Arquivos: ${anexos.join(', ')}`
        : `Sem anexos`
    });

    res.json({ mensagem: 'Resposta enviada com sucesso!' });
  } catch (err) {
    console.error('Erro ao responder tarefa:', err);
    res.status(500).json({ erro: 'Erro interno ao responder tarefa' });
  }
};

/**
 * Devolve tarefa ao responsável (admin).
 * LOG: registra devolução.
 */
exports.devolverTarefas = (req, res) => {
  const user = req.user;
  const id = parseInt(req.params.id);
  const { observacao } = req.body;

  if (user.role !== 'master') {
    return res.status(403).json({ erro: 'Apenas admins podem devolver tarefas' });
  }

  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

  tarefa.respostaMensagem = '';
  tarefa.respostaAnexo = '';
  tarefa.status = 'em andamento';
  tarefa.observacao = observacao;

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Devolveu tarefa',
    detalhe: `Tarefa #${tarefa.id}`
  });

  res.json({ mensagem: 'Tarefa devolvida ao responsável com sucesso' });
};

// ====================================================
// FUNÇÕES DE ALTERAR O HISTÓRICO
// ====================================================

/**
 * Lista tarefas concluídas (histórico).
 */
exports.historicoConcluidas = (req, res) => {
  try {
    const user = req.user;

    let historicoFiltrado = [];
    if (user.role === 'master') {
      historicoFiltrado = historicoTarefas;
    } else if (user.role === 'cliente') {
      historicoFiltrado = historicoTarefas.filter(t => t.usuarioId === user.id);
    } else if (user.role === 'responsavel') {
      historicoFiltrado = historicoTarefas.filter(t => t.responsavel === user.id);
    } else {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    res.json(historicoFiltrado);
  } catch (err) {
    console.error('Erro ao listar histórico:', err);
    res.status(500).json({ erro: 'Erro interno ao listar histórico' });
  }
};

/**
 * Restaura tarefa do histórico para lista ativa.
 * LOG: registra restauração.
 */
exports.restaurarTarefa = (req, res) => {
  const id = parseInt(req.params.id);
  const index = historicoTarefas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrada no histórico' });

  const tarefaRestaurada = historicoTarefas.splice(index, 1)[0];
  tarefas.push(tarefaRestaurada);

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Restaurou tarefa',
    detalhe: `Tarefa #${tarefaRestaurada.id}`
  });

  res.json({ mensagem: 'Tarefa restaurada com sucesso', tarefa: tarefaRestaurada });
};

/**
 * Exclui tarefa do histórico.
 * LOG: registra exclusão do histórico.
 */
exports.excluirTarefaHistorico = (req, res) => {
  const id = parseInt(req.params.id);
  const index = historicoTarefas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrada no histórico' });

  const excluida = historicoTarefas[index];
  historicoTarefas.splice(index, 1);

  // === AUDITORIA ===
  registrarLog({
    usuarioId: req.user.id,
    usuarioNome: req.user.nome,
    acao: 'Excluiu tarefa do histórico',
    detalhe: `Tarefa #${excluida.id}`
  });

  res.json({ mensagem: 'Tarefa excluída do histórico com sucesso' });
};


//fim do arquivo//atualizado em 26/10/2023  
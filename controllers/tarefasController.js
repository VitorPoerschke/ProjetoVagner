const tarefas = require('../models/tarefas');
const usuarios = require('../models/usuarios');
const historicoTarefas = [];


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



// Buscar por ID
exports.buscarTarefaPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
    res.json(tarefa);
};

// Criar nova tarefa V2
exports.criarTarefa = (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || !descricao) return res.status(400).json({ erro: 'Campos obrigatórios' });

  const anexo = req.file ? req.file.filename : null;

  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    status: 'pendente',
    responsavel: '',
    usuarioId: req.user.id,
    anexo
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
};

// Atualizar tarefa
exports.atualizarTarefa = (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    const { titulo, descricao } = req.body;
    if (titulo) tarefa.titulo = titulo;
    if (descricao) tarefa.descricao = descricao;

    res.json(tarefa);
};

// Deletar tarefa
exports.deletarTarefa = (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    tarefas.splice(index, 1);
    res.json({ mensagem: 'Tarefa deletada com sucesso' });
};

// Atribuir responsável v2 novo
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

    res.json({ mensagem: 'Responsável atribuído com sucesso', tarefa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao atribuir responsável' });
  }
};

// Atualizar status da tarefa v2
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
}

    console.log(`Status da tarefa ${id} atualizado para: ${status}`);
    res.json({ mensagem: 'Status atualizado', tarefa });

  } catch (err) {
    console.error('Erro ao atualizar status:', err.message);
    res.status(500).json({ erro: 'Erro interno ao atualizar status' });
  }
};

// Histórico (listar concluídas)v4
exports.historicoConcluidas = (req, res) => {
  try {
    const user = req.user;

    let concluidas = historicoTarefas;

    if (user.role === 'cliente') {
      concluidas = concluidas.filter(t => t.usuarioId === user.id);
    } else if (user.role === 'responsavel') {
      concluidas = concluidas.filter(t => t.responsavel === user.id);
    }

    const tarefasComNomes = concluidas.map(t => {
      const criador = usuarios.find(u => u.id === t.usuarioId);
      const responsavel = usuarios.find(u => u.id === t.responsavel);
      return {
        ...t,
        nomeCriador: criador ? criador.nome : 'Desconhecido',
        responsavelNome: responsavel ? responsavel.nome : '-'
      };
    });

    res.json(tarefasComNomes);
  } catch (err) {
    console.error('Erro ao listar histórico:', err.message);
    res.status(500).json({ erro: 'Erro interno ao listar histórico' });
  }
};

// Restaurar tarefa do histórico v1
exports.restaurarTarefa = (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'master') {
      return res.status(403).json({ erro: 'Apenas o master pode restaurar tarefas' });
    }

    const id = parseInt(req.params.id);
    const index = historicoTarefas.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Tarefa não encontrada no histórico' });
    }

    const restaurada = historicoTarefas.splice(index, 1)[0];
    restaurada.status = 'pendente';
    tarefas.push(restaurada);

    res.json({ mensagem: 'Tarefa restaurada com sucesso', tarefa: restaurada });
  } catch (err) {
    console.error('Erro ao restaurar tarefa:', err.message);
    res.status(500).json({ erro: 'Erro interno ao restaurar tarefa' });
  }
};

// Excluir tarefa do histórico v1
exports.excluirTarefaHistorico = (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'master') {
      return res.status(403).json({ erro: 'Apenas o master pode excluir tarefas do histórico' });
    }

    const id = parseInt(req.params.id);
    const index = historicoTarefas.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Tarefa não encontrada no histórico' });
    }

    historicoTarefas.splice(index, 1);
    res.json({ mensagem: 'Tarefa excluída permanentemente' });
  } catch (err) {
    console.error('Erro ao excluir tarefa do histórico:', err.message);
    res.status(500).json({ erro: 'Erro interno ao excluir tarefa' });
  }
};

// Responder tarefa
exports.responderTarefa = (req, res) => {
  try {
    const user = req.user;
    const id = parseInt(req.params.id);
    const mensagem = req.body.mensagem;
    const anexo = req.file ? req.file.filename : null;

    if (user.role !== 'responsavel') {
      return res.status(403).json({ erro: 'Apenas responsáveis podem enviar respostas' });
    }

    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    tarefa.respostaMensagem = mensagem || '';
    tarefa.respostaAnexo = anexo || '';
    tarefa.status = 'em andamento'; // opcional: mudar status para "em andamento" após resposta

    res.json({ mensagem: 'Resposta enviada com sucesso!' });
  } catch (err) {
    console.error('Erro ao responder tarefa:', err);
    res.status(500).json({ erro: 'Erro interno ao responder tarefa' });
  }
};

exports.devolverTarefa = (req, res) => {
  const user = req.user;
  const id = parseInt(req.params.id);
  const { observacao } = req.body;

  if (user.role !== 'master') {
    return res.status(403).json({ erro: 'Apenas admins podem devolver tarefas' });
  }

  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  tarefa.respostaMensagem = '';
  tarefa.respostaAnexo = '';
  tarefa.status = 'em andamento';
  tarefa.observacao = observacao;

  res.json({ mensagem: 'Tarefa devolvida ao responsável com sucesso' });
};

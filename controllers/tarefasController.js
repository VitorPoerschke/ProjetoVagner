const tarefas = require('../models/tarefas');


const usuarios = require('../models/usuarios');

exports.listarTarefas = (req, res) => {
  try {
    if (req.user.role === 'master') {
      const tarefasComNomes = tarefas.map(t => {
        const usuario = usuarios.find(u => u.id === t.usuarioId);
        return {
          ...t,
          nomeCriador: usuario ? usuario.nome : 'Desconhecido'
        };
      });

      return res.json(tarefasComNomes);
    }

    // Cliente: retorna só suas tarefas e define "Você" como nomeCriador
const tarefasDoUsuario = tarefas
  .filter(t => t.usuarioId === req.user.id)
  .map(t => ({ ...t, nomeCriador: 'Você' }));

return res.json(tarefasDoUsuario);

  } catch (err) {
    console.error('Erro no listarTarefas:', err.message);
    return res.status(500).json({ erro: 'Erro interno ao listar tarefas' });
  }
};


// Buscar por ID
exports.buscarTarefaPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
    res.json(tarefa);
};

// Criar nova tarefa
exports.criarTarefa = (req, res) => {
    const { titulo, descricao } = req.body;
    if (!titulo || !descricao) return res.status(400).json({ erro: 'Campos obrigatórios' });

    const novaTarefa = {
        id: tarefas.length + 1,
        titulo,
        descricao,
        status: 'pendente',
        responsavel: '',
        usuarioId: req.user.id
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

// Atribuir responsável
exports.atribuirResponsavel = (req, res) => {
    const id = parseInt(req.params.id);
    const { responsavel } = req.body;
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    tarefa.responsavel = responsavel;
    res.json({ mensagem: 'Responsável atribuído', tarefa });
};

// Atualizar status
exports.atualizarStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    tarefa.status = status;

    console.log(`Status da tarefa ${id} atualizado para: ${status}`);
    res.json({ mensagem: 'Status atualizado', tarefa });
};

// Histórico (listar concluídas)
exports.historicoConcluidas = (req, res) => {
    const concluidas = tarefas.filter(t => t.status === 'concluido');

    if (req.user.tipo === 'Master') {
        // Master vê todas as concluídas
        res.json(concluidas);
    } else {
        // Cliente vê só as que ele criou
        const minhas = concluidas.filter(t => t.usuarioId === req.user.id);
        res.json(minhas);
    }
};

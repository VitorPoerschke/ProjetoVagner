let tarefas = [
  { id: 1, titulo: 'Primeira tarefa', descricao: 'Descrição da tarefa', usuarioId: 1 }
];

// Listar todas
exports.listarTarefas = (req, res) => {
  res.json(tarefas);
};

// Buscar por ID
exports.buscarTarefaPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  res.json(tarefa);
};

// Criar nova
exports.criarTarefa = (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    return res.status(400).json({ erro: 'Título e descrição são obrigatórios' });
  }

  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    usuarioId: req.user.id // Pega do token!
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
};

// Atualizar
exports.atualizarTarefa = (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  const { titulo, descricao } = req.body;
  if (titulo) tarefa.titulo = titulo;
  if (descricao) tarefa.descricao = descricao;

  res.json(tarefa);
};

// Deletar
exports.deletarTarefa = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  tarefas.splice(index, 1);
  res.json({ mensagem: 'Tarefa deletada com sucesso' });
};

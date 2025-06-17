let tarefas = [];

exports.listarTarefas = (req, res) => {
  res.json(tarefas);
};

exports.criarTarefa = (req, res) => {
  const { titulo, descricao } = req.body;
  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    status: 'aberto',
    criado_por: req.user.id,
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
};

exports.atualizarStatus = (req, res) => {
  const tarefaId = parseInt(req.params.id);
  const { status } = req.body;
  const tarefa = tarefas.find(t => t.id === tarefaId);
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  tarefa.status = status;
  res.json(tarefa);
};

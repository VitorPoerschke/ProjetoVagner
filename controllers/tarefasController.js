let tarefas = [];
let idCounter = 1;

exports.criarTarefa = (req, res) => {
  const { titulo, descricao } = req.body;
  const nova = {
    id: idCounter++,
    titulo,
    descricao,
    status: 'aberto',
    criado_por: req.user.id
  };
  tarefas.push(nova);
  res.status(201).json(nova);
};

exports.listarTarefas = (req, res) => {
  res.json(tarefas);
};

exports.atualizarStatus = (req, res) => {
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (!tarefa) return res.sendStatus(404);
  tarefa.status = req.body.status;
  res.json(tarefa);
};

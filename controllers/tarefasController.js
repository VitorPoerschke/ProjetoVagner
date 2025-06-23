const tarefas = require('../models/tarefas');

// Listar todas
exports.listarTarefas = (req, res) => {
    res.json(tarefas);
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
        usuarioId: req.usuario.id
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
    res.json(concluidas);
};
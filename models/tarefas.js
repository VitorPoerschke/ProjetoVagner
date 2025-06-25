// models/tarefas.js

const tarefas = [
    {
        id: 1,
        titulo: 'Tarefa do Cliente',
        descricao: 'Tarefa criada por cliente',
        status: 'pendente',
        responsavel: '',
        usuarioId: 2 // ID do cliente
    },
    {
        id: 2,
        titulo: 'Tarefa do Master',
        descricao: 'Tarefa criada por master',
        status: 'concluido',
        responsavel: 'advogado1',
        usuarioId: 1 // ID do master
    }
];

module.exports = tarefas;

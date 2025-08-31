const { historicoTarefas } = require('../models/tarefas');

function limparHistoricoAntigo() {
  const agora = new Date();
  const diasLimite = 30;

  const antes = historicoTarefas.length;

  // Filtra mantendo apenas as tarefas com menos de 30 dias de conclusão
  const novas = historicoTarefas.filter(tarefa => {
    if (!tarefa.dataConclusao) return true; // backup de segurança
    const data = new Date(tarefa.dataConclusao);
    const diffDias = (agora - data) / (1000 * 60 * 60 * 24);
    return diffDias <= diasLimite;
  });

  const removidas = historicoTarefas.length - novas.length;
  historicoTarefas.length = 0;
  historicoTarefas.push(...novas);

  if (removidas > 0) {
    console.log(`💥 ${removidas} tarefas removidas do histórico por tempo.`);
  }
}

module.exports = limparHistoricoAntigo;
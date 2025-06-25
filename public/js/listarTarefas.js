const token = localStorage.getItem('token');

async function listarTarefas() {
  try {
    const res = await fetch('/api/tarefas', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar tarefas');
    }

    const tarefas = await res.json();
    const corpoTabela = document.getElementById('corpoTarefas');
    corpoTabela.innerHTML = '';

    if (tarefas.length === 0) {
      const linha = document.createElement('tr');
      linha.innerHTML = '<td colspan="5">Nenhuma tarefa encontrada.</td>';
      corpoTabela.appendChild(linha);
      return;
    }

    tarefas.forEach(t => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${t.id}</td>
        <td>${t.titulo}</td>
        <td>${t.status}</td>
        <td>${t.nomeCriador || 'Desconhecido'}</td>
        <td>${t.responsavel || '-'}</td>
      `;
      corpoTabela.appendChild(linha);
    });
  } catch (erro) {
    console.error('Erro ao listar tarefas:', erro);
    alert('Erro ao carregar tarefas.');
  }
}

document.addEventListener('DOMContentLoaded', listarTarefas);


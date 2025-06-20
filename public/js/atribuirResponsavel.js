const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== 'master') {
  alert('Apenas Master pode atribuir responsáveis.');
  window.location.href = 'painel.html';
}

async function atribuir() {
  const tarefaId = document.getElementById('tarefaId').value;
  const usuarioId = document.getElementById('usuarioId').value;

  await fetch(`/api/tarefas/${tarefaId}/atribuir`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ usuarioId })
  });

  alert('Responsável atribuído!');
}

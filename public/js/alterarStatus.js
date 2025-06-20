const token = localStorage.getItem('token');

async function alterar() {
  const tarefaId = document.getElementById('tarefaId').value;
  const status = document.getElementById('status').value;

  await fetch(`/api/tarefas/${tarefaId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ status })
  });

  alert('Status alterado!');
}

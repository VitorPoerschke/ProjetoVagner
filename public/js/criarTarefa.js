const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== 'cliente') {
  alert('Apenas clientes podem criar tarefas.');
  window.location.href = 'painel.html';
}

async function criarTarefa() {
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;

  await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ titulo, descricao })
  });

  alert('Tarefa criada!');
}

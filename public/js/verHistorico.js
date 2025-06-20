const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== 'master') {
  alert('Apenas Master pode ver o histórico.');
  window.location.href = 'painel.html';
}

async function carregarHistorico() {
  const res = await fetch('/api/tarefas/historico', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const tarefas = await res.json();
  const lista = document.getElementById('historicoList');
  lista.innerHTML = '';

  tarefas.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.titulo} - ${t.status} - ${t.responsavelId || 'Sem responsável'}`;
    lista.appendChild(li);
  });
}

carregarHistorico();

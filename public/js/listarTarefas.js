const token = localStorage.getItem('token');

async function listarTarefas() {
  const res = await fetch('/api/tarefas', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const tarefas = await res.json();
  const lista = document.getElementById('listaTarefas');
  lista.innerHTML = '';

  tarefas.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.titulo} - ${t.status}`;
    lista.appendChild(li);
  });
}

listarTarefas();

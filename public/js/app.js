let token = localStorage.getItem('token') || '';

async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    localStorage.setItem('token', token);
    window.location.href = 'painel.html';
  } else {
    alert('Login inválido');
  }
}

async function criarUsuario() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ nome, email, senha })
  });

  alert('Usuário criado!');
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

async function listarTarefas() {
  const res = await fetch('/api/tarefas', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const tarefas = await res.json();
  const lista = document.getElementById('listaTarefas');
  lista.innerHTML = '';

  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.textContent = `${tarefa.titulo} - ${tarefa.status}`;
    lista.appendChild(li);
  });
}

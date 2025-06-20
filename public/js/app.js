let token = localStorage.getItem('token') || "";

// Função para fazer login
async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    // Faz a requisição POST para o backend
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    // Verifica se a resposta foi sucesso (200) e se veio token
    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem('token', token); // Salva o token localmente
      window.location.href = 'painel.html'; // Redireciona para o painel
    } else {
      alert('Login inválido! Verifique email e senha.');
      console.log('Resposta do backend:', data);
    }

  } catch (error) {
    console.error('Erro de conexão com o servidor:', error);
    alert('Erro ao tentar conectar no servidor.');
  }
}

// Função para exibir o tipo de usuário (Master ou Cliente) ao carregar o painel
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('painel.html')) {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      alert('Você precisa fazer login!');
      window.location.href = 'index.html';
      return;
    }

    // Decodificar o payload do token (sem precisar de bibliotecas)
    const payloadBase64 = savedToken.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const userRole = payload.role.toUpperCase();
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.innerText = `Você está logado como: ${userRole}`;
    }
  }
});

// Parte de cadastro de usuário
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

// Parte de criar tarefa
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

// Parte de listar tarefas (exibindo na tela)
async function listarTarefas() {
  const res = await fetch('/api/tarefas', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const tarefas = await res.json();
  const lista = document.getElementById('listaTarefas') || document.getElementById('tarefasContainer');
  lista.innerHTML = '';

  tarefas.forEach(tarefa => {
    const div = document.createElement('div');
    div.style.border = "1px solid #ccc";
    div.style.margin = "5px";
    div.style.padding = "5px";
    div.innerHTML = `
      <p><strong>ID:</strong> ${tarefa.id}</p>
      <p><strong>Título:</strong> ${tarefa.titulo}</p>
      <p><strong>Descrição:</strong> ${tarefa.descricao}</p>
      <p><strong>Status:</strong> ${tarefa.status}</p>
    `;
    lista.appendChild(div);
  });
}

// Função logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

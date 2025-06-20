let token = localStorage.getItem('token') || '';

async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem('token', token);
      window.location.href = 'painel.html';
    } else {
      alert('Login inválido!');
    }

  } catch (error) {
    alert('Erro de conexão com o servidor');
  }
}

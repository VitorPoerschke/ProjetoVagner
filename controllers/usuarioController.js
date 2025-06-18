const bcrypt = require('bcryptjs');

// Usuários simulados em memória
let usuarios = [
  { id: 1, nome: 'admin', email: 'admin@site.com', senha: bcrypt.hashSync('123456', 8), role: 'master' },
];

// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
  const usuariosSemSenha = usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email, role: u.role }));
  res.json(usuariosSemSenha);
};

// Criar novo usuário
exports.criarUsuario = (req, res) => {
  const { nome, email, senha, role } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ erro: 'Email já cadastrado.' });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: bcrypt.hashSync(senha, 8),
    role: role || 'cliente'
  };

  usuarios.push(novoUsuario);

  res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
};

// Deletar usuário por ID
exports.deletarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }

  usuarios.splice(index, 1);

  res.json({ mensagem: 'Usuário deletado com sucesso!' });
};

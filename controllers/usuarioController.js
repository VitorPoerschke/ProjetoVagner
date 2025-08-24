const { usuarios } = require('../models/usuarios');
const bcrypt = require('bcryptjs');

// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
  res.json(usuarios);
};

// Buscar usuário por ID
exports.buscarUsuarioPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  res.json(usuario);
};

// Criar novo usuário
exports.criarUsuario = (req, res) => {
  const { nome, email, senha, role } = req.body;
  if (!nome || !email || !senha || !role) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: bcrypt.hashSync(senha, 8),
    role
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
};

// Atualizar usuário
exports.atualizarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const { nome, email, senha, role } = req.body;
  if (nome) usuario.nome = nome;
  if (email) usuario.email = email;
  if (senha) usuario.senha = bcrypt.hashSync(senha, 8);
  if (role) usuario.role = role;

  res.json(usuario);
};

// Deletar usuário
exports.deletarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  usuarios.splice(index, 1);
  res.json({ mensagem: 'Usuário deletado com sucesso' });
};

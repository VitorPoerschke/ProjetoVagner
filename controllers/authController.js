const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { usuarios } = require('../models/usuarios');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Procura o usuário pelo email
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(403).json({ erro: 'Credenciais inválidas' });
  }

  // Gera o token JWT com todos os dados relevantes
  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

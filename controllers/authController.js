const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarios = require('../models/usuarios');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Procura o usuário pelo email
  const usuario = usuarios.find(u => u.email === email);

  // Se usuário não existir ou a senha estiver errada
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(403).json({ erro: 'Credenciais inválidas' });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: usuario.id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Opcional: token expira em 1 hora
  );

  // Retorna o token para o cliente (front-end)
  res.json({ token });
};

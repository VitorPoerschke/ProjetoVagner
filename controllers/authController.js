const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarios = require('../models/usuarios');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const senhaValida = bcrypt.compareSync(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ erro: 'Senha incorreta' });
  }

  const token = jwt.sign(
    { id: usuario.id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' } // Token expira em 8 horas
  );

  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, role: usuario.role } });
};

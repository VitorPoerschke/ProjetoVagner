const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarios = require('../models/usuarios');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(403).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: usuario.id, role: usuario.role }, process.env.JWT_SECRET);
  res.json({ token });
};

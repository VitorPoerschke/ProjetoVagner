const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido' });
    }

    // Aqui garantimos que vai ter os campos padrão
    req.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    };

    next();
  });
}

module.exports = autenticarToken;
// Exporta a função de autenticação para ser usada em outras partes do app
const bcrypt = require('bcryptjs');

// Usuários salvos em memória (futuramente pode virar banco de dados)
const usuarios = [
  {
    id: 1,
    nome: 'Admin Master',
    email: 'admin@site.com',
    senha: bcrypt.hashSync('123456', 8), // Senha já criptografada
    role: 'master', // Pode ser: master, cliente, gerenciador, advogado
  },
];

module.exports = usuarios;
// Exporta a lista de usuários para ser usada nas rotas
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

  {
    id: 2,
    nome: 'cliente jurandir',
    email: 'jurandir@site.com',
    senha: bcrypt.hashSync('123456', 8), // Senha já criptografada
    role: 'cliente', // Pode ser: master, cliente, gerenciador, advogado
  }, 
  {
   id: 3,
    nome: "Exemplo Advogado rogerio",
    email: "advogado@email.com",
    senha: bcrypt.hashSync('123456', 8),
    role: "responsavel"
  },
];


module.exports = { usuarios }; 
// Exporta a lista de usuários para ser usada nas rotas
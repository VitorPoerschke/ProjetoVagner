const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const usuarios = [
  { id: 1, nome: 'admin', email: 'admin@site.com', senha: bcrypt.hashSync('123456', 8), role: 'master' },
];

const tarefas = [];

function autenticarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(403).json({ erro: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: usuario.id, role: usuario.role }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/tarefas', autenticarToken, (req, res) => {
  const { titulo, descricao } = req.body;
  const nova = { id: tarefas.length + 1, titulo, descricao, status: 'aberto', criado_por: req.user.id };
  tarefas.push(nova);
  res.status(201).json(nova);
});

app.get('/tarefas', autenticarToken, (req, res) => {
  res.json(tarefas);
});

app.put('/tarefas/:id/status', autenticarToken, (req, res) => {
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (!tarefa) return res.sendStatus(404);
  tarefa.status = req.body.status;
  res.json(tarefa);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

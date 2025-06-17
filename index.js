const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Importando as Rotas
const authRoutes = require('./routes/auth');
const tarefaRoutes = require('./routes/tarefas');
const usuarioRoutes = require('./routes/usuarios');

// Usando as rotas com prefixo /api
app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Servindo arquivos estáticos (ex: index.html dentro da pasta public)
app.use(express.static(path.join(__dirname, 'public')));

// Porta de execução
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

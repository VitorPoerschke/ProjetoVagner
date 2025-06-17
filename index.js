const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Importando Rotas
const authRoutes = require('./routes/auth');
const tarefaRoutes = require('./routes/tarefas');
const usuarioRoutes = require('./routes/usuarios');  // Agora vai funcionar pois existe!

// Usando as rotas
app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Servir frontend (index.html na pasta public)
app.use(express.static(path.join(__dirname, 'public')));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

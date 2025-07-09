const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const limparHistoricoAntigo = require('./utils/limparHistorico');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Expor a pasta uploads publicamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar Rotas
const authRoutes = require('./routes/auth');
const tarefaRoutes = require('./routes/tarefas');
const usuarioRoutes = require('./routes/usuarios');

// Usar Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Servir o frontend (public/index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Agendador: limpa tarefas do histórico a cada 5 minutos
setInterval(limparHistoricoAntigo, 5 * 60 * 1000);

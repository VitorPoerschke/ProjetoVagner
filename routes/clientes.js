// routes/clientes.js
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const autenticarToken = require('../middleware/auth');

// Apenas usuários autenticads (ex: master) podem cadastrar e listar
router.post('/', clientesController.cadastrarCliente); 
router.get('/', autenticarToken, clientesController.listarClientes);

module.exports = router;

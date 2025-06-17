const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

module.exports = router;
// Exporta as rotas de autenticação para serem usadas no index.js
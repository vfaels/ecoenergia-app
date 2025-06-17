const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota para registrar um novo usuário
router.post('/register', authController.register);

// Rota para fazer login de um usuário
router.post('/login', authController.login);

module.exports = router;
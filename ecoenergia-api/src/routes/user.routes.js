const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rota para obter o perfil do usuário autenticado
// Esta rota só pode ser acessada por usuários autenticados
router.get('/me', authMiddleware.verifyToken, userController.getUserProfile);

module.exports = router;
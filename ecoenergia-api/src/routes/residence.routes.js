const express = require('express');
const router = express.Router();
const residenceController = require('../controllers/residence.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware.verifyToken, residenceController.getResidenceData);

module.exports = router;
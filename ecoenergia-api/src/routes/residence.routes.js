const express = require('express');
const router = express.Router();
const residenceController = require('../controllers/residence.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware.verifyToken, residenceController.getResidenceData);
router.put('/me', authMiddleware.verifyToken, residenceController.updateResidenceSettings);

module.exports = router;
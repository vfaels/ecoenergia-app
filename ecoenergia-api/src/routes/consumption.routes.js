const express = require('express');
const router = express.Router();
const consumptionController = require('../controllers/consumption.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/summary', authMiddleware.verifyToken, consumptionController.getConsumptionSummary);

module.exports = router;
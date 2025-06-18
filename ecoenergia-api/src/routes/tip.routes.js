const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tip.controller');

router.get('/', tipController.getAllTips);

module.exports = router;
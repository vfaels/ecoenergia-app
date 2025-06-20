const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tip.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', tipController.getTips);

router.post(
  '/',
  authMiddleware.verifyToken,
  adminMiddleware.verifyAdmin,
  tipController.createTip
);

module.exports = router;
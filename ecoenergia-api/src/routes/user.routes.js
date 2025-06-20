const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const multer = require('multer');
const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig);

router.get('/me', authMiddleware.verifyToken, userController.getUserProfile);

router.put('/me', authMiddleware.verifyToken, userController.updateUserProfile);

router.put(
  '/me/avatar',
  authMiddleware.verifyToken,
  upload.single('avatar'),
  userController.updateAvatar
);

router.delete(
  '/me/avatar',
  authMiddleware.verifyToken,
  userController.removeAvatar
);

module.exports = router;
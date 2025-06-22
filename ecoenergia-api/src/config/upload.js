// ecoenergia-api/src/config/upload.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};
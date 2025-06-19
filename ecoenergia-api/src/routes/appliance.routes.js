const express = require('express');
const router = express.Router();
const applianceController = require('../controllers/appliance.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.verifyToken);

router.get('/', applianceController.getAppliances);

router.post('/', applianceController.addAppliance);

router.delete('/:id', applianceController.deleteAppliance);

router.put('/:id', applianceController.updateAppliance);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerController);

router.post('/auth', userController.authController);

router.get('/logout', userController.logoutController);

module.exports = router;
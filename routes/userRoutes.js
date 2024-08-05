// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { forgotPassword } = require('../controllers/forgotPassword');
const { resetPassword } = require('../controllers/resetPassword');

router.get('/', auth, userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/check-login-status', auth, userController.checkLoginStatus);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
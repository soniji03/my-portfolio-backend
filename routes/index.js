// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const { forgotPassword } = require('../controllers/forgotPassword');
const { resetPassword } = require('../controllers/resetPassword');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
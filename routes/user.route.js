const express = require('express');
const router = express.Router();

// tes

// ini import function dari controller
const { contohResponse, registerUser, loginUsers, forgotPassword } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route forgot password
router.post('/forgot-password', forgotPassword);

// Route Contoh
router.get('/', contohResponse);

module.exports = router;

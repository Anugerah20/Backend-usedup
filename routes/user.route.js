const express = require('express');
const router = express.Router();

// ini import function dari controller
const { contohResponse, registerUser, loginUsers } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route Contoh
router.get('/', contohResponse);

module.exports = router;

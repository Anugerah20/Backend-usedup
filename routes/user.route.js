const express = require('express');
const router = express.Router();

// ini import function dari controller
const { contohResponse, registerUser } = require('../controllers/user.controller.js')

// router.post('/register', registerUser);

router.post('/register', registerUser);

router.get('/', contohResponse);

module.exports = router;
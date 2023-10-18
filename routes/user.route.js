const express = require('express');
const router = express.Router();

// ini import function dari controller
const { contohResponse } = require('../controllers/user.controller.js')

// ini route untuk contoh response, misal ingin buat route untuk register user, bikin route baru disini
// router.post('/register', registerUser);

router.get('/', contohResponse);

module.exports = router;
const express = require('express');
const router = express.Router();

// tes

// ini import function dari controller
const { contohResponse, registerUser, loginUsers, forgotPassword, checkToken, updatePassword, createAdvert, createCategory } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route forgot password
router.post('/forgot-password', forgotPassword);

// Route check token
router.post('/check-token', checkToken);

// Route updated password
router.post('/update-password', updatePassword);

// Route Advert
router.post('/advert', createAdvert);

// Route Category
router.post('/category', createCategory);

// Route Contoh
router.get('/', contohResponse);

module.exports = router;

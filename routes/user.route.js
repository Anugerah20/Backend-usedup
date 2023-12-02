const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js')

// tes

// ini import function dari controller
const { registerUser, loginUsers, forgotPassword, checkToken, updatePassword, createAdvert, createCategory, showDataUser } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route forgot password
router.post('/forgot-password', authenticateToken,forgotPassword);

// Route check token
router.post('/check-token', authenticateToken,checkToken);

// Route updated password
router.post('/update-password', authenticateToken,updatePassword);

// Route Advert
router.post('/advert', authenticateToken,createAdvert);

// Route Category
router.post('/category', authenticateToken,createCategory);

// Route Get User
router.get("/:id", authenticateToken,showDataUser);

module.exports = router;

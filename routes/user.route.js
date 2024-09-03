const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js')

// tes

// ini import function dari controller
const { registerUser, loginUsers, forgotPassword, checkToken, updatePassword, createAdvert, createCategory, showDataUser, editProfile, verifAccount, confirmVerifAccout, authLoginGoogle, authLoginGoogleCallback } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route start login google
router.get('/auth/google', authLoginGoogle);
router.get('/auth/google/callback', authLoginGoogleCallback);

// Route forgot password
router.post('/forgot-password', authenticateToken, forgotPassword);

// Route check token
router.post('/check-token', authenticateToken, checkToken);

// Route updated password
router.post('/update-password', authenticateToken, updatePassword);

// Route Get User
router.get("/:id", authenticateToken, showDataUser);

router.put("/edit-profile/:id", authenticateToken, editProfile);

router.post("/verifAccount", authenticateToken, verifAccount);

router.put("/confirmVerifAccount/:token", authenticateToken, confirmVerifAccout)

module.exports = router;

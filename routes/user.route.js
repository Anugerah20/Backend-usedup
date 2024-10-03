const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js')

// tes

// ini import function dari controller
const { registerUser, loginUsers, forgotPassword, checkToken, updatePassword, createAdvert, createCategory, showDataUser, editProfile, verifAccount, confirmVerifAccout, userGoogle, getUserGoogle, updateUserGoogle, getKuota } = require('../controllers/user.controller.js')

// Route Register
router.post('/register', registerUser);

// Route login
router.post('/login', loginUsers);

// Route login with google
router.post('/login-google', userGoogle);

// Route get user google
router.get('/user-google/:id', getUserGoogle);

// Route update user google
router.put('/update-user-google/:id', updateUserGoogle);

// Route forgot password
router.post('/forgot-password', forgotPassword);

// Route check token
router.post('/check-token', checkToken);

// Route updated password
router.post('/update-password', updatePassword);

// Route Get User
router.get("/:id", authenticateToken, showDataUser);

router.put("/edit-profile/:id", authenticateToken, editProfile);

router.post("/verifAccount", authenticateToken, verifAccount);

router.put("/confirmVerifAccount/:token", authenticateToken, confirmVerifAccout)

router.get("/kuota/:id", authenticateToken, getKuota)

module.exports = router;

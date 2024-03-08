const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js');
const { getLikeAdvert, createLikeAdvert, deleteLikeAdvert } = require('../controllers/iklan.controller.js');

// Route Get Like Advert
router.get('/getLikeAdvert/:id', getLikeAdvert);

// Route Create Like Advert
router.post('/likeAdvert', authenticateToken, createLikeAdvert);

// Route Delete Like Advert
router.delete('/deleteLikeAdvert/:id', authenticateToken, deleteLikeAdvert);

module.exports = router;
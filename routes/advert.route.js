const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js');
const { createAdvert, getAdvert, getDetailAdvert, getLikeAdvert, createLikeAdvert, deleteLikeAdvert } = require('../controllers/iklan.controller.js');


// Route Advert
router.post('/advert', authenticateToken, createAdvert);

// show all product pagination
router.get('/getAdvert', getAdvert);

// Route detail advert
router.get('/getDetailAdvert/:id', getDetailAdvert);

// Route Get Like Advert
router.get('/getLikeAdvert/:id', getLikeAdvert);

// Route Create Like Advert
router.post('/likeAdvert', authenticateToken, createLikeAdvert);

// Route Delete Like Advert
router.delete('/deleteLikeAdvert', authenticateToken, deleteLikeAdvert);

module.exports = router;
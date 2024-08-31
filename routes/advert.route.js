const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js');
const { createAdvert, getAdvert, getDetailAdvert, deleteAdvert, getAdvertByCategory } = require('../controllers/iklan.controller.js');


// Route Advert
router.post('/advert', authenticateToken, createAdvert);

// show all product pagination
router.get('/getAdvert', getAdvert);

// Route detail advert
router.get('/getDetailAdvert/:id', getDetailAdvert);

// Route delete advert
router.delete('/deleteAdvert/:id', authenticateToken, deleteAdvert);

// get advert by category
router.get('/getAdvertByCategory', getAdvertByCategory);

module.exports = router;
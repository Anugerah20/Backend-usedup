const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js');
const { createAdvert, getAdvert, getDetailAdvert } = require('../controllers/iklan.controller.js');


// Route Advert
router.post('/advert', authenticateToken, createAdvert);

// show all product pagination
router.get('/getAdvert', getAdvert);

// Route detail advert
router.get('/getDetailAdvert/:id', getDetailAdvert);

module.exports = router;
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protect.route.middleware.js');
const { createAdvert, getAdvert } = require('../controllers/iklan.controller.js');


// Route Advert
router.post('/advert', authenticateToken, createAdvert);

// show all product pagination
router.get('/getAdvert', getAdvert);

module.exports = router;
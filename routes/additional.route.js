const express = require('express');
const router = express.Router();

const { getAllCategory, createCategory, getAllProvinces } = require('../controllers/additional.controller.js');
const authenticateToken = require('../middleware/protect.route.middleware.js');

// Route Get All Category
router.get('/category', getAllCategory);

// Route Create Category
router.post('/category', authenticateToken, createCategory);

// Route Get Province
router.get('/province', getAllProvinces)


module.exports = router;
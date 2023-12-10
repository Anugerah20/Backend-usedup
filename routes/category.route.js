const express = require('express');
const router = express.Router();

const { getAllCategory, createCategory } = require('../controllers/category.controller.js');
const authenticateToken = require('../middleware/protect.route.middleware.js');

// Route Get All Category
router.get('/', getAllCategory);

// Route Create Category
router.post('/category', authenticateToken, createCategory);


module.exports = router;
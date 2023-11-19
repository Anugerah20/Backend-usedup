const express = require('express');
const router = express.Router();

const { getAllCategory } = require('../controllers/category.controller.js');

router.get('/', getAllCategory);

module.exports = router;
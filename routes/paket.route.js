const express = require('express');
const { getPaket } = require('../controllers/paket.controller');
const router = express.Router();

// Route Get All Paket
router.get('/', getPaket)

module.exports = router;
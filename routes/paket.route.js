const express = require('express');
const { getPaket, createPaketSorot } = require('../controllers/paket.controller');
const router = express.Router();

// Route Get All Paket
router.get('/', getPaket)

// Route Create Paket Sorot
router.put('/sorot', createPaketSorot)

module.exports = router;
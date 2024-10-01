const express = require('express');
const { postTransaksi, riwayatPembelian, midtransNotification } = require('../controllers/transaksi.controller');
const router = express.Router();

// buat transaksi
router.post('/', postTransaksi)

// riwayat pembelian
router.get('/riwayat/:id', riwayatPembelian)

// handling payment gateway
router.post('/midtrans-notification', midtransNotification)

module.exports = router;
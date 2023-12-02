// routes/protect.route.js

const express = require('express');
const authenticateToken = require('./middleware/protect.route.middleware');

const router = express.Router();
router.use('/edit-profile', authenticateToken);
router.use('/pilih-kategori-', authenticateToken);
router.use('/favorite-product', authenticateToken);
router.use('/detail', authenticateToken);
router.use('/my-advertisement', authenticateToken);
router.use('/profile', authenticateToken);
router.use('/form-jual', authenticateToken);

const express = require('express');
const { generateQr, getTransactionStatus, getTransactionHistory } = require('../controllers/qrController');
const router = express.Router();

router.post('/generate-qr', generateQr);
router.get('/transaction/:id', getTransactionStatus);
router.get('/history', getTransactionHistory);

module.exports = router;
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  payerEmail: { type: String },
  merchantOrderId: { type: String, required: true },
  qrCodeUrl: { type: String },
  status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Payment', PaymentSchema);
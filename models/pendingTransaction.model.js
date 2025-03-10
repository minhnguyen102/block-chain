const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema Transaction
const transactionSchema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

// Schema PendingTransaction (Lưu tạm trước khi đủ 5 giao dịch)
const pendingTransactionSchema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const PendingTransaction = mongoose.model('PendingTransaction', pendingTransactionSchema, "pending-transactions");
module.exports = PendingTransaction;

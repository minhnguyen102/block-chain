const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema của Transaction với các trường mở rộng
const transactionSchema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

// Schema của Block
const blockSchema = new Schema({
  index: { type: Number, required: true },
  previousHash: { type: String, required: true },
  timestamp: { type: Number, required: true },
  hash: { type: String, required: true },
  transactions: [transactionSchema]  // nhúng danh sách các transaction
}, { timestamps: true });

// Model cho Block (transaction được nhúng nên không cần model riêng)
const Block = mongoose.model('Block', blockSchema);

module.exports = { Block };

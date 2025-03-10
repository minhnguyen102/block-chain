const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema Transaction
const transactionSchema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

// Schema Block
const blockSchema = new Schema({
  index: { type: Number, required: true },
  previousHash: { type: String, required: true },
  timestamp: { type: Number, required: true },
  hash: { type: String, required: true },
  transactions: [transactionSchema]
}, { timestamps: true });

const Block = mongoose.model('Block', blockSchema,"block-chain");
module.exports = Block;

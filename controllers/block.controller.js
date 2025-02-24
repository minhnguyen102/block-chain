const crypto = require('crypto');

class Block {
    constructor(index, previousHash, timestamp, transactions, hash) {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions; // mảng các transaction
      this.hash = hash;
    }
  }
  
  /**
   * Lớp Transaction: định nghĩa một giao dịch
   */
  class Transaction {
    constructor(fromAddress, toAddress, amount, message) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.message = message;
    }
  }
  
  /**
   * Lớp Blockchain: quản lý chuỗi các block và pool giao dịch pending
   */
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.pendingTransactions = [];  // danh sách giao dịch chờ xử lý
      this.transactionsPerBlock = 5;  // số transaction tối đa trước khi tạo block mới
    }
  
    // Tạo Genesis Block (khối đầu tiên)
    createGenesisBlock() {
      const timestamp = Math.floor(Date.now() / 1000);
      return new Block(0, '0', timestamp, [], this.calculateHash(0, '0', timestamp, []));
    }
  
    // Tính toán hash cho block
    calculateHash(index, previousHash, timestamp, transactions) {
      return crypto.createHash('sha256')
        .update(index + previousHash + timestamp + JSON.stringify(transactions))
        .digest('hex');
    }
  
    // Thêm transaction vào pool pending
    addTransaction(transaction) {
      this.pendingTransactions.push(transaction);
      console.log(`Đã thêm transaction: ${transaction.message}`);
      // Nếu đủ số lượng transaction cần cho 1 block thì tự động tạo block mới
      if (this.pendingTransactions.length >= this.transactionsPerBlock) {
        this.createBlockFromPending();
      }
    }
  
    // Tạo block mới từ các transaction pending
    createBlockFromPending() {
      const index = this.chain.length;
      const previousHash = this.chain[index - 1].hash;
      const timestamp = Math.floor(Date.now() / 1000);
      const newBlock = new Block(index, previousHash, timestamp, this.pendingTransactions, 
                                 this.calculateHash(index, previousHash, timestamp, this.pendingTransactions));
      this.chain.push(newBlock);
      console.log(`Block ${index} đã được tạo với ${this.pendingTransactions.length} transaction.`);
      // Reset danh sách pendingTransactions
      this.pendingTransactions = [];
    }
  }
  
  // Tạo đối tượng blockchain mới
let myBlockchain = new Blockchain();
module.exports.index = (req, res) => {
    console.log(myBlockchain.pendingTransactions)
    res.render('block', { 
        blockchain: myBlockchain,
        pendingCount: myBlockchain.pendingTransactions.length,
        pendingTransactions : myBlockchain.pendingTransactions
    });
    // res.render("block.pug")
}

module.exports.addTransaction = (req, res) => {
    const { fromAddress, toAddress, amount, message } = req.body;
    if (message) {
        const tx = new Transaction(fromAddress, toAddress, amount, message);
        myBlockchain.addTransaction(tx);
    }
    res.redirect('back');

}
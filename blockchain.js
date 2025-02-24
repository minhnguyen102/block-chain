const crypto = require('crypto');

// Khối Block
class Block {
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
  }
}

// Blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // Tạo Genesis Block (khối đầu tiên)
  createGenesisBlock() {
    return new Block(0, '0', 1609459200, 'Genesis Block', this.calculateHash(0, '0', 1609459200, 'Genesis Block'));
  }

  // Tính toán hash cho mỗi khối
  calculateHash(index, previousHash, timestamp, data) {
    return crypto.createHash('sha256').update(index + previousHash + timestamp + JSON.stringify(data)).digest('hex');
  }

  // Lấy khối mới từ dữ liệu
  createNewBlock(data) {
    const index = this.chain.length;
    const previousHash = this.chain[index - 1].hash;
    const timestamp = Math.floor(Date.now() / 1000);  // Thời gian Unix (giây)
    const hash = this.calculateHash(index, previousHash, timestamp, data);
    const newBlock = new Block(index, previousHash, timestamp, data, hash);
    this.chain.push(newBlock);
  }

  // Kiểm tra tính hợp lệ của Blockchain
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Kiểm tra xem hash có hợp lệ không
      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.data)) {
        return false;
      }

      // Kiểm tra tính liên kết với khối trước
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Tạo một blockchain mới
let myBlockchain = new Blockchain();

// Thêm các khối vào blockchain
myBlockchain.createNewBlock("First block after genesis");
myBlockchain.createNewBlock("Second block after genesis");
myBlockchain.createNewBlock("Third block after genesis");
myBlockchain.createNewBlock("Four block after genesis");

// In ra blockchain
console.log(JSON.stringify(myBlockchain, null, 4));

// Kiểm tra tính hợp lệ của blockchain
console.log("Blockchain valid: " + myBlockchain.isValid());

// Tạo cặp khóa RSA (private và public key) 
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Độ dài khóa (2048 bit là tiêu chuẩn)
});

// In ra private key và public key
console.log("Private Key:");
console.log(privateKey.export({ type: 'pkcs1', format: 'pem' }));

console.log("\nPublic Key:");
console.log(publicKey.export({ type: 'pkcs1', format: 'pem' }));

// Mã hóa và giải mã  một thông tin 
const message = "Hello, BlockChain.1";

// Mã hóa thông tin bằng publicKey
const encryptedMessage = crypto.publicEncrypt(
    publicKey,
    Buffer.from(message)  // Chuyển thông điệp thành buffer
);
console.log("Mã hóa thông tin:", encryptedMessage.toString('base64'));  // In ra thông điệp đã mã hóa dưới dạng base64


// Giải mã thông tin bằng privateKey
const decryptedMessage = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedMessage, 'base64')  // Chuyển thông điệp mã hóa từ base64 thành buffer
  );

console.log("Giải mã thông tin:", decryptedMessage.toString());  // In ra thông điệp đã giải mã

// Tạo chữ kí số bằng privateKey 
console.log("----------------------------");
console.log("Chương trình tạo chữ kí số bằng privateKey.")
// Thông điệp cần tạo chữ ký
const messageToSign = 'This is a message to sign';

// Tạo chữ ký số với private key
const sign = crypto.createSign('SHA256');
sign.update(messageToSign);
const signature = sign.sign(privateKey, 'base64');  // Ký thông điệp bằng private key và chuyển kết quả thành base64

console.log("Tạo chữ kí số (Base64):", signature);

// Xác thực chữ ký bằng public key
const verify = crypto.createVerify('SHA256');
verify.update(messageToSign);
const isVerified = verify.verify(publicKey, signature, 'base64');  // Xác thực chữ ký

console.log("Xác thực chữ ký số:", isVerified);



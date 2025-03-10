const crypto = require('crypto');
const Block = require('../models/block.model'); // Model Block đã định nghĩa
const PendingTransaction = require('../models/pendingTransaction.model'); // Collection chứa giao dịch chờ xử lý
const mongoose = require('mongoose');

// Thêm transaction vào pending collection
module.exports.addTransaction = async (req, res) => {
    const { fromAddress, toAddress, amount, message } = req.body;

    if (!fromAddress || !toAddress || !amount || !message) {
        return res.status(400).send("Thiếu thông tin giao dịch!");
    }

    try {
        // Thêm transaction vào danh sách pending
        const newTransaction = new PendingTransaction({ fromAddress, toAddress, amount, message, timestamp: Date.now() });
        await newTransaction.save();

        // Kiểm tra số lượng transaction pending
        const pendingTransactions = await PendingTransaction.find();
        
        if (pendingTransactions.length >= 5) {
            // Khi đủ 5 transaction, tạo block mới
            let latestBlock = await Block.findOne().sort({ index: -1 });
            if (!latestBlock) {
                latestBlock = { index: -1, hash: "0" }; // Nếu chưa có block nào, dùng giá trị mặc định
            }

            // Tạo block mới với danh sách transaction
            const newBlock = new Block({
                index: latestBlock.index + 1,
                previousHash: latestBlock.hash,
                timestamp: Date.now(),
                transactions: pendingTransactions, // Gộp tất cả transaction pending vào block mới
                hash: crypto.createHash('sha256').update(JSON.stringify(pendingTransactions)).digest('hex')
            });

            await newBlock.save();
            await PendingTransaction.deleteMany({}); // Xóa các transaction pending sau khi đã tạo block
        }

        res.redirect('back');
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).send("Lỗi server!");
    }
};

// Hiển thị danh sách transaction pending
module.exports.index = async (req, res) => {
    try {
        // Lấy danh sách transaction pending
        const pendingTransactions = await PendingTransaction.find();
        
        // Lấy toàn bộ danh sách block từ database, sắp xếp theo thứ tự index tăng dần
        const blocks = await Block.find().sort({ index: 1 });

        // Render ra view với dữ liệu block và pending transactions
        res.render('block', {
            pendingCount: pendingTransactions.length,
            pendingTransactions: pendingTransactions,
            blocks
        });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).send("Lỗi server!");
    }
};





const express = require("express")
const router = express.Router()
// const controller = require("../controllers/block.controller")
const controller = require("../controllers/block2.controller")


router.get("/", controller.index)
router.post("/add-transaction", controller.addTransaction)


module.exports = router;
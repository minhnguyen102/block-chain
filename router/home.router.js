const express = require("express")
const router = express.Router()
const controller = require("../controllers/home.controller")

router.get("/", controller.index)

router.get("/encrypt", controller.index)
router.post("/encrypt", controller.encrypt)

router.get("/decrypt", controller.index)
router.post("/decrypt", controller.decrypt)

module.exports = router;
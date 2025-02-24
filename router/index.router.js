const express = require("express")
const router = express.Router()
const homeRouter = require("./home.router")
const blockRouter = require("./block.router")

module.exports = (app) =>{
    app.use("/", homeRouter)
    app.use("/block", blockRouter)
}


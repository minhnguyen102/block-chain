const express = require('express')
const app = express()
const port = 3000
const router = require("./router/index.router")
const bodyParser = require('body-parser');
const path = require('path');
const database = require("./config/database");



database.connect();


app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

router(app);

require("dotenv").config();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
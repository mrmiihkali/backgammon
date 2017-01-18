var express = require('express')
var router = express.Router()
var path = require('path')

// define the home page route
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/../views/board.html'))
})

module.exports = router
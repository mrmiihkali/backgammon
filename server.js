
// Initialises server

var express = require('express')
var app = express()

app.use(express.static('public'))

var match_route = require('./routes/match_route')
app.use('/match', match_route)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


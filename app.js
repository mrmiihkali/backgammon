
require('./config/setup')
require('./models/load')

var express = require('express')
var app = express()

app.use(express.static('public'))

var test_route = require('./routes/test_route')
app.use('/test', test_route)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
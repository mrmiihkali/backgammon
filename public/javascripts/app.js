
require('./config/setup')

var Match = require('./models/match')

var match = new Match({player_0: 'foo'})

match.save().then(function(doc) {
  console.log(doc)
})

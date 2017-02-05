
require('./config/setup')
require('./models/load')

var parser = require('argv-parser');
var rules = {
  'start-server': {
    type: String
  }
}

params = parser.parse(process.argv, { rules: rules })

if (params.parsed['start-server'])
  require('./server.js')
else
  require('./cli.js')


require('../test_helper')

var match = require('../route_helper')('../routes/match')

describe('Match', function() {
  it('GET / should return list of matches', function() {
    res = match.get('/')

    expect(res.code).to.equal(200)

  })
})


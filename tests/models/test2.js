var chai = require('chai')
var expect = chai.expect

var TestModel2 = require('../../models/test_model')

describe('TestModel', function() {
  it('test() should return true', function() {
    var test = new TestModel2()
    expect(test.test()).to.equal(true)
  })
})


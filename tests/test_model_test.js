var chai = require('chai')
var expect = chai.expect

var TestModel = require('../models/test_model')

describe('TestModel', function() {
  it('test() should return true', function() {
    var test = new TestModel()
    expect(test.test()).to.equal(true)
  })
})

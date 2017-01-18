if (typeof(chai) == 'undefined') {
  chai = require('chai')
  var chaiAsPromised = require("chai-as-promised")
  chai.use(chaiAsPromised)
  expect = chai.expect
}


var express = require('express')
var router = express.Router()
var path = require('path')


router.get('/', function (req, res) {
  console.log('GET all matches')
  res.status(200)
  res.end()
})

router.get('/:id', function (req, res) {
  console.log('GET match/')

  res.end()
})

router.put('/:id', function (req, res) {
  console.log('GET match/')

  res.end()
})

router.post('/:id', function (req, res) {

  res.end()
})

module.exports = router
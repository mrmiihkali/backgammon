
var GameState = require('../lib/gamestate.js')

var schema = new MONGOOSE.Schema(
  { 
    id: String,
    game_id: String,
    number: Number,
    action: String,
    roll: String,
    move_0: String,
    move_1: String,
    move_2: String,
    move_3: String,
    committed: Boolean
  })

schema.statics.roll = function(die_1, die_2)
{
  console.log("New roll " + die_1 + " " + die_2)
  var move = new Move({action: 'roll', roll: "" + die_1 + "," + die_2})

  move.save().then(function(err) {
    if (err) {
      console.log(err)
      return null
    }
  })

  return move
}

module.exports = MONGOOSE.model('Move', schema)
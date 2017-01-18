
var Game = MONGOOSE.model('Game', 
  { 
    id: String,
    match_id: String,
    number: Number
  });

module.exports = Game
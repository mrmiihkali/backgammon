
var Match = MONGOOSE.model('Match', 
  { 
    id: String,
    player_0: String,
    player_1: String,
    length: Number,
    crawford: Boolean,
    jacoby: Boolean,
    beavers: Boolean,
    automatics: Number,
    carry_overs: Boolean,
    application_data: String,
    date: { type: Date, default: Date.now }
  });

module.exports = Match
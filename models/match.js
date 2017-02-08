
var schema = new MONGOOSE.Schema(
  { 
    id: String,
    description: String,
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


schema.statics.list = function(opts) {
    return Match.find().limit(10).select('_id description').exec()
}

var Match = MONGOOSE.model('Match', schema)
module.exports = Match

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
    return this.model('Match').find().limit(10).select('_id description').exec()
}

schema.methods.games = function() {
    return this.model('Game').find( { match_id: this._id }).exec()
}

module.exports = MONGOOSE.model('Match', schema)
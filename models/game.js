
var schema = new MONGOOSE.Schema(  
  { 
    id: String,
    match_id: String,
    number: Number
  });

schema.statics.list = function(opts) {
    return this.model('Game').find().limit(10).select('_id match_id').exec()
}

module.exports = MONGOOSE.model('Game', schema)
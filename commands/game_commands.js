
var ObjectId = require('mongoose').Types.ObjectId

var game_commands = function(vorpal) {

  vorpal
    .command('list games', 'List games.')
    .action(function(args, callback) {
      Game.list(null).then(function(res) {
        console.log('_id | match_id')
        res.forEach(function(g) {
          console.log(g._id + '\t' + g.match_id)
        })
        callback()
      })
    })

  vorpal
    .command('inspect game <game id>', 'Print game details')
    .action(function(args, callback) {
      Game.findOne( { _id: new ObjectId(args['game id']) } ).exec().then(function(res) {
        if (res == null) {
          console.log('Game not found.')
        }
        else {
          console.log(res)
        }

        callback()
      })
    })

}

module.exports = game_commands


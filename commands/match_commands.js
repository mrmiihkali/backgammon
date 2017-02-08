
var ObjectId = require('mongoose').Types.ObjectId

var match_commands = function(vorpal) {
  vorpal
    .command('start match', 'Starts a new match.')
    .option('-d, --description <desc>', 'Description.')
    .option('-p0, --player_0 <name>', 'Player 0 name.')
    .option('-p1, --player_1 <name>', 'Player 1 name.')
    .option('-l, --length <length>', 'Length of the match, 0 for money session. Default 5.')
    .option('-c, --crawford', 'Use Crawford rule. Default true.')
    .option('-j, --jacoby', 'Use Jacoby rule. Default true.')
    .option('-b, --beavers', 'Allow beavers. Default true.')
    .option('-a, --automatics', 'Number of automatics. -1 for unlimited. Default 1.')
    .option('-o, --carry-overs', 'Carry over automatics to successive games. Default true.')
    .action(function(args, callback) {
      
      var match = new Match()
      o = args.options

      match.description = o.description || 'Match ' + match._id
      match.player_0 = o.player_0 || 'Player 0'
      match.player_1 = o.player_1 || 'Player 1'
      match.length = parseInt(o.length) || 5
      match.crawford = o.crawford == null ? true : o.crawford
      match.jacoby = o.jacoby == null ? true : o.jacoby
      match.beavers = o.beavers == null ? true : o.beavers
      match.carry_overs = o['carry-overs'] == null ? true : o['carry-overs']
      match.automatics = parseInt(o.automatics) || 1

      var game = new Game()
      game.match_id = match._id
      game.number = 0
      game.save().then(function(res) {
        match.save().then(function(res) {
          console.log('New match started.')
          callback()
        })        
      })

    })

  vorpal
    .command('list matches', 'List matches.')
    .action(function(args, callback) {
      Match.list(null).then(function(res) {
        console.log('_id | description')
        res.forEach(function(m) {
          console.log(m._id + '\t' + m.description)
        })
        callback()
      })
    })

  vorpal
    .command('inspect match <match id>', 'Print match details')
    .action(function(args, callback) {
      Match.findOne( { _id: new ObjectId(args['match id']) } ).exec().then(function(res) {
        if (res == null) {
          console.log('Match not found.')
          callback()
        }
        else {
          console.log(res)
          res.games().then(function(res) {
            console.log('Games')
            console.log(res)
            callback()
          })
        }
      })

    })

  vorpal
    .command('delete match <match id>', 'Delete a match.')
    .action(function(args, callback) {
      Match.findOne( { _id: new ObjectId(args['match id']) } ).exec().then(function(res) {
        if (res == null) {
          console.log('Match not found.')
          callback()
        }
        else {
          Match.remove( { _id: new ObjectId(args['match id']) }, function(res) {
            if (res != null) {
              console.log(res)
            }
            else {
              console.log('Deleted')
            }
            callback()
          })
    
        }
      })

    })
}

module.exports = match_commands


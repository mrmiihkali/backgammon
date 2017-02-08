// Initialises vorbal commands for CLI

var vorpal = require('vorpal')();

require('./commands/match_commands.js')(vorpal)
require('./commands/game_commands.js')(vorpal)

if (process.argv.length > 2) {
  vorpal
    .delimiter('')
    .parse(process.argv);
    // Vorpal misbehaves...exit explicitly
    process.exit(0)
}
else {
  vorpal
    .delimiter('bg$')
    .show();
}
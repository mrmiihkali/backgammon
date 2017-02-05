// Initialises vorbal commands for CLI

var vorpal = require('vorpal')();

vorpal
      .command('test', 'Outputs test stuff')
      .action(function(args, callback) {
        this.log('Testing...');
        callback();
      })

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
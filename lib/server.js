var fs = require('fs'),
    path = require('path'),
    server = require('../scripts/server.js');

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder.');
    return;
  }

  server.run();
}

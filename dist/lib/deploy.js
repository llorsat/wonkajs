var fs = require('fs'),
    path = require('path'),
    deploy = require('../scripts/deploy');

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log('You need to be on root of your project folder.');
    return false;
  }

  deploy.compress();
}
var fs = require('fs'),
    path = require('path'),
    deploy = require('../scripts/deploy');



module.exports.builder = function() {
  if (!path.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log('You need to be on root of your project folder.');
    return false;
  }

  deploy.compress();
}
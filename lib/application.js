var utils = require('./utils.js'),
    app = require('../scripts/application.js'),
    path = require('path');

module.exports.builder = function(params) {
  var name = typeof params === "string" ? params : path.join.apply(path, params);
  if (!path.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder');
    return false;
  }
  
  /*if (path.existsSync(path.join(process.cwd(), name))) {
    console.info('Application already exists');
    return false;
  }*/
  
  app.create(params);
}

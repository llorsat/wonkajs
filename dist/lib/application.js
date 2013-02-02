var utils = require('./utils.js'),
    app = require('../scripts/application.js'),
    fs = require('fs'),
    path = require('path');

var checkDirectory = function(params, success) {
  var name = typeof params === "string" ? params : path.join.apply(path, params);
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder');
    return false;
  }
  success(params);
};

module.exports.builder = function(params) {
  checkDirectory(params, function() {
    app.create(params);  
  });
}

module.exports.builderOauth = function(params) {
  checkDirectory(params, function() {
    app.createOauth(params);
  });
}

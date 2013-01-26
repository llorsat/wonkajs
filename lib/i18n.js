
var i18n = require('../scripts/i18n.js')
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

module.exports.builder = function(name) {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder.');
    return;
  }

  i18n.inspectI18n();
}

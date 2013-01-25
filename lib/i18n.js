
var i18n = require('../scripts/i18n.js')
var exec = require('child_process').exec;
var path = require('path');

module.exports.builder = function(name) {
  if (!path.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder.');
    return;
  }

  i18n.inspectI18n();
}

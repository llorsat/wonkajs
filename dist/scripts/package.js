var fs = require('fs'),
    path = require('path'),
    utils = require('../lib/utils.js');

module.exports.builder = function(name) {
  var existsSync = fs.existsSync || path.existsSync;

  var projectDir = process.cwd();

  var modulePath = path.join(projectDir, name);

  if(!existsSync(path.join(projectDir, name))) {
    console.log('Package folder doesn\'t exists');
    return false;
  }

  if (!existsSync(path.join(projectDir, 'package.json'))) {
    console.info('You need to be on root of your project folder');
    return false;
  }

  var pkgPath = path.join(modulePath, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  for(var resource in pkg.resources) {
    for(var item in pkg.resources[resource]) {
      var orig = path.join(projectDir, resource, pkg.resources[resource][item]);
      var dest = path.join(modulePath, resource);
      utils.copy(orig, dest);
    }
  }

  try {
    fs.mkdirSync(path.join(modulePath, 'libraries'), '0755');
  } catch(e) {}

  for(var library in pkg.libraries) {
    var orig = path.join(projectDir, 'libraries', pkg.libraries[library] + '.js');
    var dest = path.join(modulePath, 'libraries', pkg.libraries[library] + '.js');
    utils.copy(orig, dest);
  }

}

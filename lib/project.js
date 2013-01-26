var utils = require('./utils.js'),
    fs = require('fs'),
    path = require('path');

var packageTemplate = function(params) {
  var template = fs.readFileSync(__dirname + '/../templates/package.template').toString();
  var output = utils.buildTemplate(template, params);
  utils.writeFile('package.json', output);
}

module.exports.builder = function(name) {
  var existsSync = fs.existsSync || path.existsSync;
  // Create project directory and manifest
  if(existsSync(path.join(process.cwd(), name))) {
    console.log('Project  already exists');
  } else if (!existsSync(path.join(process.cwd(), 'package.json'))) {

    var projectDir = utils.mkdir(name);

    packageTemplate({
      name: name,
      jsSrcDeployPath: path.join(projectDir, 'deploy/_main_prototype_.js'),
      jsDestDeployPath: path.join(projectDir, 'deploy/main.js')
    });

    utils.copy(__dirname + '/../templates/development_index.template', projectDir + '/index.html');
    utils.copy(__dirname + '/../templates/security/404.template', projectDir + '/404.html');
    utils.copy(__dirname + '/../templates/security/500.template', projectDir + '/500.html');
    utils.copy(__dirname + '/../templates/security/crossdomain.template', projectDir + '/crossdomain.txt');
    utils.copy(__dirname + '/../templates/security/robots.template', projectDir + '/robots.txt');
    utils.copy(__dirname + '/../templates/security/humans.template', projectDir + '/humans.txt');
    utils.copy(__dirname + '/../templates/core', projectDir + '/core');
    utils.copy(__dirname + '/../templates/libraries', projectDir + '/libraries');
    utils.copy(__dirname + '/../templates/main', projectDir + '/main');
    utils.copy(__dirname + '/../templates/root', projectDir + '/root');
    utils.copy(__dirname + '/../templates/icons', projectDir + '/icons');
    utils.copy(__dirname + '/../templates/stylesheets', projectDir + '/stylesheets');
    console.info('Project created');
    console.info('=============================================');
    console.info('Now change to your project directory and run:');
    console.info('$ wonkajs server');
  } else {
    console.info('Project command just can be runned out a wonkajs project directory');
  }
}
var utils = require('../lib/utils.js'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var arch = {
  'root': 'root',
  'stylesheets': 'stylesheets',
  'libraries': 'libraries',
  'core': 'core',
  'icons': 'icons',
  'index.hbs': 'index.hbs'
};

var done = function(name) {
  console.info('Project created');
  console.info('=============================================');
  console.info('Now run:');
  console.info('$ cd ' + name);
  console.info('$ wonkajs server');
}

module.exports.builder = function(name, kwargs) {
  var existsSync = fs.existsSync || path.existsSync;

  if(existsSync(path.join(process.cwd(), name))) {
    console.log('Project  already exists.');
    return false;
  }

  if (existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('Project command just can be runned out a wonkajs project directory');
    return false;
  }

  var projectDir = utils.mkdir(name);
  var pkgPath = path.join(__dirname, '..', 'templates', 'package.json');
  var pkgTemplate = fs.readFileSync(pkgPath).toString();
  var projectData = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: kwargs.description || 'Write a description',
    version: kwargs.version || '0.0.1',
    author: kwargs.author || '',
    install_button: kwargs.install_button || false
  };
  var pkgOutput = utils.buildTemplate(pkgTemplate, projectData);
  utils.writeFile('package.json', pkgOutput);
  var counter = 0;
  for (var i in arch) {
    var src = path.join(__dirname, '..', 'templates', i);
    var dest = path.join(projectDir, arch[i]);
    utils.copy(src, dest);
  }
  try {
    exec('git init && git add * && git commit -a -m "first commit"', {cwd: projectDir}, function() {
      done(name);
    });
  } catch(e) {
    done(name);
  }
}

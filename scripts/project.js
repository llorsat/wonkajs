var utils = require('../lib/utils.js'),
    fs = require('fs'),
    path = require('path');

var arch = {
  'root': 'root',
  'stylesheets': 'stylesheets',
  'libraries': 'libraries',
  'images': 'images',
  'main': 'main',
  'core': 'core',
  'fonts': 'fonts',
  'icons': 'icons',
  'security/404.html': '404.html',
  'security/500.html': '500.html',
  'security/robots.txt': 'robots.txt',
  'security/humans.txt': 'humans.txt',
  'security/crossdomain.xml': 'crossdomain.xml',
  'body.html': 'index.html'
};

module.exports.builder = function(name) {
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
  var pkgPath = path.join(__dirname, '..', 'templates', 'package.template');
  var template = fs.readFileSync(pkgPath).toString();
  var output = utils.buildTemplate(template, {
    name: name
  });
  utils.writeFile('package.json', output);
  for (var i in arch) {
    var src = path.join(__dirname, '..', 'templates', i);
    var dest = path.join(projectDir, arch[i]);
    utils.copy(src, dest);
  }
  console.info('Project created');
  console.info('=============================================');
  console.info('Now run:');
  console.info('$ cd ' + name);
  console.info('$ wonkajs server');
  
}

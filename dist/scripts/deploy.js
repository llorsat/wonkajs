var fs = require('fs'),
    path = require('path'),
    utils = require('../lib/utils.js');

var scripts = '<script src="main.js"></script>';

var stylesheets = '<link rel="stylesheet" type="text/css" href="main.css">';

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log('You need to be on root of your project folder.');
    return false;
  }

  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  try {
    fs.mkdirSync(path.join(projectDir, 'deploy'), 0755);
  } catch(err) {}

  //Copy folders defined to deploy
  var folders = pkg.settings.deploy.folders;
  for (var i = 0; i < folders.length; i++) {
    var src = path.join(projectDir, folders[i]);
    var dest = path.join(projectDir, 'deploy', folders[i]);
    if (existsSync(src)) {
      utils.copy(src, dest);
    }
  }

  utils.compressJS();

  utils.joinTemplates(scripts, stylesheets);

  utils.compressCSS();

  fs.writeFile(path.join(projectDir, 'deploy', 'package.json'), JSON.stringify(pkg, null, 2), function (err) {
    if (err) throw err;
  });
  
  console.info('Project ready for deploy');
  console.info('=============================================');
  console.info('Now run:');
  console.info('$ wonkajs server');
  console.info('And visit at: http://localhost:9300/deploy/index.html');
}

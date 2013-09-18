var fs = require('fs'),
    path = require('path'),
    hbs = require('handlebars'),
    utils = require('../lib/utils.js');

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log('You need to be on root of your project folder.');
    return false;
  }

  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var manifestPath = path.join(projectDir, 'manifest.webapp');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  try {
    fs.mkdirSync(path.join(projectDir, 'deploy'), 0755);
  } catch(err) {}

  //Copy folders defined to deploy
  var folders = pkg.settings.deploy.folders;

  //Copy files defined to deploy
  var files = pkg.settings.deploy.files;

  // if i18n specified add languages folder to deploy
  folders.push('languages');

  for (var i = 0; i < folders.length; i++) {
    var src = path.join(projectDir, folders[i]);
    var dest = path.join(projectDir, 'deploy', folders[i]);
    if (existsSync(src)) {
      utils.copy(src, dest);
    }
  }

  for (var i = 0; i < files.length; i++) {
    var src = path.join(projectDir, files[i]);
    var dest = path.join(projectDir, 'deploy', files[i]);
    if (existsSync(src)) {
      utils.copy(src, dest);
    }
  }

  utils.compressJS();
  utils.compressCSS();

  var templateString = fs.readFileSync(path.join(projectDir, 'index.hbs'), 'utf-8');
  var template = hbs.compile(templateString);
  
  var data = {
    'development': false,
    'templates': utils.getTemplates(),
    'version': pkg.version,
    'name': pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
    'description': pkg.description
  }

  fs.writeFileSync(path.join(projectDir, 'deploy', 'index.html'), template(data));

  delete pkg.settings['deploy']

  fs.writeFile(path.join(projectDir, 'deploy', 'package.json'), JSON.stringify(pkg, null, 2), function (err) {
    if (err) throw err;
  });

  fs.writeFile(path.join(projectDir, 'deploy', 'manifest.webapp'), JSON.stringify(manifest, null, 2), function (err) {
    if (err) throw err;
  });

  if(manifest.type == 'privileged' || manifest.type == 'certified') {
    //TODO: Generate zip file for marketplace
  }
  
  console.info('Project ready for deploy');
  console.info('=============================================');
  console.info('Now run:');
  console.info('$ wonkajs server');
  console.info('And visit at: http://localhost:9300/deploy/index.html');
}

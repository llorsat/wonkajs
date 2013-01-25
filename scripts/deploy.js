var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    exec = require('child_process').exec,
    ncp = require('ncp').ncp,
    utils = require('../lib/utils.js'),
    jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify,
    projectDir = '',
    env = '';

var copyImages = function() {
  var imagesSrc = path.join(projectDir, 'stylesheets', 'images');
  var imagesDest = path.join(projectDir, 'deploy', 'images');
  utils.copy(imagesSrc, imagesDest);
}

var joinJavascriptCode = function() {
  var modernizr = fs.readFileSync(__dirname + '/../templates/core/contrib/modernizr.js').toString();
  var appPath = path.join(projectDir, 'core', 'app.js');
  var app = fs.readFileSync(appPath).toString();
  var code = modernizr + '\n' + app + '\n';
  for (var i = 0; i < env.libraries.length; i++) {
    code += fs.readFileSync(path.join(projectDir, 'libraries', env.libraries[i]+'.js'),'utf8');
  }
  for (var i = 0; i < env.applications.length; i++) {
    var initFile = path.join(projectDir, env.applications[i] , 'init.js');
    var modelsFile = path.join(projectDir, env.applications[i], 'models.js');
    var collectionsFile = path.join(projectDir, env.applications[i], 'collections.js');
    var viewsFile = path.join(projectDir, env.applications[i], 'views.js');
    var routerFile = path.join(projectDir, env.applications[i], 'router.js');
    code += fs.readFileSync(initFile,'utf8');
    code += fs.readFileSync(routerFile,'utf8');
    code += fs.readFileSync(modelsFile,'utf8');
    code += fs.readFileSync(collectionsFile,'utf8');
    code += fs.readFileSync(viewsFile,'utf8');
  }
  for (var i = 0; i < env.main_files.length; i++) {
    code += fs.readFileSync(path.join(projectDir, 'main', env.main_files[i]+'.js'),'utf8');
  }

  code += '\nwindow.main();';

  var ast = jsp.parse(code);
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  fs.writeFileSync(path.join(projectDir, 'deploy', 'main.js'), pro.gen_code(ast));
}

var joinHTMLCode = function() {
  var code = fs.readFileSync(__dirname + '/../templates/deploy_index.template', 'utf8') +'\n';
  for (var i=0; i < env.applications.length; i++) {
    var templates = fs.readdirSync(path.join(projectDir, env.applications[i], 'templates'));
    for (var j=0; j < templates.length; j++) {
      var html = path.join(projectDir, env.applications[i], 'templates', templates[j]);
      code += fs.readFileSync(html,'utf8') + '\n\n';
    }
  }
  code += '<script src="main.js"></script>\n</body>\n</html>';
  fs.writeFileSync(path.join(projectDir, 'deploy', 'index.html'), code);
}

module.exports.compress = function() {
  projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  env = pkg.settings.environment;

  var settings = pkg.settings;

  try {
    fs.mkdirSync(path.join(projectDir, 'deploy'), 0755);
  } catch(err) {}

  copyImages();

  joinJavascriptCode();

  joinHTMLCode();

  var cssSrc = path.join(projectDir, 'stylesheets', 'ui.less');
  var cssDest = path.join(projectDir, 'deploy', 'main.css');

  exec('lessc -x ' + cssSrc + ' ' + cssDest);

  var languagesSrc = path.join(projectDir, 'languages');
  var languagesDest = path.join(projectDir, 'deploy', 'languages');

  utils.copy(languagesSrc, languagesDest);

  console.log('Project ready for deploy');
}
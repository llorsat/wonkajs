var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    exec = require('child_process').exec,
    ncp = require('ncp').ncp,
    utils = require('../lib/utils.js'),
    jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify,
    less = require('less'),
    projectDir = '',
    env = '';

var copyImages = function() {
  var imagesSrc = path.join(projectDir, 'stylesheets', 'images');
  var imagesDest = path.join(projectDir, 'deploy', 'images');
  utils.copy(imagesSrc, imagesDest);
}

var copyIcons = function() {
  var iconsSrc = path.join(projectDir, 'icons');
  var iconsDest = path.join(projectDir, 'deploy', 'icons');
  utils.copy(iconsSrc, iconsDest);
}

var joinJavascriptCode = function() {
  var modernizr = fs.readFileSync(__dirname + '/../templates/core/contrib/modernizr.js').toString();
  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var pkgCode = JSON.stringify(pkg);
  var appPath = path.join(projectDir, 'core', 'app.js');
  var app = fs.readFileSync(appPath).toString();
  var code = modernizr + '\n' + app + '\n';

  // set package json
  code += "App['pkg'] = JSON.parse('"+pkgCode+"');\n";

  // libraries
  for (var i = 0; i < env.libraries.length; i++) {
    code += fs.readFileSync(path.join(projectDir, 'libraries', env.libraries[i]+'.js'),'utf8');
  }

  // applications
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

var scripts = '<script src="main.js"></script>';

var stylesheets = '<link rel="stylesheet" type="text/css" href="main.css">';

var joinHTMLCode = function() {

  var body = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf-8');
  for (var i=0; i < env.applications.length; i++) {
    var templates = fs.readdirSync(path.join(projectDir, env.applications[i], 'templates'));
    for (var j=0; j < templates.length; j++) {
      var html = path.join(projectDir, env.applications[i], 'templates', templates[j]);
      body += fs.readFileSync(html,'utf8') + '\n\n';
    }
  }
  var template = fs.readFileSync(__dirname + '/../templates/index.template', 'utf8');
  var index_html = utils.buildTemplate(template, {
    'content': body,
    'scripts': scripts,
    'stylesheets': stylesheets
  });
  fs.writeFileSync(path.join(projectDir, 'deploy', 'index.html'), index_html);
}

function start() {
  var existsSync = fs.existsSync || path.existsSync;
  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  env = pkg.settings.environment;

  var settings = pkg.settings;

  try {
    fs.mkdirSync(path.join(projectDir, 'deploy'), 0755);
  } catch(err) {}

  copyImages();

  copyIcons();

  joinJavascriptCode();

  joinHTMLCode();

  var cssSrc = path.join(projectDir, 'stylesheets', 'ui.less');
  var cssDest = path.join(projectDir, 'deploy', 'main.css');

  var settingsLessDeploy = '@base-url: "/images";';

  var settingsLessDevelopment = '@base-url: "../images";';

  var settingsLessPath = path.join(projectDir, 'stylesheets', 'settings.less');

  fs.writeFileSync(settingsLessPath, settingsLessDeploy);
  var parser = new less.Parser({
    paths: [path.join(process.cwd(), 'stylesheets')]
  });
  var cssCode = fs.readFileSync(cssSrc).toString();
  parser.parse(cssCode, function(parse_err, tree) {
    if (parse_err) {
      console.log("Error in parse less", parse_err);
    }
    try {
      var css = tree.toCSS();
      fs.writeFileSync(settingsLessPath, settingsLessDevelopment);
      fs.writeFileSync(cssDest, css);
    } catch (e) {
      console.log("Error in compile less", e);
    }
  });

  var languagesSrc = path.join(projectDir, 'languages');
  if (existsSync(languagesSrc)) {
    var languagesDest = path.join(projectDir, 'deploy', 'languages');
    utils.copy(languagesSrc, languagesDest);
  }

  fs.writeFile(path.join(projectDir, 'deploy', 'package.json'), JSON.stringify(pkg, null, 2), function (err) {
    if (err) throw err;
  });
  
  console.log('Project ready for deploy.');
}

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log('You need to be on root of your project folder.');
    return false;
  }

  start();
}

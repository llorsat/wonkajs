var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp,
    less = require('less'),
    jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify;

ncp.limit = 300;

var projectDir = ''

module.exports.replaceAll = function(text, query, newStr){
  while (text.toString().indexOf(query) != -1)
    text = text.toString().replace(query,newStr);
  return text;
}

module.exports.mkdir = function(name) {
  projectDir = path.join(process.cwd(), name);
  try {
    fs.mkdirSync(projectDir, 0755);
  } catch (err) {
    if(err.code == 'EACCES') {
      console.log('You don\'t have permissions to write on this folder.');
      process.exit();
    }
    if (err.code == 'EEXIST') {
      console.log('Directory already exists.');
      process.exit();
    }
  }
  return projectDir;
}

module.exports.writeFile = function(name, content) {
  fs.writeFileSync(path.join(projectDir, name), content);
}

module.exports.writeComponent = function(name, content) {
  try {
    fs.writeFileSync(name, content);
  } catch(err) {
    console.error(err);
  }
}

module.exports.buildTemplate = function(content, params) {
  for (var i in params) {
    var param = '%(' + i + ')s';
    content = module.exports.replaceAll(content, param, params[i]);
  }
  return content;
};

module.exports.copy = function(source, target) {
  ncp(source, target, function(err) {
    if (err) {console.error(err)};
  });
}

module.exports.PathObject = function(args) {
  
  var _instance = this;
  
  _instance.args = typeof args == 'string' ? [args] : args;

  _instance.relativePath = function() {
    var asString = '';
    for (var i = 0; i < _instance.args.length; i++) {
      asString += _instance.args[i] + '/';
    }
    return asString.substring(0, asString.length - 1);
  }

  _instance.absPath = function() {
    var abspath = process.cwd();
    for (var i = 0; i < _instance.args.length; i++) {
      abspath = path.join(abspath, _instance.args[i]);
    }
    return abspath;
  }

  _instance.namespace = function() {
    return _instance.relativePath().replace(/\//gi, '.');
  }

  _instance.namespaceDeclaration = function() {
    return '\"' + _instance.relativePath().replace(/\//gi, '\",\"') + '\"';
  }

  _instance.templateRoute = function() {
    return _instance.relativePath().replace(/\//gi, '-');
  }

  _instance.mkdirs = function() {
    var dirName = '';
    for (var i = 0; i < _instance.args.length; i++) {
      dirName = path.join(dirName, _instance.args[i]);
      try {
        fs.mkdirSync(dirName, 0755);
      } catch (err) {
        if(err.code == 'EACCES') {
          console.log('You don\'t have permissions to write on this folder.');
          process.exit();
        }
        if (i == _instance.args.length - 1) {
          if (err.code == 'EEXIST') {
            console.log('Directory already exists.');
            process.exit();
          }
        }
      }
    }
  }

  _instance.join = function() {
    var args = arguments;
    var abspath = _instance.absPath();
    var args = typeof args == 'string' ? [args] : args;
    for (var i in args) {
      abspath = path.join(abspath, args[i]);
    }
    return abspath;
  }

}

module.exports.compressJS = function() {
  var projectDir = process.cwd();
  var modernizr = fs.readFileSync(projectDir + '/core/contrib/modernizr.js').toString();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var env = pkg.settings.environment;
  var app = fs.readFileSync(path.join(projectDir, 'core', 'app.js')).toString();

  var code = modernizr + '\n' + app + '\n';

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

module.exports.joinTemplates = function(scripts, stylesheets) {
  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var apps = pkg.settings.environment.applications;

  var body = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf-8');
  for (var i=0; i < apps.length; i++) {
    var templates = fs.readdirSync(path.join(projectDir, apps[i], 'templates'));
    for (var j=0; j < templates.length; j++) {
      var html = path.join(projectDir, apps[i], 'templates', templates[j]);
      body += fs.readFileSync(html,'utf8') + '\n\n';
    }
  }
  var template = fs.readFileSync(__dirname + '/../templates/index.template', 'utf8');
  var index_html = module.exports.buildTemplate(template, {
    'content': body,
    'scripts': scripts,
    'stylesheets': stylesheets
  });
  fs.writeFileSync(path.join(projectDir, 'deploy', 'index.html'), index_html);
}

module.exports.compressCSS = function() {
  var projectDir = process.cwd();

  var cssSrc = path.join(projectDir, 'stylesheets', 'ui.less');
  var cssDest = path.join(projectDir, 'deploy', 'main.css');

  var settingsLessDeploy = '@images-route: "/images";\n@fonts-route: "/fonts";';

  var settingsLessDevelopment = '@images-route: "../../images";\n@fonts-route: "../../fonts";';

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
}
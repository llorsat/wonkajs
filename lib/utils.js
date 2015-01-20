var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    less = require('less'),
    UglifyJS = require('uglify-js'),
    fs = require('fs');

var projectDir = ''

module.exports.replaceAll = function(text, query, newStr) {
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

module.exports.copy = function(source, target, callback) {
  var fileStat = fs.statSync(source);
  if (fileStat.isDirectory()) {
    wrench.copyDirSyncRecursive(source, target);
  } else {
    var content = fs.readFileSync(source);
    fs.writeFileSync(target, content);
  }
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

  var code = modernizr + '\n';

  var scripts = module.exports.getScripts();
  for(var i = 0; i < scripts.length; i++) {
    code += fs.readFileSync(path.join(projectDir, scripts[i]), 'utf-8');
  }

  code += '\nwindow.main();';

  fs.writeFileSync(path.join(projectDir, 'deploy', 'main.js'), UglifyJS.minify(code, {fromString: true}).code);
}

module.exports.compressCSS = function() {
  var projectDir = process.cwd();

  var cssSrc = path.join(projectDir, 'stylesheets', 'ui.less');
  var cssDest = path.join(projectDir, 'deploy', 'main.css');

  var settingsLessDeploy = '@images-route: "/images";\n@fonts-route: "/fonts";';

  var settingsLessDevelopment = '@images-route: "../../images";\n@fonts-route: "../../fonts";';

  var settingsLessPath = path.join(projectDir, 'stylesheets', 'settings.less');

  fs.writeFileSync(settingsLessPath, settingsLessDeploy);

  var cssCode = fs.readFileSync(cssSrc).toString();

  less.render(cssCode, {
      paths: [path.join(process.cwd(), 'stylesheets')],  // Specify search paths for @import directives
      compress: true          // Minify CSS output
    }, function(e, output) {
    if (e) {
      console.error(e);
    } else {
      fs.writeFileSync(settingsLessPath, settingsLessDevelopment);
      fs.writeFileSync(cssDest, output.css);
    }
  });
}

module.exports.getScripts = function() {
  var projectDir = process.cwd();
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var env = pkg.settings.environment;

  var scripts = ['core/app.js'];

  // libraries
  for (var i = 0; i < env.libraries.length; i++) {
    scripts.push('libraries/' + env.libraries[i] + '.js');
  }

  // applications
  var components = ['/init.js', '/models.js', '/collections.js', '/views.js', '/router.js'];

  for (var j = 0; j < components.length; j++) {
    for (var i = 0; i < env.applications.length; i++) {
      scripts.push(env.applications[i] + components[j]);
    }
  }
  scripts.push('core/main.js');
  return scripts;
}

module.exports.getTemplates = function() {
  var projectDir = process.cwd();
  var path = require('path');
  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
  var env = pkg.settings.environment;

  var templates = [];

  for (var i = 0; i < env.applications.length; i++) {
    var application = env.applications[i];
    var path = require('path');
    var dir = path.join(projectDir, application, 'templates');
    var list = fs.readdirSync(dir);
    for (var j = 0; j < list.length; j++) {
      var file = path.join(dir, list[j]);
      var content = fs.readFileSync(file, 'utf-8');
      templates.push(content);
    }
  }

  return templates;
}

module.exports.rmdirRecursiveSync = function(dir) {
  try { var files = fs.readdirSync(dir); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dir + '/' + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        exports.rmdirRecursiveSync(filePath);
      }
    }
  fs.rmdirSync(dir);
}
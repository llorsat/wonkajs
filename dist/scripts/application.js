var fs = require('fs'),
    path = require('path'),
    utils = require('../lib/utils.js'),
    projectDir = process.cwd();

var PathObject = function(args) {
  
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
    var abspath = projectDir;
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

function initTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/init.template'), {
    namespace: pathObject.namespaceDeclaration()
  });
  utils.writeComponent(pathObject.join('init.js'), content);
}

function modelsTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/models.template'), {
    namespace: pathObject.namespace()
  });
  utils.writeComponent(pathObject.join('models.js'), content);
}

function collectionsTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/collections.template'), {
    namespace: pathObject.namespace()
  });
  utils.writeComponent(pathObject.join('collections.js'), content);
}

function viewsTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/views.template'), {
    namespace: pathObject.namespace(),
    appName: pathObject.templateRoute()
  });
  utils.writeComponent(pathObject.join('views.js'), content);
}

function routerTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/router.template'), {
    namespace: pathObject.namespace(),
    routeName: pathObject.relativePath()
  });
  utils.writeComponent(pathObject.join('router.js'), content);
}

function indexTemplate (pathObject) {
  var content = utils.buildTemplate(fs.readFileSync(__dirname + '/../templates/app/main.template'), {
    appName: pathObject.templateRoute(),
    namespace: pathObject.namespace(),
    relativePath: pathObject.relativePath()
  });
  utils.writeComponent(pathObject.join('templates', 'main.html'), content);
}

APP_COMPONENTS = [
  initTemplate,
  modelsTemplate,
  collectionsTemplate,
  viewsTemplate,
  routerTemplate,
  indexTemplate
];

function createFiles(pathObject) {
  try {
    fs.mkdirSync(pathObject.join('templates'), 0755);
  } catch (err) {}
  for (var i = 0; i < APP_COMPONENTS.length; i++) {
    APP_COMPONENTS[i](pathObject);
  }
}

module.exports.create = function(args) {

  if (args.length == 0) {
    console.log('Too few arguments.');
    return false;
  }

  var packageJSON = JSON.parse(fs.readFileSync('package.json').toString());

  var settings = packageJSON.settings;

  var pathInstance = new PathObject(args);

  pathInstance.mkdirs();

  createFiles(pathInstance);

  packageJSON.settings.environment.applications.push(pathInstance.relativePath());
  fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2), function (err) {
    if (err) throw err;
  });
  
  console.log('Application created.');

}

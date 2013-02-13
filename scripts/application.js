var fs = require('fs'),
    path = require('path'),
    utils = require('../lib/utils.js');

var arch = [
  'collections.js',
  'views.js',
  'models.js',
  'init.js',
  'router.js',
  'templates/main.html'
];

var args = process.argv.slice(3);

module.exports.builder = function(params) {
  var name = typeof params === "string" ? params : path.join.apply(path, params);
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder');
    return false;
  }
  
  if (args.length == 0) {
    console.log('Too few arguments.');
    return false;
  }

  var packageJSON = JSON.parse(fs.readFileSync('package.json').toString());

  var pathInstance = new utils.PathObject(args);

  pathInstance.mkdirs();
  
  try {
    fs.mkdirSync(pathInstance.join('templates'), 0755);
  } catch (err) {}

  for(var i in arch) {
    var src = path.join(__dirname, '..', 'templates', 'app', arch[i]);
    var dest = pathInstance.join(arch[i]);
    var content = utils.buildTemplate(fs.readFileSync(src), {
      namespaceDeclaration: pathInstance.namespaceDeclaration(),
      namespace: pathInstance.namespace(),
      appName: pathInstance.templateRoute(),
      routeName: pathInstance.relativePath(),
      relativePath: pathInstance.relativePath()
    });
    utils.writeComponent(dest, content);
  }

  packageJSON.settings.environment.applications.push(pathInstance.relativePath());
  fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2), function (err) {
    if (err) throw err;
  });
  
  console.info('Application created.');
  console.info('=============================================');
  console.info('Now just run:');
  console.info('$ wonkajs server');
  
}

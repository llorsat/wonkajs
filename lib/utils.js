var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp;

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
    fs.mkdirSync(dirName, 0755);
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

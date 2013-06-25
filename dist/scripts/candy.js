var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    utils = require('../lib/utils.js');

var modules = {
  'auth': 'https://github.com/julianceballos/candydemo'
}

var githubClone = function(user, repo, name) {
  var projectDir = process.cwd();

  var pkgPath = path.join(projectDir, 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  var modulePath = path.join(projectDir, name);

  var GitHubApi = require("github");

  var github = new GitHubApi({
      version: "3.0.0",
      timeout: 5000
  });

  github.repos.get({
    'user': user,
    'repo': repo
  }, function(a, info) {
    exec('git clone ' + info.clone_url + ' ' + name, function() {
      var pkgModPath = path.join(projectDir, name, 'package.json');
      var pkgMod = JSON.parse(fs.readFileSync(pkgModPath).toString());

      for(var resource in pkgMod.resources) {
        for(var item in pkgMod.resources[resource]) {
          var orig = path.join(modulePath, resource)
          var dest = path.join(projectDir, resource, pkgMod.resources[resource][item]);
          utils.copy(orig, dest, function() {
            utils.rmdirRecursiveSync(orig);
          });
        }
      }

      if (pkgMod.libraries.length > 0) {
        var src = path.join(modulePath, 'libraries');
        var dest = path.join(projectDir, 'libraries');
        utils.copy(src, dest, function() {
          utils.rmdirRecursiveSync(src);
        });
      }

      if(pkg.settings.environment.applications.indexOf(name) == -1)
        pkg.settings.environment.applications.push(name);

      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    });
  });
}

module.exports.builder = function(name) {

  var githubURL = modules[name];

  var urlComs = githubURL.replace('https://', '').replace('http://', '').split('/');

  var user = urlComs[1];

  var repo = urlComs[2];

  var https = require('https');
  
  var options = {
    host : 'raw.github.com',
    path : '/' + user + '/' + repo + '/master/package.json',
    method : 'GET'
  };

  var request = https.request(options, function(response) {
    var body = '';
    response.on('data', function(chunk) {
      var pkg = JSON.parse(chunk);
      if (pkg.name == name) {
        githubClone(user, repo, name);
      }
    });  
  });  
  request.end();

}

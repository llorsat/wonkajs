/* 
 * inspired on: https://gist.github.com/701407
 */

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    hbs = require('handlebars'),
    utils = require('../lib/utils.js'),
    port = process.argv[3] || 9300,
    isExists = fs.exists || path.exists;

var response404 = function(response) {
  response.writeHead(404, {"Content-Type": "text/plain"});
  response.write('Not found');
  response.end();
}

var responseDir = function(response, filename) {
  var files = fs.readdirSync(filename);
  response.writeHead(200);
  var html = '<html><head></head><body>';
  for(var i = 0; i < files.length; i++) {
    html+='<li>' + files[i] + '</li>';
  }
  html += '</body></html>';
  response.write(html, "binary");
  response.end();
}

var response500 = function(response) {
  response.writeHead(500, {"Content-Type": "text/plain"});
  response.write('Internal server error');
  response.end();
}

var responseOK = function(response, file) {
  response.writeHead(200);
  response.write(file, 'binary');
  response.end();
}

module.exports.builder = function() {
  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder.');
    return false;
  }

  http.createServer(function(request, response) {
    request.setEncoding('utf8');
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        indexFlag = false;

    if (filename == process.cwd() + '/') {
      indexFlag = true;
      filename += 'index.hbs';
    }

    isExists(filename, function(exists) {
      if(!exists) {
        response404(response);
        return false;
      }
      if (fs.statSync(filename).isDirectory()) {
        responseDir(response, filename);
        return false;
      }
      fs.readFile(filename, 'binary', function(err, file) {
        if(err) {
          response500(response);
          return false;
        }
        if (indexFlag) {
          var templateString = fs.readFileSync(path.join(process.cwd(), 'index.hbs'), 'utf-8');
          var template = hbs.compile(templateString);
          var data = {
            'development': true,
            'scripts': utils.getScripts(),
            'templates': utils.getTemplates()
          };
          var index = template(data);
          
          response.write(index, 'utf-8');
          response.end();
          return false;
        }
        responseOK(response, file);
      });
    });
  }).listen(parseInt(port, 10)).on('error', function(err) {
    errors = {
      'EADDRINUSE': 'Port: ' + port + ' is already in use.'
    }
    console.error(errors[err.code]);
  }).on('listening', function() {
    console.info('Server running');
    console.info('=============================================');
    console.info('Visit at: http://localhost:' + port)
    console.info('CTRL + C  to stop.');
  });
}


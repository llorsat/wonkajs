module.exports.run = function() {
  var path = require('path');
  var utils = require('../lib/utils.js');
  // fuente: https://gist.github.com/701407
  var http = require("http"),
  url = require("url"),
  fs = require("fs"),
  port = process.argv[3] || 9300;

  var existsSync = fs.existsSync || path.existsSync;
  if (!existsSync(path.join(process.cwd(), 'package.json'))) {
    console.info('You need to be on root of your project folder');
    return false;
  }

  function directoryTemplate(files) {
    var html = '<html><head></head><body>';
    for(var i = 0; i < files.length; i++) {
      html+='<li>' + files[i] + '</li>';
    }
    html += '</body></html>';
    return html;
  }

  var stylesheets = '<link rel="stylesheet/less" href="stylesheets/ui.less">\n'
                    + '<script src="core/contrib/less.js"></script>\n'
                    + '<script src="core/contrib/modernizr.js"></script>';

  var scripts = '<script src="core/app.js"></script>\n'
                + '<script data-main="core/run" src="core/contrib/require.js"></script>';

  http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        indexFlag = false;
    if (filename == process.cwd() + '/') {
      indexFlag = true;
      filename+='index.html';
    }
    if (uri.split('/')[1] == 'images') {
      filename = filename.replace('/images/', '/stylesheets/images/');
    }
    var isExists = fs.exists || path.exists;
    isExists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }
      if (fs.statSync(filename).isDirectory()) {
        var content = fs.readdirSync(filename);
        response.writeHead(200);
        response.write(directoryTemplate(content), "binary");
        response.end();
      } else {
        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
          }
          response.writeHead(200);
          if (indexFlag) {
            var index = fs.readFileSync(filename);
            var template = fs.readFileSync(path.join(__dirname, '..', 'templates', 'index.template'));
            var index_html = utils.buildTemplate(template, {
              'content': index,
              'scripts': scripts,
              'stylesheets': stylesheets
            });
            response.write(index_html, "binary");
          } else {
            response.write(file, "binary");
          }
          response.end();
        });
      }
    });
  }).listen(parseInt(port, 10)).on('error', function(err) {
    errors = {
      'EADDRINUSE': 'Port: ' + port + ' is already in use.'
    }
    console.log(errors[err.code]);
  }).on('listening', function() {
    console.info("Server running at http://localhost:" + port);
    console.info("CTRL + C  to stop.");
  });
}

module.exports.builder = function() {
  var path = require('path');
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

  http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    if (filename == process.cwd() + '/') {
      filename += 'index.html';
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
          response.write(file, "binary");
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

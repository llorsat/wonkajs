exports.server = function() {
  // fuente: https://gist.github.com/701407
  var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  port = process.argv[3] || 9300;

  function directoryTemplate(files) {
    var html = '<html><head></head><body>';
    for(var i = 0; i < files.length; i++) {
      html+='<li>' + files[i] + '</li>';
    }
    html += '</body></html>';
    return html;
  }

  http.createServer(function(request, response) {
    __dirname = __dirname.replace('/scripts', '');
    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri);
    path.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }
      if (filename.substring(0, filename.length - 1) == __dirname) {
        filename += 'index.html';
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
    console.log("Server running at http://localhost:" + port);
    console.log("CTRL + C  to stop.");
  });
}

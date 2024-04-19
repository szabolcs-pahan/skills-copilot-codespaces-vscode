// Create web server
// Create a new web server
var http = require('http');
var fs = require('fs');
var url = require('url');

// Load the comments from the file
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Create the server
http.createServer(function (req, res) {
  // Parse the URL
  var url_parts = url.parse(req.url);

  // Check the URL of the current request
  if(url_parts.pathname == '/comment') {
    console.log("Request type: " + req.method);

    if(req.method == "POST") {
      var body = '';

      req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        if(body.length > 1e6) {
          req.connection.destroy();
        }
      });

      req.on('end', function () {
        var post = JSON.parse(body);
        console.log("POST: " + post);
        comments.push(post);

        fs.writeFileSync('comments.json', JSON.stringify(comments), 'utf8');
      });
    }

    res.end();
  } else if(url_parts.pathname == '/comments') {
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
    res.end(JSON.stringify(comments));
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
  }
}).listen(8080);

console.log('Server running at http://');

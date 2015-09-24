var http = require("http"),
    url = require("url"),
    httpProxy = require('http-proxy'),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888,
    ////////////////////////////////////////////////////////////////////////////
    // Adjust this settings to your needs for proxying the backend requests   //
    ////////////////////////////////////////////////////////////////////////////
    proxy_cfg = {
      // the prefix you use to call your backend functions via the proxy server
      prefix: "/proxy/",
      // the host of your backend server
      host: "services.odata.org",
      // port of your backend server
      port: ""
    };


var proxy = httpProxy.createProxyServer();

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);

  if (uri.indexOf(proxy_cfg.prefix) === 0) {
    proxy.on('error', function (err, req, res) {
      //console.log("backend error");
      //console.log(err);
    });
    proxy.on('proxyRes', function (proxyRes, req, res) {
      //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
    });
    proxy.on('close', function (req, socket, head) {
      // view disconnected websocket connections
      //console.log('Client disconnected');
    });

    // We have to set the host of the request to the our remote server
    // It currently contains localhost... which leads to problems on some
    // servers
    request.headers.host = proxy_cfg.host;
    // cut the prefix from the beginning of the url
    // request.url = request.url.slice(request.url.indexOf("/", 1));
    request.url = request.url.slice(proxy_cfg.prefix.length);
    proxy.web(request, response, {
      // cause we use this script only during development and testing we
      // have a http connection. For https we have to do some additional
      // proxy configuration
      target: 'http://' + proxy_cfg.host + (proxy_cfg.port ? ':' + proxy_cfg.port : '') + '/'
    });
  } else {

    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, {
          "Content-Type": "text/plain"
        });
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if (err) {
          response.writeHead(500, {
            "Content-Type": "text/plain"
          });
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  }
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

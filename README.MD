# Node.js static server with Proxy functionality
Todays web development is mostly strictly divided into frontend development and
backend development. The frontend (HTML, JS, CSS) communicates with the backend
via clearly defined (restful) APIs. The backend development is done on a Java server
or any kind of other server runtime (PHP, .NET, SAP R/3, ...).
When testing our frontend applications we face two problems.
* To test the complete functionality we need to run the application on a server
that is accessible via http. The file protocol is not sufficient for all use cases
* We need to call our backend functionality via XHR (Ajax). If our
backend is not running on the same server as the frontend we run into the [SOP](https://en.wikipedia.org/wiki/Same-origin_policy)
problem.

This node.js script solves both problems.
* It starts a node.js server that provides our static frontend files via http.
* It proxies the calls to our backend system so that the functions can be called
as local functions in our JS files.

## Downloading
You only have to download the static_server.js file to your project directory that contains your webapp (frontend) files.

## Configuration
To use this script you simply have to adjust the following two lines of this script
```
///////////////////////////////////////////////////////////////////////////
// Adjust this settings to your needs for proxying the backend requests  //
///////////////////////////////////////////////////////////////////////////
proxy_cfg = {
  // the prefix you use to call your backend functions via the proxy server
  prefix: "/proxy/",
  // the host of your backend server
  host: "services.odata.org",
  // port of your backend server
  port: ""  
};
```
Field | Description
----- | -----------
prefix | The prefix you use in your frontend application to mark a request as backend request that has to be proxied
host | The hostname of your backend server.
port | The port that your backend service is running on. If you use standard port 80 leave it blank    

## Execution
To execute the script just run

    node static_server.js

or

    node static_server.js 8080
if you don't want to run on the standard port `8888`

## Credits
I basically copied the static_server.js from Ryan Florence's [github repositiory](https://gist.github.com/ryanflorence/701407) and enhanced it.  
The http-proxy can be found at the [nodejitsu repositiory](https://github.com/nodejitsu/node-http-proxy)

exports.route = function route(req, res) {

  if (req.method === "GET" && req.url.path === "/") {
    res(200, { "Content-Type": "text/html" }, "<h1>Node.js is running</h1>\n");
  }
  else if (req.method === "GET" && req.url.path === "/test.html") {
    res(200, { "Content-Type": "text/plain" }, "{'Content': 'type isn't HTML'}\n");
  }
  else {
    res(404, {}, "ERROR 404");
  }
}
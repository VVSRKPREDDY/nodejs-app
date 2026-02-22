const fs = require("fs");
const path = require("path");
 
const MIME_TYPES = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".ico":  "image/x-icon",
};
 
function serveStatic(req, res) {
  const filePath = req.url === "/" ? "/index.html" : req.url;
  const fullPath = path.join(__dirname, "../public", filePath);
  const ext = path.extname(fullPath);
  const contentType = MIME_TYPES[ext] || "text/plain";
 
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("<h1>404 - Not Found</h1>");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}
 
module.exports = { serveStatic };

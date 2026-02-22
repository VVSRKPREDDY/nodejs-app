const http = require("http");
const { router } = require("./routes/tasks");
const { serveStatic } = require("./controllers/staticController");
 
const PORT = process.env.PORT || 3000;
 
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
 
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
 
  // Health check endpoint for Kubernetes probes
  if (url === "/health" || url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  }
 
  // Readiness check
  if (url === "/ready") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ready" }));
  }
 
  // API routes
  if (url.startsWith("/api/")) {
    return router(req, res);
  }
 
  // Static files
  return serveStatic(req, res);
});
 
server.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`);
});

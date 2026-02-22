const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
 
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
 
async function router(req, res) {
  const { method, url } = req;
 
  if (method === "GET"    && url === "/api/tasks")              return getTasks(req, res);
  if (method === "POST"   && url === "/api/tasks")              return createTask(req, res);
  if (method === "PATCH"  && url.startsWith("/api/tasks/")) {
    const id = parseInt(url.split("/")[3]);
    if (isNaN(id)) return sendJSON(res, 400, { error: "Invalid ID" });
    return updateTask(req, res, id);
  }
  if (method === "DELETE" && url.startsWith("/api/tasks/")) {
    const id = parseInt(url.split("/")[3]);
    if (isNaN(id)) return sendJSON(res, 400, { error: "Invalid ID" });
    return deleteTask(req, res, id);
  }
 
  sendJSON(res, 404, { error: "API route not found" });
}
 
module.exports = { router };

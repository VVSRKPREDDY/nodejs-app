const store = require("./taskStore");
 
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
  });
}
 
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
 
async function getTasks(req, res) { sendJSON(res, 200, store.getAll()); }
 
async function createTask(req, res) {
  try {
    const { title } = await parseBody(req);
    if (!title || !title.trim()) return sendJSON(res, 400, { error: "Title is required" });
    sendJSON(res, 201, store.create(title.trim()));
  } catch { sendJSON(res, 400, { error: "Invalid body" }); }
}
 
async function updateTask(req, res, id) {
  const task = store.getById(id);
  if (!task) return sendJSON(res, 404, { error: "Task not found" });
  try {
    const body = await parseBody(req);
    const fields = {};
    if (typeof body.done === "boolean") fields.done = body.done;
    if (typeof body.title === "string" && body.title.trim()) fields.title = body.title.trim();
    sendJSON(res, 200, store.update(id, fields));
  } catch { sendJSON(res, 400, { error: "Invalid body" }); }
}
 
async function deleteTask(req, res, id) {
  if (!store.remove(id)) return sendJSON(res, 404, { error: "Task not found" });
  sendJSON(res, 200, { message: "Deleted" });
}
 
module.exports = { getTasks, createTask, updateTask, deleteTask };

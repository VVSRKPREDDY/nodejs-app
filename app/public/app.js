let tasks = [];
 
async function fetchTasks() {
  const res = await fetch("/api/tasks");
  tasks = await res.json();
  render();
}
 
async function addTask() {
  const input = document.getElementById("task-input");
  const title = input.value.trim();
  if (!title) return showToast("Please enter a task!");
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (res.ok) { tasks.push(await res.json()); input.value = ""; render(); showToast("Task added!"); }
}
 
async function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !task.done }),
  });
  if (res.ok) { task.done = !task.done; render(); }
}
 
async function deleteTask(id) {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (res.ok) { tasks = tasks.filter((t) => t.id !== id); render(); showToast("Deleted."); }
}
 
function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
 
function render() {
  document.getElementById("stat-total").textContent   = `${tasks.length} total`;
  document.getElementById("stat-done").textContent    = `${tasks.filter(t=>t.done).length} done`;
  document.getElementById("stat-pending").textContent = `${tasks.filter(t=>!t.done).length} pending`;
 
  const list = document.getElementById("task-list");
  if (!tasks.length) { list.innerHTML = '<li class="empty">No tasks yet!</li>'; return; }
  list.innerHTML = tasks.map(t => `
    <li class="task-item ${t.done ? "done-task" : ""}">
      <input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleTask(${t.id})"/>
      <span class="task-title">${escapeHTML(t.title)}</span>
      <button class="delete-btn" onclick="deleteTask(${t.id})">✕</button>
    </li>`).join("");
}
 
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
 
document.getElementById("task-input").addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
fetchTasks();

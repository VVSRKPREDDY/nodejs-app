let tasks = [
  { id: 1, title: "Deploy to AKS", done: false },
  { id: 2, title: "Configure ArgoCD", done: false },
  { id: 3, title: "Set up Helm chart", done: true },
];
let nextId = 4;
 
function getAll() { return tasks; }
function getById(id) { return tasks.find((t) => t.id === id) || null; }
function create(title) {
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return task;
}
function update(id, fields) {
  const task = getById(id);
  if (!task) return null;
  Object.assign(task, fields);
  return task;
}
function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
 
module.exports = { getAll, getById, create, update, remove };

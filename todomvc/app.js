// Mark all todos as completed
function markAllCompleted() {
  const { todos } = getState();
  setState({ todos: todos.map(t => ({ ...t, completed: true })) });
}
import { createElement, render } from "../framework/dom.js";
import { setState, getState, subscribe } from "../framework/state.js";

// Load todos from localStorage if available, otherwise use default
const savedTodos = localStorage.getItem("todos");
const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
const savedFilter = localStorage.getItem("filter");
const initialFilter = savedFilter ? savedFilter : "all";
setState({
  todos: initialTodos,
  filter: initialFilter, // all | active | completed
  editingId: null
});
// Start editing a todo
function startEdit(id) {
  setState({ ...getState(), editingId: id });
}

// Finish editing a todo
function finishEdit(id, newText) {
  const { todos } = getState();
  setState({
    ...getState(),
    todos: todos.map(t => t.id === id ? { ...t, text: newText } : t),
    editingId: null
  });
}

// Cancel editing
function cancelEdit() {
  setState({ ...getState(), editingId: null });
}

// Helper to get filtered todos
function getFilteredTodos() {
  const { todos, filter } = getState();
  if (filter === "active") return todos.filter(t => !t.completed);
  if (filter === "completed") return todos.filter(t => t.completed);
  return todos;
}

// Add a new todo
function addTodo(text) {
  const { todos } = getState();
  setState({ todos: [...todos, { text, completed: false, id: Date.now() }] });
}

// Toggle completed
function toggleTodo(id) {
  const { todos } = getState();
  setState({
    todos: todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  });
}

// Delete a todo
function deleteTodo(id) {
  const { todos } = getState();
  setState({ todos: todos.filter(t => t.id !== id) });
}

// Change filter
function setFilter(filter) {
  // Set the filter and update the URL hash
  setState({ filter });
  if (filter === "all") {
    location.hash = "/";
  } else {
    location.hash = "/" + filter;
  }
}

// Helper to get active and completed todos
function getActiveCount() {
  return getState().todos.filter(t => !t.completed).length;
}
function getCompletedCount() {
  return getState().todos.filter(t => t.completed).length;
}

// Clear completed todos
function clearCompleted() {
  setState({ todos: getState().todos.filter(t => !t.completed) });
}

// Main App UI
function App() {
  const { filter, editingId } = getState();
  let inputRef = null;
  const activeCount = getActiveCount();
  const completedCount = getCompletedCount();
  return createElement("div", { class: "todoapp" }, [
      createElement("h1", {}, ["todos"]),
      createElement("div", { class: "todo-create-form" }, [
        createElement("input", {
          type: "text",
          placeholder: "What needs to be done?",
          autofocus: true,
          onKeyDown: (e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              const todoText = e.target.value.trim();
              e.target.value = ""; // Clear immediately for better UX
              addTodo(todoText);
              // Focus will be restored by the render function
            }
          },
          ref: el => (inputRef = el),
          class: "todo-input"
        })
      ]),
      createElement("div", { class: "top-actions" }, [
        createElement("button", {
          class: "mark-all-completed",
          onClick: markAllCompleted,
          title: "Mark all todos as completed"
        }, ["Mark all as completed"]),
        createElement("span", { class: "todo-count count-right" }, [
          `${activeCount} item${activeCount !== 1 ? 's' : ''} left`
        ])
      ]),
      createElement("ul", { class: "todo-list scrollable-list" },
        getFilteredTodos().map(todo =>
          createElement("li", {
            class: todo.completed ? "completed" : "",
            key: todo.id
          }, [
            createElement("input", {
              type: "checkbox",
              checked: todo.completed,
              onChange: () => toggleTodo(todo.id)
            }),
            editingId === todo.id
              ? createElement("input", {
                  type: "text",
                  class: "edit-todo-input",
                  value: todo.text,
                  autofocus: true,
                  onBlur: (e) => finishEdit(todo.id, e.target.value.trim() || todo.text),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") finishEdit(todo.id, e.target.value.trim() || todo.text);
                    if (e.key === "Escape") cancelEdit();
                  }
                })
              : createElement("span", {
                  style: `text-decoration: ${todo.completed ? 'line-through' : 'none'}; cursor: pointer;`,
                  ondblclick: () => startEdit(todo.id)
                }, [todo.text]),
            createElement("button", {
              onClick: () => deleteTodo(todo.id)
            }, ["×"])
          ])
        )
      ),
      createElement("div", { class: "footer" }, [
        createElement("div", { class: "footer-row" }, [
          createElement("div", { class: "filters filters-left" }, [
            createElement("button", {
              class: filter === "all" ? "selected" : "",
              onClick: () => setFilter("all")
            }, ["All"]),
            createElement("button", {
              class: filter === "active" ? "selected" : "",
              onClick: () => setFilter("active")
            }, ["Active"]),
            createElement("button", {
              class: filter === "completed" ? "selected" : "",
              onClick: () => setFilter("completed")
            }, ["Completed"])
          ])
        ]),
        completedCount > 0 && createElement("button", {
          class: "clear-completed",
          onClick: clearCompleted
        }, ["Clear completed"])
      ])
    ]);
}

// Listen for hash changes to update the filter
window.addEventListener("hashchange", () => {
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash === "active" || hash === "completed" || hash === "all" || hash === "") {
    setState({ filter: hash === "" ? "all" : hash });
  }
});

function mount() {
  render(App(), document.getElementById("root"));
}

subscribe(() => {
  const { todos, filter } = getState();
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("filter", filter);
  mount();
});

// On initial load, sync filter with hash
const initialHash = location.hash.replace(/^#\/?/, "");
if (initialHash === "active" || initialHash === "completed") {
  setState({ ...getState(), filter: initialHash });
}
mount();

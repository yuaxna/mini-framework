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
  setState({ filter });
}

// Main App UI
function App() {
  const { filter, editingId } = getState();
  let inputRef = null;
  // Count active todos
  const { todos } = getState();
  const activeCount = todos.filter(t => !t.completed).length;
  return createElement("div", { class: "todoapp" }, [
    createElement("h1", {}, ["todos"]),
    createElement("div", { class: "todo-create-form" }, [
      createElement("input", {
        type: "text",
        placeholder: "What needs to be done?",
        autofocus: true,
        "aria-label": "Create a new todo",
        onKeyDown: (e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            addTodo(e.target.value.trim());
            e.target.value = "";
          }
        },
        ref: el => (inputRef = el)
      })
    ]),
    createElement("div", { class: "todo-counter" }, [
      `${activeCount} item${activeCount === 1 ? '' : 's'} left`,
      createElement("button", {
        class: "mark-all-btn",
        onClick: markAllCompleted,
        "aria-label": "Mark all todos as completed",
        style: "margin-left:1.5em; font-size:0.95em; padding:0.3em 1.2em; border-radius:6px; border:none; background:#a259ff; color:#fff; font-weight:600; cursor:pointer; box-shadow:0 1px 6px #a259ff44;"
      }, ["Mark all as completed"])
    ]),
  createElement("ul", { class: "todo-list", "aria-label": "Todo list" },
      getFilteredTodos().map(todo =>
        createElement("li", {
          class: todo.completed ? "completed" : "",
          key: todo.id,
          "aria-label": todo.text
        }, [
          createElement("input", {
            type: "checkbox",
            checked: todo.completed,
            onChange: () => toggleTodo(todo.id),
            "aria-label": todo.completed ? `Mark '${todo.text}' as active` : `Mark '${todo.text}' as completed`
          }),
          editingId === todo.id
            ? createElement("input", {
                type: "text",
                class: "edit-todo-input",
                value: todo.text,
                autofocus: true,
                "aria-label": `Edit todo: ${todo.text}`,
                onFocus: (e) => e.target.select(),
                onBlur: (e) => finishEdit(todo.id, e.target.value.trim() || todo.text),
                onKeyDown: (e) => {
                  if (e.key === "Enter") finishEdit(todo.id, e.target.value.trim() || todo.text);
                  if (e.key === "Escape") cancelEdit();
                }
              })
            : createElement("span", {
                style: `text-decoration: ${todo.completed ? 'line-through' : 'none'}; cursor: pointer;`,
                ondblclick: () => startEdit(todo.id),
                tabIndex: 0,
                role: "textbox",
                "aria-label": `Todo: ${todo.text}. Double-click to edit.`,
                onKeyDown: (e) => {
                  if (e.key === "Enter") startEdit(todo.id);
                }
              }, [todo.text]),
          createElement("button", {
            onClick: () => deleteTodo(todo.id),
            "aria-label": `Delete todo: ${todo.text}`
          }, ["×"])
        ])
      )
    ),
    createElement("div", { class: "filters", role: "group", "aria-label": "Filter todos" }, [
      ["all", "active", "completed"].map(f =>
        createElement("button", {
          class: filter === f ? "selected" : "",
          onClick: () => setFilter(f),
          "aria-label": `Show ${f} todos`,
          tabIndex: 0
        }, [f.charAt(0).toUpperCase() + f.slice(1)])
      )
    ])
  ]);
}

// Initial render
function mount() {
  render(App(), document.getElementById("root"));
}

// Re-render on state change and persist todos/filter to localStorage
subscribe(() => {
  const { todos, filter } = getState();
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("filter", filter);
  mount();
});

// Mount on load
mount();

# Mini Framework Documentation

Welcome to your custom JavaScript mini-framework! This guide explains how to use each feature: DOM abstraction, event system, state management, and routing.

---

## Features Overview

- **DOM Abstraction**: Create and render UI elements using JavaScript functions instead of raw HTML.
- **Event System**: Communicate between parts of your app using a publish/subscribe pattern.
- **State Management**: Store and update global state, and react to changes.
- **Routing**: Map URL paths to components and navigate between pages.

---

## 1. DOM Abstraction (`framework/dom.js`)

### Creating Elements
```js
import { createElement, render } from "./framework/dom.js";

const button = createElement("button", { onClick: () => alert("Clicked!") }, ["Click Me"]);
const app = createElement("div", { class: "container" }, [
  createElement("h1", {}, ["Hello!"]),
  button
]);

render(app, document.getElementById("root"));
```

### Nesting Elements
Children can be arrays or elements:
```js
const list = createElement("ul", {}, [
  createElement("li", {}, ["Item 1"]),
  createElement("li", {}, ["Item 2"])
]);
```

### Adding Attributes
```js
const input = createElement("input", { type: "text", placeholder: "Type here" });
```

### Why?
This approach lets you build UIs in JavaScript, making it easier to update and compose components.

---

## 2. Event System (`framework/events.js`)


### Subscribing and Emitting Events
```js
import { on, emit } from "./framework/events.js";

// Basic usage
on("customEvent", (data) => console.log("Event received:", data));
emit("customEvent", { foo: "bar" });
```

### More Advanced Examples

#### 1. Global Notification System
```js
// In your notification component:
on("notify", (msg) => alert("Notification: " + msg));

// Anywhere in your app:
emit("notify", "You have a new message!");
```

#### 2. Cross-Component Communication
```js
// Component A (sender):
function handleAction() {
  emit("actionHappened", { id: 123 });
}

// Component B (listener):
on("actionHappened", (data) => {
  console.log("Action happened in another component!", data);
});
```

#### 3. Unsubscribing from Events
```js
function myHandler(data) { /* ... */ }
on("something", myHandler);
// Later, to stop listening:
import { off } from "./framework/events.js";
off("something", myHandler);
```

### Why?
This decouples components, letting them communicate without direct references. You can use events for notifications, global actions, or to coordinate between different parts of your app.

---

## 3. State Management (`framework/state.js`)

### Setting and Getting State
```js
import { setState, getState, subscribe } from "./framework/state.js";

setState({ count: 1 });
console.log(getState()); // { count: 1 }
```

### Subscribing to State Changes
```js
subscribe((state) => {
  console.log("State changed:", state);
});
setState({ count: 2 });
```

### Why?
Centralized state makes it easy to share and react to data changes across your app.

---

## 4. Routing (`framework/router.js`)

### Registering Routes and Starting the Router
```js
import { registerRoutes, startRouter, navigate } from "./framework/router.js";
import { createElement } from "./framework/dom.js";

const Home = () => createElement("div", {}, ["Home Page"]);
const About = () => createElement("div", {}, ["About Page"]);

registerRoutes({
  "/": Home,
  "/about": About
});

startRouter(document.getElementById("root"));
```

### Navigating
```js
navigate("/about"); // Changes the route to About
```

### Why?
Routing lets you build single-page apps that respond to URL changes.

---

## How It Works
- **DOM**: You describe your UI as JavaScript objects/functions. The framework turns these into real DOM nodes.
- **Events**: Components can emit and listen for events, enabling communication without tight coupling.
- **State**: A global store holds your app's data. Components can subscribe to changes and update automatically.
- **Router**: The router listens for URL changes and renders the correct component.

---

## Example: Putting It All Together
```js
import { createElement, render } from "./framework/dom.js";
import { on, emit } from "./framework/events.js";
import { setState, getState, subscribe } from "./framework/state.js";
import { registerRoutes, startRouter, navigate } from "./framework/router.js";

// ...see main.js for a full example...
```

---


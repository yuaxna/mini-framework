# Mini Framework

>A minimal JavaScript framework for building modern web apps, featuring DOM abstraction, state management, routing, and a custom event system. Includes a full TodoMVC demo.

## Features
- **DOM Abstraction**: Create UI elements and nest them using JavaScript functions.
- **State Management**: Global state store with subscriptions.
- **Routing**: Simple hash-based router for single-page apps.
- **Event System**: Custom pub/sub for decoupled communication.
- **TodoMVC Example**: See `todomvc/` for a full-featured demo app.

## Project Structure

```
mini-framework/
│
├── framework/      # The framework source code
│   ├── dom.js      # DOM abstraction
│   ├── events.js   # Event system
│   ├── router.js   # Routing system
│   └── state.js    # State management
│
├── todomvc/        # TodoMVC demo app using the framework
│   ├── app.js
│   └── index.html
│
├── main.js         # Quick test/demo entry point
├── index.html      # Quick test/demo HTML
├── framework.md    # Full framework documentation & usage
└── README.md       # This file
```

## Getting Started

1. **Clone or download this repo.**
2. Open `todomvc/index.html` in your browser to try the TodoMVC app.
3. See `framework.md` for full documentation and usage examples.

## Documentation

See [framework.md](./framework.md) for:
- How to create elements, events, and manage state
- How to use the router
- Code examples and explanations

## License

MIT License

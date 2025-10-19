
// Helper: Flattens nested arrays of children
function flatten(arr) {
  return arr.reduce((flat, item) => {
    if (Array.isArray(item)) return flat.concat(flatten(item));
    return flat.concat(item);
  }, []);
}

// Helper: Converts a virtual node (object) to a real DOM element
function toDOM(node) {
  if (node == null) return document.createTextNode("");
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(node);
  }
  if (typeof node === "function") {
    // Support function as child (dynamic rendering)
    return toDOM(node());
  }
  if (Array.isArray(node)) {
    // Fragment: return a DocumentFragment
    const frag = document.createDocumentFragment();
    flatten(node).forEach(child => frag.appendChild(toDOM(child)));
    return frag;
  }
  // If node is already a DOM element
  if (node instanceof Node) return node;
  // If node is a virtual node object
  return createElement(node.tag, node.attrs, node.children);
}

/**
 * Creates a DOM element from tag, attributes, and children.
 * Supports nested arrays, function children, and fragments.
 */
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  // Store event listeners for diffing
  el._eventListeners = {};

  // Handle attributes and events
  for (let [key, value] of Object.entries(attrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase(); // e.g. onClick -> click
      el.addEventListener(event, value);
      el._eventListeners[event] = value; // Store for diffing
    } else {
      el.setAttribute(key, value);
    }
  }

  // Handle children (flatten, support functions, fragments)
  flatten(children).forEach(child => {
    el.appendChild(toDOM(child));
  });

  return el;
}


/**
 * Simple DOM diffing to update only what has changed
 */
function diff(newNode, oldNode) {
  // If nodes are the same reference, no update needed
  if (newNode === oldNode) return;

  // Handle text nodes
  if (newNode?.nodeType === Node.TEXT_NODE && oldNode?.nodeType === Node.TEXT_NODE) {
    if (newNode.textContent !== oldNode.textContent) {
      oldNode.textContent = newNode.textContent;
    }
    return;
  }

  // If node types are different, replace entirely
  if (!newNode || !oldNode || newNode.nodeType !== oldNode.nodeType || 
      newNode.tagName !== oldNode.tagName) {
    if (oldNode?.parentNode) {
      oldNode.parentNode.replaceChild(newNode, oldNode);
    }
    return;
  }

  // Update attributes and event listeners
  if (newNode.nodeType === Node.ELEMENT_NODE) {
    // Remove old attributes that don't exist in new node
    const oldAttrs = Array.from(oldNode.attributes || []);
    oldAttrs.forEach(attr => {
      if (!newNode.hasAttribute(attr.name)) {
        oldNode.removeAttribute(attr.name);
      }
    });

    // Set new attributes
    const newAttrs = Array.from(newNode.attributes || []);
    newAttrs.forEach(attr => {
      if (oldNode.getAttribute(attr.name) !== attr.value) {
        oldNode.setAttribute(attr.name, attr.value);
      }
    });

    // Update event listeners
    if (newNode._eventListeners && oldNode._eventListeners) {
      // Remove old event listeners
      Object.keys(oldNode._eventListeners).forEach(event => {
        if (!newNode._eventListeners[event]) {
          oldNode.removeEventListener(event, oldNode._eventListeners[event]);
          delete oldNode._eventListeners[event];
        }
      });

      // Add new event listeners
      Object.keys(newNode._eventListeners).forEach(event => {
        if (oldNode._eventListeners[event] !== newNode._eventListeners[event]) {
          if (oldNode._eventListeners[event]) {
            oldNode.removeEventListener(event, oldNode._eventListeners[event]);
          }
          oldNode.addEventListener(event, newNode._eventListeners[event]);
          oldNode._eventListeners[event] = newNode._eventListeners[event];
        }
      });
    } else if (newNode._eventListeners) {
      // Copy event listeners if old node doesn't have them
      oldNode._eventListeners = {};
      Object.keys(newNode._eventListeners).forEach(event => {
        oldNode.addEventListener(event, newNode._eventListeners[event]);
        oldNode._eventListeners[event] = newNode._eventListeners[event];
      });
    }

    // Handle special properties
    if (newNode.checked !== oldNode.checked) {
      oldNode.checked = newNode.checked;
    }
    if (newNode.value !== oldNode.value && document.activeElement !== oldNode) {
      oldNode.value = newNode.value;
    }
  }

  // Diff children
  const newChildren = Array.from(newNode.childNodes || []);
  const oldChildren = Array.from(oldNode.childNodes || []);

  // Update existing children
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const newChild = newChildren[i];
    const oldChild = oldChildren[i];

    if (newChild && oldChild) {
      diff(newChild, oldChild);
    } else if (newChild) {
      // Add new child
      oldNode.appendChild(newChild);
    } else if (oldChild) {
      // Remove old child
      oldNode.removeChild(oldChild);
    }
  }
}

/**
 * Renders a virtual node or DOM element into a container.
 * Uses DOM diffing to minimize changes and eliminate blinking.
 */
function render(element, container) {
  const newDOM = toDOM(element);
  
  // If container is empty, just append
  if (container.children.length === 0) {
    container.appendChild(newDOM);
    return;
  }

  // Use diffing to update existing DOM
  const oldDOM = container.firstElementChild;
  if (oldDOM) {
    diff(newDOM, oldDOM);
  } else {
    container.appendChild(newDOM);
  }
}

export { createElement, render, toDOM };

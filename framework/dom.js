
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

  // Handle attributes and events
  for (let [key, value] of Object.entries(attrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase(); // e.g. onClick -> click
      el.addEventListener(event, value);
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
 * Renders a virtual node or DOM element into a container.
 * Preserves focus on input elements for smooth user experience.
 */
function render(element, container) {
  // Store current focus information before re-render
  const activeElement = document.activeElement;
  const isFocusedInput = activeElement && 
                        activeElement.tagName === 'INPUT' && 
                        container.contains(activeElement);
  const inputValue = isFocusedInput ? activeElement.value : null;
  const inputSelectionStart = isFocusedInput ? activeElement.selectionStart : null;
  const inputSelectionEnd = isFocusedInput ? activeElement.selectionEnd : null;

  const newDOM = toDOM(element);
  
  // Use replaceChildren for a smoother replacement (modern browsers)
  if (container.replaceChildren) {
    container.replaceChildren(newDOM);
  } else {
    // Fallback for older browsers
    container.innerHTML = "";
    container.appendChild(newDOM);
  }

  // Restore focus and input state after re-render
  if (isFocusedInput) {
    requestAnimationFrame(() => {
      // Find the input element in the new DOM
      const newInput = container.querySelector('input[type="text"]');
      if (newInput) {
        newInput.focus();
        if (inputValue !== null) {
          newInput.value = inputValue;
        }
        if (inputSelectionStart !== null && inputSelectionEnd !== null) {
          newInput.setSelectionRange(inputSelectionStart, inputSelectionEnd);
        }
      }
    });
  }
}

export { createElement, render, toDOM };

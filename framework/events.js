// Simple Pub/Sub Event System
const _events = {};

/**
 * Subscribe to an event
 * @param {string} event - Event name
 * @param {function} handler - Callback function
 */
function on(event, handler) {
	if (!_events[event]) _events[event] = [];
	_events[event].push(handler);
}

/**
 * Unsubscribe from an event
 * @param {string} event - Event name
 * @param {function} handler - Callback function
 */
function off(event, handler) {
	if (!_events[event]) return;
	_events[event] = _events[event].filter(h => h !== handler);
}

/**
 * Emit (trigger) an event
 * @param {string} event - Event name
 * @param {any} data - Data to pass to handlers
 */
function emit(event, data) {
	if (!_events[event]) return;
	_events[event].forEach(handler => handler(data));
}

export { on, off, emit };

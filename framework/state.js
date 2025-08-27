// Simple global state store
let _state = {};
const _listeners = new Set();

/**
 * Get the current state (shallow copy)
 */
function getState() {
	return { ..._state };
}

/**
 * Set/update the state (merges newState into current state)
 * Notifies all subscribers
 */
function setState(newState) {
	_state = { ..._state, ...newState };
	_listeners.forEach(fn => fn(getState()));
}

/**
 * Subscribe to state changes
 * @param {function} fn - Callback to run on state change
 * @returns {function} Unsubscribe function
 */
function subscribe(fn) {
	_listeners.add(fn);
	return () => _listeners.delete(fn);
}

/**
 * Unsubscribe from state changes
 * @param {function} fn - The callback to remove
 */
function unsubscribe(fn) {
	_listeners.delete(fn);
}

export { getState, setState, subscribe, unsubscribe };

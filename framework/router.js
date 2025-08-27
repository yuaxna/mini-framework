// Simple hash-based router
let routes = {};
let notFound = null;
let rootElem = null;

/**
 * Register routes
 * @param {object} routeMap - { path: renderFunction }
 * @param {function} notFoundComponent - fallback for unknown routes
 */
function registerRoutes(routeMap, notFoundComponent) {
	routes = { ...routeMap };
	notFound = notFoundComponent || (() => document.createTextNode('Not found'));
}

/**
 * Start the router
 * @param {HTMLElement} root - The container to render into
 */
function startRouter(root) {
	rootElem = root;
	window.addEventListener('hashchange', renderRoute);
	renderRoute();
}

/**
 * Navigate to a path (changes hash)
 */
function navigate(path) {
	window.location.hash = path;
}

/**
 * Render the current route
 */
function renderRoute() {
	if (!rootElem) return;
	const path = window.location.hash.replace(/^#/, '') || '/';
	const component = routes[path] || notFound;
	// Support function or element
	const el = typeof component === 'function' ? component() : component;
	rootElem.innerHTML = '';
	rootElem.appendChild(el);
}

export { registerRoutes, startRouter, navigate };

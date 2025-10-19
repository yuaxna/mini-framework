import { createElement, render } from "./framework/dom.js";
import { setState, getState, subscribe } from "./framework/state.js";
import { registerRoutes, startRouter, navigate } from "./framework/router.js";

// --- DOM Abstraction Test ---
const domTest = createElement("div", { class: "container" }, [
  createElement("h1", {}, ["Hello Framework!"]),
  createElement("button", { onClick: () => alert("Button clicked!") }, ["Click Me"])
]);



// --- State Management Test ---
setState({ count: 1 });
subscribe((state) => {
  console.log("State changed:", state);
});
setTimeout(() => setState({ count: 2 }), 1000);

// --- Routing Test ---
const Home = () => createElement("div", {}, [
  createElement("h2", {}, ["Home Page"]),
  createElement("button", { onClick: () => navigate("/about") }, ["Go to About"])
]);
const About = () => createElement("div", {}, [
  createElement("h2", {}, ["About Page"]),
  createElement("button", { onClick: () => navigate("/") }, ["Go Home"])
]);

registerRoutes({
  "/": Home,
  "/about": About
});

// Start router (will render Home or About based on hash)
startRouter(document.getElementById("root"));

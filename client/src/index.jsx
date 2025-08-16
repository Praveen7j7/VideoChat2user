// Fix Node.js global issue in browser
import global from 'global'
window.global = window;
window.Buffer=window.Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./SocketContext";
import "./style.css";
window.global = window.global || window.globalThis;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);

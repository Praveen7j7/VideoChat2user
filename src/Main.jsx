import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import App from "./App";
import { ContextProvider } from './Context';

window.global = window;

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

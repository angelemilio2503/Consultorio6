import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <AppRoutes />
    <App />
  </React.StrictMode>,
);

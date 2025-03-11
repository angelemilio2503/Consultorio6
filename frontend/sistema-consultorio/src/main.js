"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var AppRoutes_1 = require("./routes/AppRoutes");
var material_1 = require("@mui/material");
client_1.default.createRoot(document.getElementById("root")).render(<react_1.default.StrictMode>
    <material_1.CssBaseline />
    <AppRoutes_1.default />
  </react_1.default.StrictMode>);

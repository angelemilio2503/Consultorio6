import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pacientes from "./pages/Pacientes/pacientes";
import Doctores from "./pages/Doctores/Doctores";
import Login from "./pages/Auth/Login";
import AñadirPaciente from "./pages/Pacientes/añadir-pacientes"; // Importa el nuevo componente
import "leaflet/dist/leaflet.css";
import "./App.css";
import React from 'react';
import Citas from './pages/Projects/citas';
import CrearCitas from "./pages/Projects/crear-citas";



function App() {
  return (
    <Router>
      {/* Proporciona animaciones al cambiar de página */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/doctores" element={<Doctores />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/añadir-pacientes" element={<AñadirPaciente />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/citas" element={<CrearCitas />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

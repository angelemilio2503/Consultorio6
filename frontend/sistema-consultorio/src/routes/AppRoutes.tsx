import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProjectManagement from "../pages/Projects/ProjectManagement";
import Doctores from "../pages/Doctores/Doctores";
import Pacientes from "../pages/Pacientes/pacientes";
import AgregarDoctor from "../pages/Doctores/agregar-doctores";
import AñadirPaciente from "../pages/Pacientes/añadir-pacientes";
import CityPharmacyMap from "../pages/Map/CityPharmacyMap"; // Mapa de farmacias
import Citas from "../pages/Projects/citas"; // Importar la nueva página
import CrearCitas from "../pages/Projects/crear-citas"; // Importar el nuevo componente
import React from 'react';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />
        <Route
          path="/crear-citas"
          element={
            <PrivateRoute>
              <CrearCitas />
            </PrivateRoute>
          }
        />
                <Route path="/login" element={<Login />} />
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
  path="/citas"
  element={
    <PrivateRoute>
      <Citas />
    </PrivateRoute>
  }
/>
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctores"
          element={
            <PrivateRoute>
              <Doctores />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/agregar-doctor"
          element={
            <PrivateRoute>
              <AgregarDoctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/añadir-paciente"
          element={
            <PrivateRoute>
              <AñadirPaciente />
            </PrivateRoute>
          }
        />
        <Route
          path="/buscar-farmacia"
          element={
            <PrivateRoute>
              <CityPharmacyMap />
            </PrivateRoute>
          }
        />

        {/* Rutas de departamentos y pacientes (placeholder) */}
        <Route
          path="/departments"
          element={
            <PrivateRoute>
              <h1>Departamentos</h1>
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <h1>Pacientes</h1>
            </PrivateRoute>
          }
        />

        {/* Redirección en caso de que la ruta no exista */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// Componente para proteger las rutas privadas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default AppRoutes;

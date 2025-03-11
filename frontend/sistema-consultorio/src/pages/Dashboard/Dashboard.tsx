import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import React from 'react';
import { Cita } from "../../types/types";



// Definir un ícono personalizado para farmacias
const pharmacyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3916/3916651.png",
  iconSize: [30, 30],
});

// Animaciones
const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
};

const buttonAnimation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [citaFechas, setCitaFechas] = useState<Date[]>([]);

    // Función para cerrar sesión
    const handleLogout = () => {
      localStorage.removeItem("token"); // Eliminar el token de autenticación
      navigate("/login"); // Redirigir al login
    };
  

  // Coordenadas de Montemorelos, Nuevo León
  const cityCoords: [number, number] = [25.1890, -99.8280];

  // Lista de farmacias en Montemorelos
  const pharmacyLocations = [
    { lat: 25.1885, lng: -99.8282, name: "Farmacia Guadalajara" },
    { lat: 25.1901, lng: -99.8275, name: "Farmacia Benavides" },
    { lat: 25.1859, lng: -99.8304, name: "Farmacia Similares" },
    { lat: 25.1914, lng: -99.8261, name: "Farmacia del Ahorro" },
  ];

  // Obtener citas pendientes desde la API
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/citas");
        const fechas = (response.data as Cita[])
          .filter((cita) => cita.estado === "pendiente")
          .map((cita) => new Date(cita.fecha));
        setCitaFechas(fechas);
      } catch (error) {
        console.error("Error al obtener citas pendientes:", error);
      }
    };

    fetchCitas();
  }, []);

  // Resaltar fechas con citas pendientes en el calendario
  const tileClassName = ({ date }: { date: Date }) => {
    return citaFechas.some(
      (citaFecha) =>
        citaFecha.getDate() === date.getDate() &&
        citaFecha.getMonth() === date.getMonth() &&
        citaFecha.getFullYear() === date.getFullYear()
    )
      ? "highlight"
      : null;
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Barra de navegación */}
        <AppBar position="static" sx={{ backgroundColor: "rgb(0, 111, 191)" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{ color: "#FFFFFF", fontWeight: "bold" }}
            >
              Dashboard Principal
            </Typography>

            {/* Barra de navegación */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                sx={{ color: "#FFFFFF" }}
                onClick={() => navigate("/citas")}
              >
                Gestión de Citas
              </Button>
              <Button
                sx={{ color: "#FFFFFF" }}
                onClick={() => navigate("/doctores")}
              >
                Doctores
              </Button>
              <Button
                sx={{ color: "#FFFFFF" }}
                onClick={() => navigate("/pacientes")}
              >
                Pacientes
              </Button>
              <Button sx={{ color: "#FFFFFF" }}>Departamentos</Button>
                          {/* Botón de Cerrar sesión */}
            <Button
              sx={{
                color: "#FFFFFF",
                backgroundColor: "red",
                "&:hover": { backgroundColor: "darkred" },
              }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
            </Box>

            {/* Barra de búsqueda interactiva */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s ease-in-out",
                width: isSearchVisible ? "300px" : "50px",
                backgroundColor: isSearchVisible ? "white" : "transparent",
                borderRadius: 3,
                padding: isSearchVisible ? "5px 10px" : "0px",
              }}
              onMouseEnter={() => setIsSearchVisible(true)}
              onMouseLeave={() => setIsSearchVisible(false)}
            >
              <IconButton>
                <SearchIcon
                  sx={{ color: isSearchVisible ? "#0090FF" : "white" }}
                />
              </IconButton>
              {isSearchVisible && (
                <InputBase
                  placeholder="Buscar..."
                  sx={{
                    ml: 1,
                    flex: 1,
                    color: "black",
                    "& input": {
                      padding: "5px",
                    },
                  }}
                />
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Botones debajo de la barra de navegación */}
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/crear-citas")}
            >
              Crear una cita
            </Button>
          </motion.div>

          <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCalendarOpen(true)}
            >
              Verificar calendario
            </Button>
          </motion.div>

          <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
            <Button
              variant="contained"
              color="success"
              onClick={() => setIsMapOpen(true)}
            >
              Buscar farmacias
            </Button>
          </motion.div>
        </Box>

        {/* Modal con el Mapa de Farmacias */}
        <Modal open={isMapOpen} onClose={() => setIsMapOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              backgroundColor: "white",
              boxShadow: 24,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Farmacias Cercanas en Montemorelos
            </Typography>
            <MapContainer
              center={cityCoords}
              zoom={13}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {pharmacyLocations.map((pharmacy, index) => (
                <Marker
                  key={index}
                  position={[pharmacy.lat, pharmacy.lng]}
                  icon={pharmacyIcon}
                >
                  <Popup>{pharmacy.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Modal>

        {/* Modal con el Calendario de Citas */}
        <Modal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              height: "55%",
              backgroundColor: "white",
              boxShadow: 24,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Calendario de Citas Pendientes
            </Typography>
            <Calendar tileClassName={tileClassName} />
          </Box>
        </Modal>
      </Box>

      {/* Estilo para resaltar las citas pendientes */}
      <style>{`
        .highlight {
          background: #ff5722;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;

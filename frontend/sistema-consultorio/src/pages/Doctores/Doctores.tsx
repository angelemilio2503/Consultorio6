import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import React from "react";

// 🔹 Animaciones generales
const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
};

// 🔹 Animaciones para acciones de botones
const buttonAnimation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

interface Doctor {
  id: number;
  nombre: string;
  cedula: string;
  especializacion: string;
  area: string;
  telefono: string;
}

interface DecodedToken {
  rol: string;
}

const Doctores = () => {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔹 Cargar la URL de la API desde las variables de entorno o usar la predeterminada
  const API_URL = import.meta.env.VITE_API_URL || "https://consultorio5.onrender.com";

  // ✅ Obtener el rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.rol);
      } catch (err) {
        console.error("Error al decodificar el token:", err);
      }
    }
  }, []);

  // ✅ Obtener la lista de doctores
  useEffect(() => {
    const fetchDoctores = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No tienes acceso. Inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/doctores/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctores(response.data);
      } catch (err: any) {
        setError("Error al obtener la lista de doctores.");
        console.error("❌ Error al obtener doctores:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctores();
  }, [API_URL]);

  // ✅ Eliminar doctor (solo Admin)
  const handleDelete = async (id: number) => {
    if (userRole !== "Admin") return;

    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este doctor?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/doctores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Doctor eliminado exitosamente.");
      setDoctores((prevDoctores) => prevDoctores.filter((doctor) => doctor.id !== id));
    } catch (err: any) {
      alert("❌ Error al eliminar el doctor.");
      console.error("❌ Error al eliminar doctor:", err.response?.data || err.message);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ✅ Barra de navegación */}
        <AppBar position="static" sx={{ backgroundColor: "rgb(0, 111, 191)" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
              Gestión de Doctores
            </Typography>

            {/* Navegación */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/dashboard")}>
                Dashboard Principal
              </Button>
              <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/citas")}>
                Gestión de Citas
              </Button>
              <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/pacientes")}>
                Pacientes
              </Button>
              <Button sx={{ color: "#FFFFFF" }}>Departamentos</Button>
            </Box>

            {/* Barra de búsqueda */}
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
                <SearchIcon sx={{ color: isSearchVisible ? "#0090FF" : "white" }} />
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

        {/* ✅ Contenido de la página */}
        <Box sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4">Lista de Doctores</Typography>

            {userRole === "Admin" && (
              <motion.div variants={buttonAnimation} whileHover="whileHover" whileTap="whileTap">
                <Button variant="contained" color="primary" onClick={() => navigate("/agregar-doctor")}>
                  Agregar Doctor
                </Button>
              </motion.div>
            )}
          </Box>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cédula</TableCell>
                    <TableCell>Especialización</TableCell>
                    <TableCell>Área</TableCell>
                    <TableCell>Teléfono</TableCell>
                    {userRole === "Admin" && <TableCell>Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctores.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.id}</TableCell>
                      <TableCell>{doctor.nombre}</TableCell>
                      <TableCell>{doctor.cedula}</TableCell>
                      <TableCell>{doctor.especializacion}</TableCell>
                      <TableCell>{doctor.area}</TableCell>
                      <TableCell>{doctor.telefono}</TableCell>
                      {userRole === "Admin" && (
                        <TableCell>
                          <IconButton color="error" onClick={() => handleDelete(doctor.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default Doctores;

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';

//import backgroundImage from '../../imagenes/consultorio2.jpg'; // Asegúrate de que la ruta sea correcta

const projects = [
  { id: 1, name: 'Proyecto A', tasks: 5 },
  { id: 2, name: 'Proyecto B', tasks: 8 },
];

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <Box
      sx={{
        height: '100vh', // Ocupa toda la altura de la pantalla
        width: '100vw', // Ocupa toda la anchura de la pantalla
        // backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', // La imagen cubre toda la pantalla manteniendo la proporción
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat', // Evita la repetición
      }}
    >
      {/* Barra de navegación */}
      <AppBar position="static" sx={{ backgroundColor: 'rgb(0, 111, 191)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Título */}
          <Typography
            variant="h6"
            sx={{ color: '#FFFFFF', fontWeight: 'bold' }}
          >
            Gestión de Proyectos y Tareas
          </Typography>

          {/* Barra de navegación */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              sx={{ color: '#FFFFFF' }}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard Principal
            </Button>
            <Button sx={{ color: '#FFFFFF' }} onClick={() => navigate("/doctores")}>
              Doctores
            </Button>

            <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/pacientes")}>
              Pacientes
            </Button>            
            <Button sx={{ color: '#FFFFFF' }}>Departamentos</Button>
          </Box>

          {/* Barra de búsqueda interactiva */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease-in-out',
              width: isSearchVisible ? '300px' : '50px',
              backgroundColor: isSearchVisible ? 'white' : 'transparent',
              borderRadius: 3,
              padding: isSearchVisible ? '5px 10px' : '0px',
            }}
            onMouseEnter={() => setIsSearchVisible(true)}
            onMouseLeave={() => setIsSearchVisible(false)}
          >
            <IconButton>
              <SearchIcon
                sx={{ color: isSearchVisible ? '#0090FF' : 'white' }}
              />
            </IconButton>
            {isSearchVisible && (
              <InputBase
                placeholder="Buscar..."
                sx={{
                  ml: 1,
                  flex: 1,
                  color: 'black',
                  '& input': {
                    padding: '5px',
                  },
                }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <TableContainer component={Paper} sx={{ mt: 4, p: 2, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#0090FF' }}
        >
          Gestión de Proyectos y Tareas
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Proyecto</TableCell>
              <TableCell>Tareas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.tasks}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectManagement;

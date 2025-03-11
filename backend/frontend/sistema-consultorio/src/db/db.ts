import { Client } from 'pg';

// Configuración de la conexión a PostgreSQL
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",    // Cambia por tu usuario de PostgreSQL
  password: "Mtzlopez1092",  // Cambia por tu contraseña
  database: "sistema_consultorio"  // Cambia por el nombre de tu base de datos
});

client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión', err));

export default client;

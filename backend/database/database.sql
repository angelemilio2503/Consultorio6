CREATE DATABASE consultorio;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    email TEXT,
    password
);

INSERT INTO users (name, email, password)
VALUES ('Angel', 'angel@gmail.com', '1234'),
       ('Willy', 'willy@gmail.com', '1234'),
       ('Sergio', 'sergio@gmail.com', '1234');

-- Crear la tabla de doctores
CREATE TABLE doctores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(50) UNIQUE NOT NULL,
    especializacion VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL
);

-- Crear usuario de doctores
CREATE TABLE doctores_users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol VARCHAR(20) DEFAULT 'Doctor'
);


-- Crear la tabla de pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    padecimientos TEXT NOT NULL,
    tipo_sangre VARCHAR(5) NOT NULL,
    discapacidades TEXT
);
ALTER TABLE pacientes ADD COLUMN diagnostico TEXT;


-- Crear la tabla de tareas y proyectos
CREATE TABLE tareas_proyectos (
    id SERIAL PRIMARY KEY,
    nombre_tarea VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_limite DATE NOT NULL,
    descripcion TEXT  -- ✅ No lleva coma aquí porque es la última columna
);

-- Crear el rol de administrador con todos los permisos
CREATE ROLE admin WITH LOGIN PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Crear el rol de doctor con permisos limitados
CREATE ROLE doctor WITH LOGIN PASSWORD 'doctor123';
GRANT SELECT, INSERT, UPDATE ON doctores, pacientes, tareas_proyectos TO doctor;

-- Crear el rol de recepcionista con solo permisos de lectura
CREATE ROLE recepcionista WITH LOGIN PASSWORD 'recepcionista123';
GRANT SELECT ON doctores, pacientes TO recepcionista;

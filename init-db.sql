-- Script de inicialización de la base de datos
-- Este script se ejecuta automáticamente al crear el contenedor

-- Crear usuario si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'muebleswow') THEN
        CREATE USER muebleswow WITH PASSWORD 'muebleswow123';
    END IF;
END
$$;

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE muebleswow OWNER muebleswow'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'muebleswow')\gexec

-- Conceder permisos
GRANT ALL PRIVILEGES ON DATABASE muebleswow TO muebleswow;
GRANT CREATEDB TO muebleswow;

-- Conectar a la base de datos
\c muebleswow;

-- Conceder permisos en el esquema público
GRANT ALL ON SCHEMA public TO muebleswow;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO muebleswow;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO muebleswow;

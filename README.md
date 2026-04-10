# GastroMetric POS

Sistema de gestion para restaurantes desarrollado con FastAPI y PostgreSQL.

## Requisitos previos

* Git
* Docker Desktop

## Configuracion inicial

1. Clonar el repositorio:
   git clone https://github.com/sgallardov/GastroMetric.git

2. Configurar variables de entorno:
   Copiar el archivo .env.example y renombrarlo a .env en la raiz del proyecto.

3. Levantar los servicios con Docker:
   docker compose up --build

## Acceso a los servicios

* Backend API (Documentacion): http://localhost:8000/docs
* Adminer (Gestion de Base de Datos): http://localhost:8080

## Credenciales de desarrollo (Seed)  (OJO QUE ESTO ES PARA PRUEBAS CON EL SISTEMA HECHO, PARA VER LA BBDD ES CON EL USUARIO QEU CREAN EN SU .env)

El sistema incluye datos iniciales cargados automaticamente para pruebas:

* Usuario: admin
* Contrasena: admin123
* Base de datos: gastrometric_db
* Servidor Adminer: db
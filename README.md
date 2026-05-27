# 📚 Sistema Gestión Tutorías Académicas
Plataforma web que centraliza y automatiza la gestión de asesorías académicas entre tutores y estudiantes, 
eliminando la coordinación manual y desorganizada que genera conflictos de horario, doble reserva y falta de seguimiento.

## 🛠️ Tecnologías Utilizadas
- MongoDB Atlas --	Base de datos no relacional hospedada en la nube 
- Spring Boot	-- API REST con autenticación JWT
- React -- Interfaz de usuario con Login y CRUD

## 📁 Estructura del Proyecto
 
```
gestion-tutorias-v2/
│
├── backend/                          # Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/co/edu/gestiontutoriasmongo/
│   │       │   ├── config/
│   │       │   │   ├── JwtFilter.java        # Filtro JWT
│   │       │   │   ├── JwtUtil.java          # Utilidad JWT
│   │       │   │   └── SecurityConfig.java   # Configuración seguridad
│   │       │   ├── controller/
│   │       │   │   └── UsuarioController.java
│   │       │   ├── DTO/
│   │       │   │   ├── LoginDTO.java
│   │       │   │   ├── RegistroUsuarioDTO.java
│   │       │   │   └── UsuarioRespuestaDTO.java
│   │       │   ├── excepcion/
│   │       │   │   ├── ApiExcepcion.java
│   │       │   │   └── GlobalExcepcionHandler.java
│   │       │   ├── model/
│   │       │   │   ├── TipoUsuario.java      # Enum: tutor, estudiante
│   │       │   │   └── Usuario.java          
│   │       │   ├── repository/
│   │       │   │   └── UsuarioRepository.java
│   │       │   └── service/
│   │       │       └── UsuarioService.java
│   │       └── resources/
│   │           └── application-example.properties
│   └── pom.xml
│
mongo/                                    # Frontend React + Vite
├── public/
├── src/
│   ├── api/
│   │   ├── franjaApi.js                  # Llamadas API franjas horarias
│   │   ├── materiaApi.js                 # Llamadas API materias
│   │   ├── reservaApi.js                 # Llamadas API reservas
│   │   └── usuarioApi.js                 # Llamadas API usuarios
│   ├── assets/
│   ├── components/
│   │   ├── UsuarioForm.jsx               # Formulario de usuario
│   │   └── UsuarioList.jsx               # Lista de usuarios
│   ├── pages/
│   │   ├── EstudianteDash.jsx            # Dashboard del estudiante
│   │   ├── LoginPage.jsx                 # Pantalla de login
│   │   ├── RegisterPage.jsx              # Pantalla de registro
│   │   └── TutorDash.jsx                 # Dashboard del tutor
│   ├── styles/
│   │   ├── Dashboards.css                # Estilos dashboards
│   │   └── LoginAndRegister.css          # Estilos login y registro
│   ├── App.jsx                           # Componente principal
│   ├── index.css                         # Estilos globales
│   └── main.jsx                          # Punto de entrada
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── README.md
```
## ✨ Funcionalidades

- Registro e inicio de sesión con JWT
- Gestión de usuarios (tutores y estudiantes)
- Reserva de tutorías académicas
- Validación de conflictos de horario
- Panel independiente para tutor y estudiante
- CRUD de materias y franjas horarias
- Persistencia de datos en MongoDB Atlas

## 🔐 Seguridad

El sistema implementa autenticación y autorización mediante JSON Web Tokens (JWT).

- Inicio de sesión seguro
- Protección de rutas privadas
- Validación de tokens en cada petición
- Configuración de Spring Security

## 📊 Diapositivas
[Canva](https://canva.link/tbgy3wkizxth9i4)

## 👥 Autores
- Alejandra Rodriguez Forero
- Jerson Steven Mantilla Ramirez
- Santiago Galvis Saavedra
 

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
├── mongo/                            # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── usuarioApi.js         # Llamadas al backend
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Pantalla de login
│   │   │   ├── RegisterPage.jsx      # Registro de usuario
│   │   │   └── Dashboard.jsx         # CRUD de usuarios
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```
## 🔌 Endpoints del API
 
### Autenticación
| Método | Endpoint | Descripción | 
|--------|----------|-------------|
| POST | `/usuarios/registrar` | Registrar nuevo usuario |
| POST | `/usuarios/login` | Iniciar sesión |
 
### CRUD Usuarios
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/usuarios/listar` | Listar todos los usuarios | ✅ JWT |
| PUT | `/usuarios/actualizar/{id}` | Actualizar usuario | ✅ JWT |
| DELETE | `/usuarios/eliminar/{id}` | Eliminar usuario | ✅ JWT |


## 👥 Autores
- Alejandra Rodriguez Forero
- Jerson Steven Mantilla Ramirez
- Santiago Galvis Saavedra
 

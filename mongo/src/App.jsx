import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EstudianteDash from "./pages/EstudianteDash";
import TutorDash from "./pages/TutorDash";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [vista, setVista] = useState("login");

  if (!token) {
    return vista === "login"
      ? <LoginPage setToken={setToken} goToRegister={() => setVista("register")} />
      : <RegisterPage goToLogin={() => setVista("login")} />;
  }

  const auth = {
    id: localStorage.getItem("usuarioId"),
    nombre: localStorage.getItem("nombre"),
    tipo: localStorage.getItem("tipo") // 
  };

  // Función simple para limpiar todo y regresar a la vista de Login
  const cerrarSesion = () => {
    localStorage.clear();
    setToken(null);
  };

  // Condición limpia: si el tipo es tutor va a su dash, de lo contrario va al de estudiante
  return auth.tipo === "tutor"
    ? <TutorDash auth={auth} setAuth={cerrarSesion} />
    : <EstudianteDash auth={auth} setAuth={cerrarSesion} />;

 //return <Dashboard setToken={setToken} />;
}

export default App;
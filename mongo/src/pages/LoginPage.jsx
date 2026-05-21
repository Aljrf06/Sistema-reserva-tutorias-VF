import { useState } from "react";
import { login } from "../api/usuarioApi";
//import "../Dash.css";
import '../styles/LoginAndRegister.css';

export default function LoginPage({ setToken, goToRegister }) {

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuarioId", res.data.id);
      localStorage.setItem("nombre", res.data.nombre);
      localStorage.setItem("tipo", res.data.tipo);

      setToken(res.data.token);
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="container-center">
      <div className="card-custom">
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2"
            placeholder="Email"
            onChange={e => setForm({...form, email: e.target.value})}
          />

          <input type="password" className="form-control mb-3"
            placeholder="Password"
            onChange={e => setForm({...form, password: e.target.value})}
          />

          <button className="btn btn-primary w-100 mb-2">Entrar</button>
        </form>

        <button className="btn btn-outline-dark w-100" onClick={goToRegister}>
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
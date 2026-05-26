import { useState } from "react";
import { register } from "../api/usuarioApi";
import '../styles/LoginAndRegister.css';

export default function RegisterPage({ goToLogin }) {

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    tipo: "estudiante"
  });

  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("FORM ENVIADO:", form); // 👈 AQUÍ


    try {
      await register(form);
      setMsg("Usuario creado correctamente");
      setTimeout(goToLogin, 2000);
    } catch (err) {
  const errorMsg =
    err.response?.data?.mensaje ||
    err.response?.data ||
    "Error desconocido";

  setMsg(errorMsg);
}
  };

  return (
    <div className="container-center">
      <div className="card-custom">
        <h3 className="text-center mb-3">Registro</h3>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Nombre"
            onChange={e => setForm({...form, nombre: e.target.value})} />

          <input className="form-control mb-2" placeholder="Apellido"
            onChange={e => setForm({...form, apellido: e.target.value})} />

          <input className="form-control mb-2" placeholder="Email"
            onChange={e => setForm({...form, email: e.target.value})} />

          <input type="password" className="form-control mb-2"
            placeholder="Password"
            onChange={e => setForm({...form, password: e.target.value})} />

          <select className="form-control mb-3"
            value={form.tipo}
            onChange={e => setForm({...form, tipo: e.target.value})}>
            <option value="estudiante">Estudiante</option>
            <option value="tutor">Tutor</option>
          </select>

          <button className="btn btn-success w-100 mb-2">Registrar</button>
        </form>

        <button className="btn btn-outline-dark w-100" onClick={goToLogin}>
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
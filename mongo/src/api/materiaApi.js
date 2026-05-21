import axios from "axios";

const API = "http://localhost:8081/materias";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const registrarMateria = (data) => axios.post(`${API}/registrar`, data, authHeaders());
export const listarMaterias = () => axios.get(`${API}/listarMaterias`, authHeaders());
export const eliminarMateria = (id) => axios.delete(`${API}/${id}`, authHeaders());
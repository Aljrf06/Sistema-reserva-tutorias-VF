import axios from "axios";

const API = "http://localhost:8081/franjas-horarias";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const crearFranja = (data) => axios.post(`${API}/crearFranja`, data, authHeaders());
export const listarTodasFranjas = () => axios.get(`${API}/listarFranjas`, authHeaders());
export const listarFranjasPorTutor = (tutorId) => axios.get(`${API}/tutor/${tutorId}`, authHeaders());
export const actualizarFranja = (id, data) => axios.put(`${API}/${id}`, data, authHeaders());
export const eliminarFranja = (id) => axios.delete(`${API}/${id}`, authHeaders());
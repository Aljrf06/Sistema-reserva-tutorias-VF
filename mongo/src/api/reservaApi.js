import axios from "axios";

const API = "http://localhost:8081/reservas";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const crearReserva = (data) => axios.post(`${API}/crearReserva`, data, authHeaders());
export const listarReservasPorEstudiante = (estudianteId) => axios.get(`${API}/estudiante/${estudianteId}`, authHeaders());
export const listarReservasPorTutor = (tutorId) => axios.get(`${API}/tutor/${tutorId}`, authHeaders());
export const cancelarReserva = (id, motivo) => 
  axios.put(`${API}/cancelar/${id}?motivo=${encodeURIComponent(motivo)}`, {}, authHeaders());
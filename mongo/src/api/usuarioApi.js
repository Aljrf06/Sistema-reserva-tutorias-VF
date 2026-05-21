import axios from "axios";

const API = "http://localhost:8081/usuarios";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/registrar`, data);
export const listar = () => axios.get(`${API}/listar`, authHeaders());
export const eliminar = (id) => axios.delete(`${API}/eliminar/${id}`, authHeaders());
export const listarUsuarios = () => {return axios.get(API_URL);};
export const actualizar = (id, data) =>
  axios.put(`${API}/actualizar/${id}`, data, authHeaders());
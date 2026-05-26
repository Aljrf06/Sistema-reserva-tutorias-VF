import { useEffect, useState, useCallback } from "react";

import { listarTodasFranjas } from "../api/franjaApi";

import {
  crearReserva,
  listarReservasPorEstudiante,
  cancelarReserva
} from "../api/reservaApi";

import { listarMaterias } from "../api/materiaApi";
import { listar as listarUsuarios } from "../api/usuarioApi";

import "../styles/Dashboards.css";

export default function EstudianteDashboard({ auth, setAuth }) {

  const estudianteId = auth?.id;

  const [franjas, setFranjas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  //const [reservasOcultas, setReservasOcultas] = useState(new Set()); // Esta linea es para manejar las reservas ocultas xd

  const [filtros, setFiltros] = useState({
    materia: "",
    tutor: "",
    fecha: ""
  });

  const [msg, setMsg] = useState({
    text: "",
    type: "success"
  });

  const notify = (text, type = "success") => {

    setMsg({ text, type });

    setTimeout(() => {
      setMsg({
        text: "",
        type: "success"
      });
    }, 4000);
  };

  const cargarTodo = useCallback(async () => {

    if (!estudianteId) return;

    try {

      const [
        resFranjas,
        resReservas,
        resMaterias,
        resUsuarios
      ] = await Promise.all([
        listarTodasFranjas(),
        listarReservasPorEstudiante(estudianteId),
        listarMaterias(),
        listarUsuarios()
      ]);

      setFranjas(resFranjas.data || []);
      setReservas(resReservas.data || []);
      setMaterias(resMaterias.data || []);
      setUsuarios(resUsuarios.data || []);

    } catch (error) {

      console.error(error);

      notify(
        "Error cargando dashboard",
        "danger"
      );
    }

  }, [estudianteId]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const obtenerMateria = (materiaId) => {
    return materias.find(m => m.id === materiaId);
  };

  const obtenerTutor = (tutorId) => {
    return usuarios.find(u => u.id === tutorId);
  };

  const obtenerFranjaDeReserva = (franjaHorariaId) => {
    return franjas.find(f => f.id === franjaHorariaId);
  };

  const verificarTraslape = (franjaNueva) => {

    return reservas.some(r => {

      if (r.estado !== "activa") return false;

      // Cruzamos la reserva con su franja para obtener fecha y horario
      const franjaReservada = obtenerFranjaDeReserva(r.franjaHorariaId);
      if (!franjaReservada) return false;

      const fechaIgual = franjaReservada.fecha === franjaNueva.fecha;
      const cruzaHorario =
        franjaNueva.horaInicio < franjaReservada.horaFin &&
        franjaNueva.horaFin > franjaReservada.horaInicio;

      return fechaIgual && cruzaHorario;
    });
  };

  const handleReservar = async (franja) => {

    if (verificarTraslape(franja)) {

      notify(
        "Ya tienes una tutoría en ese horario",
        "danger"
      );

      return;
    }

    const payload = {
      estudianteId,
      franjaHorariaId: franja.id,
      estado: "activa"
    };

    try {

      await crearReserva(payload);

      notify(
        "Tutoría reservada correctamente"
      );

      cargarTodo();

    } catch (error) {

      console.error(error);

      notify(
        error.response?.data?.mensaje ||
        "No se pudo reservar",
        "danger"
      );
    }
  };

  const handleCancelar = async (id) => {

    const motivo = prompt(
      "Ingresa el motivo de cancelación"
    );

    if (motivo === null) return;

    try {

      await cancelarReserva(
        id,
        motivo || "Cancelada por estudiante"
      );

      notify("Reserva cancelada");

      cargarTodo();

    } catch (error) {

      console.error(error);

      notify(
        error.response?.data?.mensaje ||
        "No se pudo cancelar",
        "danger"
      );
    }
  };


  const limpiarFiltros = () => {

    setFiltros({
      materia: "",
      tutor: "",
      fecha: ""
    });
  };

  const franjasDisponibles = franjas.filter(f => {

    if (f.estado !== "disponible") {
      return false;
    }

    const materia = obtenerMateria(f.materiaId);
    const tutor = obtenerTutor(f.tutorId);

    const nombreMateria = materia?.nombre?.toLowerCase() || "";
    const nombreTutor = tutor
      ? `${tutor.nombre} ${tutor.apellido}`.toLowerCase()
      : "";

    const matchMateria =
      !filtros.materia ||
      nombreMateria.includes(
        filtros.materia.toLowerCase()
      );

    const matchTutor =
      !filtros.tutor ||
      nombreTutor.includes(
        filtros.tutor.toLowerCase()
      );

    const matchFecha =
      !filtros.fecha ||
      f.fecha === filtros.fecha;

    return (
      matchMateria &&
      matchTutor &&
      matchFecha
    );
  });

  return (

    <div className="dashboard">

      <main className="main-content">

        <header className="header">

          <div className="header-title">

            <span className="icon-book">
              🎓
            </span>

            <div>
              <h1>Portal para estudiantes</h1>

              <p>
                Bienvenid@,
                {" "}
                {auth?.nombre}
              </p>
            </div>

          </div>

          <button
            className="btn-logout"
            onClick={() => setAuth(null)}
          >
            Cerrar Sesión
          </button>

        </header>

        {msg.text && (

          <div
            className={`alert alert-${msg.type}`}
          >
            {msg.text}
          </div>
        )}

        <section className="actions-section">

          <div className="section-title">
            <h2>
              Buscar tutorías disponibles
            </h2>
          </div>

          <div
            className="filter-bar"
            style={{
              marginBottom: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              alignItems: "flex-end",
              background: "white",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #ddd"
            }}
          >

            <div
              style={{
                flexGrow: 1,
                minWidth: "150px"
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "0.9em"
                }}
              >
                Materia:
              </label>

              <input
                type="text"
                placeholder="Ej: Cálculo"
                value={filtros.materia}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    materia: e.target.value
                  })
                }
              />

            </div>

            <div
              style={{
                flexGrow: 1,
                minWidth: "150px"
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "0.9em"
                }}
              >
                Tutor:
              </label>

              <input
                type="text"
                placeholder="Ej: Juan"
                value={filtros.tutor}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    tutor: e.target.value
                  })
                }
              />

            </div>

            <div
              style={{
                flexGrow: 1,
                minWidth: "150px"
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "0.9em"
                }}
              >
                Fecha:
              </label>

              <input
                type="date"
                value={filtros.fecha}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    fecha: e.target.value
                  })
                }
              />

            </div>

            <button
              className="btn-primary"
              onClick={cargarTodo}
            >
              Buscar
            </button>

            <button
              onClick={limpiarFiltros}
              style={{
                background: "#eee",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 15px",
                cursor: "pointer"
              }}
            >
              Limpiar
            </button>

          </div>

        </section>

        <div className="slots-grid">

          {franjasDisponibles.length === 0 ? (

            <p>
              No hay tutorías disponibles.
            </p>

          ) : (

            franjasDisponibles.map(f => {

              const materia = obtenerMateria(f.materiaId);
              const tutor = obtenerTutor(f.tutorId);

              return (

                <article
                  className="slot-card"
                  key={f.id}
                >

                  <div className="card-header">

                    <strong>
                      {materia?.nombre ||
                        "Sin materia"}
                    </strong>

                    <span
                      className="status"
                      style={{
                        background: "#def7ec",
                        color: "#03543f"
                      }}
                    >
                      Disponible
                    </span>

                  </div>

                  <div className="card-body">

                    <p>
                      👨‍🏫 Tutor:
                      {" "}
                      {tutor
                        ? `${tutor.nombre} ${tutor.apellido}`
                        : "No disponible"}
                    </p>

                    <p>
                      📅 Fecha:
                      {" "}
                      {f.fecha}
                    </p>

                    <p>
                      🕒
                      {" "}
                      {f.horaInicio}
                      {" - "}
                      {f.horaFin}
                    </p>

                    <p>
                      📝
                      {" "}
                      {f.descripcion ||
                        "Sin descripción"}
                    </p>

                  </div>

                  <div className="card-actions">

                    <button
                      className="btn-primary"
                      onClick={() =>
                        handleReservar(f)
                      }
                    >
                      Reservar
                    </button>

                  </div>

                </article>
              );
            })
          )}

        </div>

        <section
          className="reservations-section"
          style={{
            marginTop: "40px"
          }}
        >

          <div className="section-title">

            <h2>
              Mis solicitudes de tutoría
            </h2>

          </div>

          <div
            className="table-container"
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >

              <thead>

                <tr
                  style={{
                    textAlign: "left",
                    borderBottom:
                      "2px solid #eee"
                  }}
                >

                  <th>Materia</th>
                  <th>Tutor</th>
                  <th>Fecha/Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {reservas.length === 0 ? (

                  <tr>

                    <td colSpan="5">
                      No tienes reservas aún
                    </td>

                  </tr>

                ) : (

                  reservas.map(r => {

                    // Cruzamos la reserva con su franja para obtener todos los datos

                    const franja = obtenerFranjaDeReserva(r.franjaHorariaId);
                    const materia = obtenerMateria(franja?.materiaId);
                    const tutor = obtenerTutor(franja?.tutorId);

                    return (

                      <tr key={r.id}>

                        <td>
                          {materia?.nombre || "N/A"}
                        </td>

                        <td>
                          {tutor
                            ? `${tutor.nombre} ${tutor.apellido}`
                            : "N/A"}
                        </td>

                        <td>
                          {franja?.fecha || ""}
                          <br />
                          {franja?.horaInicio} - {franja?.horaFin}
                        </td>

                        <td>

                          <span
                            style={{
                              background:
                                r.estado ===
                                "activa"
                                  ? "#d4edda"
                                  : "#f8d7da",

                              color:
                                r.estado ===
                                "activa"
                                  ? "#155724"
                                  : "#721c24",

                              padding:
                                "4px 8px",

                              borderRadius:
                                "4px",

                              fontWeight:
                                "bold"
                            }}
                          >
                            {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                          </span>

                        </td>

                        <td>
                          <button
                           className="btn-delete"
                           onClick={() => handleCancelar(r.id)}
                           disabled={r.estado !== "activa"}
    
                          >
                            Cancelar
                          </button>
                        </td>


                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}
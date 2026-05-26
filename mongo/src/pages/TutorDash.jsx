import { useEffect, useState, useCallback } from "react";

import {
  registrarMateria,
  listarMaterias,
  eliminarMateria
} from "../api/materiaApi";

import { listar as listarUsuarios } from "../api/usuarioApi";

import {
  crearFranja,
  listarFranjasPorTutor,
  actualizarFranja,
  eliminarFranja
} from "../api/franjaApi";

import {
  listarReservasPorTutor,
  cancelarReserva
} from "../api/reservaApi";

import "../styles/Dashboards.css";

const FRANJA_VACIA = {
  fecha: "",
  horaInicio: "",
  horaFin: "",
  descripcion: "",
  materiaId: ""
};

export default function TutorDashboard({ auth, setAuth }) {

  const tutorId = auth?.id;

  const [materias, setMaterias] = useState([]);
  const [franjas, setFranjas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [panel, setPanel] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const [formFranja, setFormFranja] = useState(FRANJA_VACIA);

  const [formMateria, setFormMateria] = useState({
    nombre: "",
    descripcion: ""
  });

  const [msg, setMsg] = useState({
    text: "",
    type: "success"
  });

  const notify = (text, type = "success") => {

    setMsg({ text, type });

    setTimeout(() => {
      setMsg({ text: "", type: "success" });
    }, 4000);
  };

  const obtenerNombreMateria = (materiaId) => {
    const materia = materias.find(m => m.id === materiaId);
    return materia?.nombre || "Sin materia";
  };

  const obtenerNombreEstudiante = (estudianteId) => {
    const usuario = usuarios.find(u => u.id === estudianteId);
    return usuario
      ? `${usuario.nombre} ${usuario.apellido}`
      : "N/A";
  };

  const obtenerReservaDeFranja = (franjaId) => {

    return reservas.find(r =>
      r.franjaHorariaId === franjaId &&
      r.estado === "activa"
    );
  };

  const cargarTodo = useCallback(async () => {

    if (!tutorId) return;

    try {

      const [resMat, resFra, resRes, resUsr] = await Promise.all([
        listarMaterias(),
        listarFranjasPorTutor(tutorId),
        listarReservasPorTutor(tutorId),
        listarUsuarios()
      ]);

      setMaterias(resMat.data || []);
      setFranjas(resFra.data || []);
      setReservas(resRes.data || []);
      setUsuarios(resUsr.data || []);

    } catch (error) {

      console.error(error);

      notify("Error cargando dashboard", "danger");
    }

  }, [tutorId]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const mostrarPanel = (id) => {

    setPanel(prev => prev === id ? null : id);

    if (id === "franjaForm") {
      setEditandoId(null);
      setFormFranja(FRANJA_VACIA);
    }
  };

  const hayTraslapeLocal = (
    fecha,
    inicio,
    fin,
    omitirId = null
  ) => {

    return franjas.some(f => {

      if (omitirId && f.id === omitirId) return false;

      if (f.fecha !== fecha) return false;

      return (
        inicio < f.horaFin &&
        fin > f.horaInicio
      );

    });
  };

  const handleCrearMateria = async (e) => {

    e.preventDefault();

    if (!formMateria.nombre.trim()) {
      notify("El nombre es obligatorio", "danger");
      return;
    }

    try {

      await registrarMateria(formMateria);

      notify("Materia creada exitosamente");

      setFormMateria({
        nombre: "",
        descripcion: ""
      });

      cargarTodo();

    } catch (error) {

      notify(
        error.response?.data?.mensaje ||
        "No se pudo crear la materia",
        "danger"
      );
    }
  };

  const handleEliminarMateria = async (id) => {

  const materiaEnUso = franjas.some(f =>

    f.materiaId === id &&
    f.estado !== "disponible"

  );

  if (materiaEnUso) {

    notify(
      "No puedes eliminar una materia con franjas reservadas",
      "danger"
    );

    return;
  }

  const tieneFranjas = franjas.some(
    f => f.materiaId === id
  );

  if (tieneFranjas) {

    const confirmar = window.confirm(
      "Esta materia tiene franjas disponibles asociadas. ¿Deseas eliminarla igualmente?"
    );

    if (!confirmar) return;

  } else {

    const confirmar = window.confirm(
      "¿Eliminar materia?"
    );

    if (!confirmar) return;
  }

  try {

    await eliminarMateria(id);

    notify("Materia eliminada");

    cargarTodo();

  } catch (error) {

    notify(
      error.response?.data?.mensaje ||
      "No se pudo eliminar la materia",
      "danger"
    );
  }
};



  const handleGuardarFranja = async (e) => {

    e.preventDefault();

    const {
      fecha,
      horaInicio,
      horaFin,
      descripcion,
      materiaId
    } = formFranja;

    if (!fecha || !horaInicio || !horaFin || !materiaId) {
      notify("Completa todos los campos", "danger");
      return;
    }

    if (horaInicio >= horaFin) {
      notify("Horario inválido", "danger");
      return;
    }

    if (
      hayTraslapeLocal(
        fecha,
        horaInicio,
        horaFin,
        editandoId
      )
    ) {
      notify("La franja se cruza con otra", "danger");
      return;
    }

    const payload = {
      fecha,
      horaInicio,
      horaFin,
      descripcion,
      estado: "disponible",
      tutorId,
      materiaId
    };

    try {

      if (editandoId) {

        await actualizarFranja(editandoId, payload);

        notify("Franja actualizada");

      } else {

        await crearFranja(payload);

        notify("Franja creada");
      }

      setFormFranja(FRANJA_VACIA);
      setEditandoId(null);
      setPanel(null);

      cargarTodo();

    } catch (error) {

      notify(
        error.response?.data?.mensaje ||
        "Error guardando franja",
        "danger"
      );
    }
  };

  const handleEditarFranja = (franja) => {

    if (franja.estado !== "disponible") {
      notify("No puedes editar una franja reservada", "danger");
      return;
    }

    setFormFranja({
      fecha: franja.fecha,
      horaInicio: franja.horaInicio,
      horaFin: franja.horaFin,
      descripcion: franja.descripcion || "",
      materiaId: franja.materiaId || ""
    });

    setEditandoId(franja.id);

    setPanel("franjaForm");
  };

  const handleEliminarFranja = async (id) => {

    if (!window.confirm("¿Eliminar franja?")) return;

    try {

      await eliminarFranja(id);

      notify("Franja eliminada");

      cargarTodo();

    } catch (error) {

      notify(
        error.response?.data?.mensaje ||
        "No se pudo eliminar",
        "danger"
      );
    }
  };

  const handleCancelarReserva = async (id) => {

    const motivo = prompt(
      "Ingresa el motivo de cancelación"
    );

    if (motivo === null) return;

    try {

      await cancelarReserva(
        id,
        motivo || "Cancelada por tutor"
      );

      notify("Reserva cancelada correctamente");

      cargarTodo();

    } catch (error) {

      notify(
        error.response?.data?.mensaje ||
        "No se pudo cancelar",
        "danger"
      );
    }
  };



  return (
    
    <div className="dashboard">

      <main className="main-content">

        <header className="header">

          <div className="header-title">

            <span className="icon-book">
              🎓
            </span>

            <div>
              <h1>Portal para tutores</h1>

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
            Cerrar sesión
          </button>

        </header>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
          </div>
        )}

        <section className="actions-section">

          <div className="section-title">

            <h2>Franjas Horarias</h2>

            <div className="button-group">

              <button
                className="btn-primary"
                onClick={() => mostrarPanel("franjaForm")}
              >
                Nueva Franja
              </button>

              <button
                className="btn-primary"
                onClick={() => mostrarPanel("materiaForm")}
              >
                Nueva Materia
              </button>

            </div>

          </div>

          {panel === "franjaForm" && (

            <div className="form-card">

              <form onSubmit={handleGuardarFranja}>

                <input
                  type="date"
                  value={formFranja.fecha}
                  onChange={(e) =>
                    setFormFranja({
                      ...formFranja,
                      fecha: e.target.value
                    })
                  }
                />

                <input
                  type="time"
                  value={formFranja.horaInicio}
                  onChange={(e) =>
                    setFormFranja({
                      ...formFranja,
                      horaInicio: e.target.value
                    })
                  }
                />

                <input
                  type="time"
                  value={formFranja.horaFin}
                  onChange={(e) =>
                    setFormFranja({
                      ...formFranja,
                      horaFin: e.target.value
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Descripción"
                  value={formFranja.descripcion}
                  onChange={(e) =>
                    setFormFranja({
                      ...formFranja,
                      descripcion: e.target.value
                    })
                  }
                />

                <select
                  value={formFranja.materiaId}
                  onChange={(e) =>
                    setFormFranja({
                      ...formFranja,
                      materiaId: e.target.value
                    })
                  }
                >

                  <option value="">
                    Seleccionar Materia
                  </option>

                  {materias.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}

                </select>

                <button
                  className="btn-save"
                  type="submit"
                >
                  {editandoId
                    ? "Actualizar"
                    : "Guardar"}
                </button>

              </form>

            </div>
          )}

          {panel === "materiaForm" && (

            <div className="form-card">

              <form onSubmit={handleCrearMateria}>

                <input
                  type="text"
                  placeholder="Nombre"
                  value={formMateria.nombre}
                  onChange={(e) =>
                    setFormMateria({
                      ...formMateria,
                      nombre: e.target.value
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Descripción"
                  value={formMateria.descripcion}
                  onChange={(e) =>
                    setFormMateria({
                      ...formMateria,
                      descripcion: e.target.value
                    })
                  }
                />

                <button
                  className="btn-save"
                  type="submit"
                >
                  Guardar Materia
                </button>

              </form>

              <div className="materias-list">

                <h3>Materias Registradas</h3>

                {materias.length === 0 ? (
                  <p>No hay materias registradas</p>
                ) : (

                  materias.map(m => (

                    <div
                      key={m.id}
                      className="materia-item"
                    >

                      <div>
                        <strong>{m.nombre}</strong>
                        <p>{m.descripcion}</p>
                      </div>

                      <button
                        className="btn-delete"
                        onClick={() => handleEliminarMateria(m.id)}
                      >
                        Eliminar
                      </button>

                    </div>
                  ))
                )}

              </div>

            </div>
          )}

          <div className="slots-grid">

            {franjas.length === 0 ? (
              <p>No tienes franjas registradas aún.</p>
            ) : (

              franjas.map(f => {

                const disponible =
                  f.estado === "disponible";

                return (
                  <article
                    className="slot-card"
                    key={f.id}
                  >

                    <div className="card-header">

                      <strong>
                        {obtenerNombreMateria(f.materiaId)}
                      </strong>

                      <span
                        className="status"
                        style={{
                          background: disponible
                            ? "#def7ec"
                            : "#fde8e8",
                          color: disponible
                            ? "#03543f"
                            : "#9b1c1c"
                        }}
                      >
                        {disponible
                          ? "Disponible"
                          : "Ocupada"}
                      </span>

                    </div>

                    <div className="card-body">

                      <p>📅 Fecha: {f.fecha}</p>

                      <p>
                        🕒 Horario:
                        {" "}
                        {f.horaInicio} - {f.horaFin}
                      </p>

                      <p>
                        📝
                        {" "}
                        {f.descripcion || "Sin descripción"}
                      </p>

                    </div>

                    <div className="card-actions">

                      {disponible ? (
                        <>

                          <button
                            className="btn-edit"
                            onClick={() => handleEditarFranja(f)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => handleEliminarFranja(f.id)}
                          >
                            Eliminar
                          </button>

                        </>
                      ) : (

                        <p className="blocked-msg">
                          🔒 Reservada
                        </p>
                      )}

                    </div>

                  </article>
                );
              })
            )}

          </div>

        </section>

        <section className="reservas-section">

          <div className="section-title">

            <h2>
              Reservas de tutorías
            </h2>

          </div>

          <table>

            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Materia</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {reservas.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No hay reservas aún
                  </td>
                </tr>

              ) : (

                reservas
                
                .map(r => {

                  const franja = franjas.find(
                    f => f.id === r.franjaHorariaId
                  );

                  const materia = materias.find(
                    m => m.id === franja?.materiaId
                  );

                  const activa = r.estado === "activa";

                  return (
                    <tr key={r.id}>

                      <td>
                        {obtenerNombreEstudiante(r.estudianteId)}
                      </td>

                      <td>
                        {materia?.nombre || "N/A"}
                      </td>

                      <td>
                        {franja?.fecha}
                        <br />
                        {franja?.horaInicio}
                        {" - "}
                        {franja?.horaFin}
                      </td>

                      <td>

                        <span
                          style={{
                            background: activa
                              ? "#d4edda"
                              : "#f8d7da",
                            color: activa
                              ? "#155724"
                              : "#721c24",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}
                        >
                          {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                        </span>

                      </td>


                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleCancelarReserva(r.id)}
                          disabled={!activa}
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

        </section>

      </main>

      </div>

    //</div>
  );
}
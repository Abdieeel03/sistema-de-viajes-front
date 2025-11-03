"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { obtenerReservas } from "@/services/apiReservas";

export default function MisViajesPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUsuario(user);
    cargarReservas(user._id);
  }, [router]);

  const cargarReservas = async (userId) => {
    try {
      setLoading(true);
      const data = await obtenerReservas(userId);
      // Ordenar por fecha más reciente primero
      const ordenadas = data.sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
      setReservas(ordenadas);
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setError("No se pudieron cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtroEstado === "todos") return true;
    return reserva.estado === filtroEstado;
  });

  const contarPorEstado = (estado) => {
    return reservas.filter((r) => r.estado === estado).length;
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return <span className="badge bg-warning text-dark fs-6">⏳ Pendiente</span>;
      case "confirmado":
        return <span className="badge bg-success fs-6">✅ Confirmado</span>;
      case "cancelado":
        return <span className="badge bg-danger fs-6">❌ Cancelado</span>;
      default:
        return <span className="badge bg-secondary fs-6">{estado}</span>;
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!usuario) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold text-primary mb-2">✈️ Mis Viajes</h1>
        <p className="text-secondary">
          Bienvenido de nuevo, <strong>{usuario.nombre}</strong>
        </p>
      </div>

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2">📋</div>
              <h3 className="h2 fw-bold text-primary mb-1">{reservas.length}</h3>
              <p className="text-secondary small mb-0">Total de reservas</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2">⏳</div>
              <h3 className="h2 fw-bold text-warning mb-1">{contarPorEstado("pendiente")}</h3>
              <p className="text-secondary small mb-0">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2">✅</div>
              <h3 className="h2 fw-bold text-success mb-1">{contarPorEstado("confirmado")}</h3>
              <p className="text-secondary small mb-0">Confirmados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2">❌</div>
              <h3 className="h2 fw-bold text-danger mb-1">{contarPorEstado("cancelado")}</h3>
              <p className="text-secondary small mb-0">Cancelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label fw-semibold small mb-2">Filtrar por estado:</label>
            </div>
            <div className="col-md-9">
              <div className="btn-group w-100" role="group">
                <input type="radio" className="btn-check" name="filtroEstado" id="todos" checked={filtroEstado === "todos"} onChange={() => setFiltroEstado("todos")} />
                <label className="btn btn-outline-primary" htmlFor="todos">
                  📋 Todos ({reservas.length})
                </label>

                <input type="radio" className="btn-check" name="filtroEstado" id="pendiente" checked={filtroEstado === "pendiente"} onChange={() => setFiltroEstado("pendiente")} />
                <label className="btn btn-outline-warning" htmlFor="pendiente">
                  ⏳ Pendientes ({contarPorEstado("pendiente")})
                </label>

                <input type="radio" className="btn-check" name="filtroEstado" id="confirmado" checked={filtroEstado === "confirmado"} onChange={() => setFiltroEstado("confirmado")} />
                <label className="btn btn-outline-success" htmlFor="confirmado">
                  ✅ Confirmados ({contarPorEstado("confirmado")})
                </label>

                <input type="radio" className="btn-check" name="filtroEstado" id="cancelado" checked={filtroEstado === "cancelado"} onChange={() => setFiltroEstado("cancelado")} />
                <label className="btn btn-outline-danger" htmlFor="cancelado">
                  ❌ Cancelados ({contarPorEstado("cancelado")})
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tus reservas...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Sin reservas */}
      {!loading && !error && reservasFiltradas.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: "5rem" }}>
            {filtroEstado === "todos" ? "🧳" : "🔍"}
          </div>
          <h3 className="h4 text-muted mb-3">{filtroEstado === "todos" ? "No tienes reservas aún" : `No tienes reservas ${filtroEstado}s`}</h3>
          <p className="text-secondary mb-4">{filtroEstado === "todos" ? "¡Es hora de planear tu próxima aventura!" : "Intenta cambiar el filtro para ver otras reservas"}</p>
          {filtroEstado === "todos" ? (
            <a href="/destinos" className="btn btn-primary btn-lg">
              🌍 Explorar Destinos
            </a>
          ) : (
            <button className="btn btn-outline-primary" onClick={() => setFiltroEstado("todos")}>
              Ver todas las reservas
            </button>
          )}
        </div>
      )}

      {/* Lista de reservas */}
      {!loading && !error && reservasFiltradas.length > 0 && (
        <div className="row g-4">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva._id} className="col-12">
              <div className="card shadow-sm border-0 hover-card">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Imagen del destino */}
                    <div className="col-md-3">
                      <div
                        style={{
                          height: "180px",
                          backgroundImage: `url("${reserva.idDestino.imagen || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>

                    {/* Información de la reserva */}
                    <div className="col-md-6">
                      <div className="mb-2">{getEstadoBadge(reserva.estado)}</div>
                      <h4 className="fw-bold text-primary mb-2">
                        {reserva.idDestino.nombre}, {reserva.idDestino.pais}
                      </h4>
                      <p className="text-secondary mb-2">
                        <span className="badge bg-info me-2">{reserva.idDestino.tipo}</span>
                        {reserva.idDestino.duracion && <span className="text-muted small">{reserva.idDestino.duracion} días</span>}
                      </p>

                      <div className="row text-secondary small">
                        <div className="col-6 mb-2">
                          <strong>👥 Personas:</strong> {reserva.cantidadPersonas}
                        </div>
                        <div className="col-6 mb-2">
                          <strong>📅 Reservado:</strong> {formatearFecha(reserva.fechaReserva)}
                        </div>
                        <div className="col-6">
                          <strong>📧 Email:</strong> {reserva.contacto.email}
                        </div>
                        {reserva.contacto.telefono && (
                          <div className="col-6">
                            <strong>📞 Teléfono:</strong> {reserva.contacto.telefono}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total y acciones */}
                    <div className="col-md-3 text-center border-start">
                      <p className="text-secondary small mb-1">Total pagado</p>
                      <h2 className="text-success fw-bold mb-3">${reserva.total}</h2>
                      <p className="text-muted small mb-2">
                        ${reserva.idDestino.precio} × {reserva.cantidadPersonas} persona
                        {reserva.cantidadPersonas > 1 ? "s" : ""}
                      </p>

                      {reserva.estado === "pendiente" && (
                        <div className="alert alert-warning small mb-0 mt-3" role="alert">
                          <strong>⏳ En espera</strong>
                          <br />
                          Tu reserva está siendo procesada
                        </div>
                      )}
                      {reserva.estado === "confirmado" && (
                        <div className="alert alert-success small mb-0 mt-3" role="alert">
                          <strong>✅ Confirmado</strong>
                          <br />
                          ¡Tu viaje está listo!
                        </div>
                      )}
                      {reserva.estado === "cancelado" && (
                        <div className="alert alert-danger small mb-0 mt-3" role="alert">
                          <strong>❌ Cancelado</strong>
                          <br />
                          Esta reserva fue cancelada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón para hacer nueva reserva */}
      {!loading && reservas.length > 0 && (
        <div className="text-center mt-5">
          <a href="/destinos" className="btn btn-primary btn-lg px-5">
            ➕ Planear otro viaje
          </a>
        </div>
      )}
    </div>
  );
}

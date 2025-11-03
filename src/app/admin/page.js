"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { obtenerDestinos, crearDestino, eliminarDestino } from "@/services/apiDestinos";
import { obtenerReservas } from "@/services/apiReservas";

export default function AdminPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState("destinos"); // destinos | reservas

  // Estado para destinos
  const [destinos, setDestinos] = useState([]);
  const [loadingDestinos, setLoadingDestinos] = useState(false);

  // Estado para formulario de destino
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    pais: "",
    descripcion: "",
    precio: "",
    imagen: "",
    tipo: "playa",
    fecha: "",
    duracion: "",
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [uploadingImagen, setUploadingImagen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Estado para reservas
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [emailBusqueda, setEmailBusqueda] = useState("");
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Verificar autenticación y rol admin
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.rol !== "admin") {
      router.push("/");
      return;
    }
    setUsuario(user);
  }, [router]);

  // Cargar destinos
  useEffect(() => {
    if (usuario && activeTab === "destinos") {
      cargarDestinos();
    }
  }, [usuario, activeTab]);

  // No cargar reservas automáticamente
  useEffect(() => {
    // Resetear la búsqueda al cambiar de tab
    if (activeTab === "reservas") {
      setBusquedaRealizada(false);
      setEmailBusqueda("");
      setReservasFiltradas([]);
    }
  }, [activeTab]);

  const cargarDestinos = async () => {
    try {
      setLoadingDestinos(true);
      const data = await obtenerDestinos();
      setDestinos(data);
    } catch (err) {
      console.error("Error cargando destinos:", err);
    } finally {
      setLoadingDestinos(false);
    }
  };

  const cargarReservas = async () => {
    try {
      setLoadingReservas(true);
      const data = await obtenerReservas();
      setReservas(data);
      return data;
    } catch (err) {
      console.error("Error cargando reservas:", err);
      return [];
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const subirImagen = async () => {
    if (!imagenArchivo) return null;

    setUploadingImagen(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("imagen", imagenArchivo);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formDataImg,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json();
      return `http://localhost:5000${data.url}`;
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      throw err;
    } finally {
      setUploadingImagen(false);
    }
  };

  const handleSubmitDestino = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitLoading(true);

    try {
      // Si hay una imagen seleccionada, subirla primero
      let imagenUrl = formData.imagen;
      if (imagenArchivo) {
        imagenUrl = await subirImagen();
      }

      const dataToSend = {
        userId: usuario._id,
        nombre: formData.nombre,
        pais: formData.pais,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        imagen: imagenUrl || undefined,
        tipo: formData.tipo,
        fecha: formData.fecha || undefined,
        duracion: formData.duracion ? Number(formData.duracion) : undefined,
      };

      await crearDestino(dataToSend);
      setFormSuccess("✅ Destino creado exitosamente");

      // Limpiar formulario
      setFormData({
        nombre: "",
        pais: "",
        descripcion: "",
        precio: "",
        imagen: "",
        tipo: "playa",
        fecha: "",
        duracion: "",
      });
      setImagenArchivo(null);
      setImagenPreview("");

      await cargarDestinos();
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Error creando destino:", err);
      setFormError(err.message || "Error al crear el destino");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEliminarDestino = async (destinoId, nombreDestino) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar el destino "${nombreDestino}"?\n\nEsta acción no se puede deshacer.`);

    if (!confirmar) return;

    try {
      await eliminarDestino(destinoId, usuario._id);
      await cargarDestinos();
      alert("✅ Destino eliminado exitosamente");
    } catch (err) {
      console.error("Error eliminando destino:", err);
      alert(`❌ Error al eliminar: ${err.message}`);
    }
  };

  const handleBuscarReservas = async () => {
    if (!emailBusqueda.trim()) {
      alert("Por favor ingresa un email para buscar");
      return;
    }

    setBusquedaRealizada(true);
    const todasReservas = await cargarReservas();
    const filtradas = todasReservas.filter((reserva) => reserva.idUsuario.email.toLowerCase().includes(emailBusqueda.toLowerCase()));
    setReservasFiltradas(filtradas);
  };

  const handleLimpiarBusqueda = () => {
    setEmailBusqueda("");
    setReservasFiltradas([]);
    setBusquedaRealizada(false);
  };

  const handleCambiarEstado = async (reservaId, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reservas/${reservaId}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      // Recargar y aplicar filtro de búsqueda
      const todasReservas = await cargarReservas();
      if (emailBusqueda.trim()) {
        const filtradas = todasReservas.filter((reserva) => reserva.idUsuario.email.toLowerCase().includes(emailBusqueda.toLowerCase()));
        setReservasFiltradas(filtradas);
      }
    } catch (err) {
      console.error("Error cambiando estado:", err);
      alert("Error al cambiar el estado de la reserva");
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold text-danger">Panel de Administración</h1>
        <span className="badge bg-danger fs-6">Admin: {usuario.nombre}</span>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "destinos" ? "active" : ""}`} onClick={() => setActiveTab("destinos")}>
            📍 Gestión de Destinos
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "reservas" ? "active" : ""}`} onClick={() => setActiveTab("reservas")}>
            📋 Gestión de Reservas
          </button>
        </li>
      </ul>

      {/* TAB: GESTIÓN DE DESTINOS */}
      {activeTab === "destinos" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4">Destinos Registrados ({destinos.length})</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "❌ Cancelar" : "➕ Crear Nuevo Destino"}
            </button>
          </div>

          {/* Formulario de creación */}
          {showForm && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h3 className="h5 mb-3 text-primary">Crear Nuevo Destino</h3>

                {formError && <div className="alert alert-danger">{formError}</div>}
                {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

                <form onSubmit={handleSubmitDestino}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Nombre del Destino <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej: Machu Picchu" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        País <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="pais" value={formData.pais} onChange={handleInputChange} placeholder="Ej: Perú" required />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Descripción</label>
                      <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows="3" placeholder="Descripción del destino..."></textarea>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Precio (USD) <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleInputChange} placeholder="500" min="0" step="0.01" required />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Tipo <span className="text-danger">*</span>
                      </label>
                      <select className="form-select" name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                        <option value="playa">🏖️ Playa</option>
                        <option value="aventura">🏔️ Aventura</option>
                        <option value="cultural">🏛️ Cultural</option>
                        <option value="familiar">👨‍👩‍👧 Familiar</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Duración (días)</label>
                      <input type="number" className="form-control" name="duracion" value={formData.duracion} onChange={handleInputChange} placeholder="7" min="1" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Fecha de Salida</label>
                      <input type="date" className="form-control" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">URL de Imagen</label>
                      <input type="url" className="form-control" name="imagen" value={formData.imagen} onChange={handleInputChange} placeholder="https://example.com/imagen.jpg" />
                      <small className="text-muted">O sube un archivo abajo</small>
                    </div>

                    <div className="col-12">
                      <div className="border rounded p-3 bg-light">
                        <label className="form-label fw-semibold">📷 Subir Imagen desde tu computadora</label>
                        <input type="file" className="form-control" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleImagenChange} />
                        <small className="text-muted">Formatos permitidos: JPG, PNG, GIF, WEBP (Max: 5MB)</small>

                        {imagenPreview && (
                          <div className="mt-3">
                            <p className="mb-2 fw-semibold">Vista previa:</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imagenPreview}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-success w-100" disabled={submitLoading || uploadingImagen}>
                        {uploadingImagen ? "⏳ Subiendo imagen..." : submitLoading ? "Creando destino..." : "✅ Crear Destino"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lista de destinos */}
          {loadingDestinos ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {destinos.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No hay destinos registrados
                      </td>
                    </tr>
                  ) : (
                    destinos.map((destino) => (
                      <tr key={destino._id}>
                        <td>
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              backgroundImage: `url("${destino.imagen || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop"}")`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "8px",
                            }}
                          ></div>
                        </td>
                        <td className="fw-semibold">{destino.nombre}</td>
                        <td>{destino.pais}</td>
                        <td>
                          <span className="badge bg-info">{destino.tipo}</span>
                        </td>
                        <td className="text-success fw-bold">${destino.precio}</td>
                        <td>{destino.duracion ? `${destino.duracion} días` : "-"}</td>
                        <td>{destino.fecha || "-"}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminarDestino(destino._id, destino.nombre)} title="Eliminar destino">
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: GESTIÓN DE RESERVAS */}
      {activeTab === "reservas" && (
        <div>
          <h2 className="h4 mb-4">Gestión de Reservas</h2>

          {/* Buscador por email */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h3 className="h5 mb-3">🔍 Buscar Reservas por Email</h3>
              <div className="row g-2">
                <div className="col-md-9">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ingresa el email del usuario..."
                    value={emailBusqueda}
                    onChange={(e) => setEmailBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscarReservas();
                      }
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <button className="btn btn-primary w-100" onClick={handleBuscarReservas} disabled={loadingReservas}>
                    {loadingReservas ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </div>
              {busquedaRealizada && (
                <button className="btn btn-link text-decoration-none mt-2 p-0" onClick={handleLimpiarBusqueda}>
                  🔄 Limpiar búsqueda
                </button>
              )}
            </div>
          </div>

          {/* Lista de reservas */}
          {loadingReservas ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Destino</th>
                    <th>Personas</th>
                    <th>Total</th>
                    <th>Fecha Reserva</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!busquedaRealizada ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-muted">
                          <div style={{ fontSize: "3rem" }}>🔍</div>
                          <p className="mb-0 mt-2">Ingresa un email y haz click en &quot;Buscar&quot; para ver las reservas</p>
                        </div>
                      </td>
                    </tr>
                  ) : reservasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No se encontraron reservas para el email: <strong>{emailBusqueda}</strong>
                      </td>
                    </tr>
                  ) : (
                    reservasFiltradas.map((reserva) => (
                      <tr key={reserva._id}>
                        <td className="fw-semibold">{reserva.idUsuario.nombre}</td>
                        <td>{reserva.idUsuario.email}</td>
                        <td>
                          {reserva.idDestino.nombre}, {reserva.idDestino.pais}
                        </td>
                        <td>{reserva.cantidadPersonas}</td>
                        <td className="text-success fw-bold">${reserva.total}</td>
                        <td>{new Date(reserva.fechaReserva).toLocaleDateString("es-ES")}</td>
                        <td>
                          {reserva.estado === "pendiente" && <span className="badge bg-warning text-dark">⏳ Pendiente</span>}
                          {reserva.estado === "confirmado" && <span className="badge bg-success">✅ Confirmado</span>}
                          {reserva.estado === "cancelado" && <span className="badge bg-danger">❌ Cancelado</span>}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            {reserva.estado !== "confirmado" && (
                              <button className="btn btn-outline-success" onClick={() => handleCambiarEstado(reserva._id, "confirmado")} title="Confirmar">
                                ✅
                              </button>
                            )}
                            {reserva.estado !== "cancelado" && (
                              <button className="btn btn-outline-danger" onClick={() => handleCambiarEstado(reserva._id, "cancelado")} title="Cancelar">
                                ❌
                              </button>
                            )}
                            {reserva.estado !== "pendiente" && (
                              <button className="btn btn-outline-warning" onClick={() => handleCambiarEstado(reserva._id, "pendiente")} title="Marcar como pendiente">
                                ⏳
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

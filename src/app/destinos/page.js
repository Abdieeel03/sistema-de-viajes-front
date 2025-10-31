"use client";
import { useEffect, useState } from "react";
import DestinoCard from "@/components/DestinoCard";
import ReservaForm from "@/components/ReservaForm";
import { obtenerDestinos } from "@/services/apiDestinos";

const DESTINOS_POR_PAGINA = 8;

export default function DestinosPage() {
  const [todosDestinos, setTodosDestinos] = useState([]);
  const [destinosMostrados, setDestinosMostrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cantidadMostrada, setCantidadMostrada] = useState(DESTINOS_POR_PAGINA);

  // Modal de reserva
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroPrecio, setFiltroPrecio] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDestinos();
  }, []);

  useEffect(() => {
    let destinosFiltrados = [...todosDestinos];

    // Filtro por tipo
    if (filtroTipo !== "todos") {
      destinosFiltrados = destinosFiltrados.filter((d) => d.tipo === filtroTipo);
    }

    // Filtro por precio
    if (filtroPrecio !== "todos") {
      if (filtroPrecio === "bajo") {
        destinosFiltrados = destinosFiltrados.filter((d) => d.precio < 500);
      } else if (filtroPrecio === "medio") {
        destinosFiltrados = destinosFiltrados.filter((d) => d.precio >= 500 && d.precio <= 1000);
      } else if (filtroPrecio === "alto") {
        destinosFiltrados = destinosFiltrados.filter((d) => d.precio > 1000);
      }
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      destinosFiltrados = destinosFiltrados.filter((d) => d.nombre.toLowerCase().includes(busquedaLower) || d.pais.toLowerCase().includes(busquedaLower) || (d.descripcion && d.descripcion.toLowerCase().includes(busquedaLower)));
    }

    // Limitar cantidad mostrada
    setDestinosMostrados(destinosFiltrados.slice(0, cantidadMostrada));
  }, [todosDestinos, filtroTipo, filtroPrecio, busqueda, cantidadMostrada]);

  const cargarDestinos = async () => {
    try {
      setLoading(true);
      const data = await obtenerDestinos();
      setTodosDestinos(data);
    } catch (err) {
      console.error("Error cargando destinos:", err);
      setError("No se pudieron cargar los destinos");
    } finally {
      setLoading(false);
    }
  };

  const cargarMas = () => {
    setCantidadMostrada((prev) => prev + DESTINOS_POR_PAGINA);
  };

  const limpiarFiltros = () => {
    setFiltroTipo("todos");
    setFiltroPrecio("todos");
    setBusqueda("");
    setCantidadMostrada(DESTINOS_POR_PAGINA);
  };

  const handleReservar = (destino) => {
    setDestinoSeleccionado(destino);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setDestinoSeleccionado(null);
  };

  const handleReservaExitosa = () => {
    alert("✅ ¡Reserva creada exitosamente!\n\nPuedes ver tus reservas en 'Mis Viajes'");
    handleCerrarModal();
  };

  const destinosFiltradosTotal = todosDestinos.filter((d) => {
    let cumple = true;
    if (filtroTipo !== "todos") cumple = cumple && d.tipo === filtroTipo;
    if (filtroPrecio === "bajo") cumple = cumple && d.precio < 500;
    if (filtroPrecio === "medio") cumple = cumple && d.precio >= 500 && d.precio <= 1000;
    if (filtroPrecio === "alto") cumple = cumple && d.precio > 1000;
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      cumple = cumple && (d.nombre.toLowerCase().includes(busquedaLower) || d.pais.toLowerCase().includes(busquedaLower) || (d.descripcion && d.descripcion.toLowerCase().includes(busquedaLower)));
    }
    return cumple;
  });

  const hayMasDestinos = destinosMostrados.length < destinosFiltradosTotal.length;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Explora Nuestros Destinos</h1>
        <p className="lead text-secondary">Encuentra el viaje perfecto para tu próxima aventura</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Búsqueda */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small">🔍 Buscar destino</label>
              <input type="text" className="form-control" placeholder="Nombre, país, descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            {/* Filtro por tipo */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small">🏷️ Tipo de viaje</label>
              <select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="playa">🏖️ Playa</option>
                <option value="aventura">🏔️ Aventura</option>
                <option value="cultural">🏛️ Cultural</option>
                <option value="familiar">👨‍👩‍👧 Familiar</option>
              </select>
            </div>

            {/* Filtro por precio */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small">💰 Rango de precio</label>
              <select className="form-select" value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="bajo">Menos de $500</option>
                <option value="medio">$500 - $1000</option>
                <option value="alto">Más de $1000</option>
              </select>
            </div>

            {/* Botón limpiar */}
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-outline-secondary w-100" onClick={limpiarFiltros}>
                🔄 Limpiar
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-3">
            <small className="text-muted">
              Mostrando <strong>{destinosMostrados.length}</strong> de <strong>{destinosFiltradosTotal.length}</strong> destinos
            </small>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando destinos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Sin destinos */}
      {!loading && !error && destinosMostrados.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3" style={{ fontSize: "4rem" }}>
            🔍
          </div>
          <h3 className="h5 text-muted mb-2">No se encontraron destinos</h3>
          <p className="text-secondary small">Intenta ajustar los filtros de búsqueda</p>
          <button className="btn btn-primary mt-3" onClick={limpiarFiltros}>
            Ver todos los destinos
          </button>
        </div>
      )}

      {/* Grid de destinos */}
      {!loading && !error && destinosMostrados.length > 0 && (
        <>
          <div className="row g-4 mb-4">
            {destinosMostrados.map((destino) => (
              <DestinoCard key={destino._id} destino={destino} onReservar={handleReservar} />
            ))}
          </div>

          {/* Botón cargar más */}
          {hayMasDestinos && (
            <div className="text-center my-5">
              <button className="btn btn-primary btn-lg px-5" onClick={cargarMas}>
                ⬇️ Cargar más destinos
              </button>
              <p className="mt-2 text-muted small">
                Quedan <strong>{destinosFiltradosTotal.length - destinosMostrados.length}</strong> destinos más
              </p>
            </div>
          )}

          {/* Mensaje cuando no hay más */}
          {!hayMasDestinos && destinosFiltradosTotal.length > DESTINOS_POR_PAGINA && (
            <div className="text-center my-5">
              <div className="text-muted">
                <p className="mb-2">✅ Has visto todos los destinos disponibles</p>
                <button className="btn btn-outline-primary btn-sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  ⬆️ Volver arriba
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de reserva */}
      {mostrarModal && destinoSeleccionado && <ReservaForm destino={destinoSeleccionado} onClose={handleCerrarModal} onSuccess={handleReservaExitosa} />}
    </div>
  );
}

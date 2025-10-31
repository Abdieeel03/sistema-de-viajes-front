"use client";
import { useState, useEffect } from "react";
import { getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { crearReserva } from "@/services/apiReservas";

export default function ReservaForm({ destino, onClose, onSuccess }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    cantidadPersonas: 1,
    nombreContacto: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user) {
      alert("Debes iniciar sesión para hacer una reserva");
      router.push("/login");
      onClose();
      return;
    }
    setUsuario(user);
    // Pre-llenar con datos del usuario
    setFormData((prev) => ({
      ...prev,
      nombreContacto: user.nombre || "",
      email: user.email || "",
    }));
  }, [router, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calcularTotal = () => {
    return destino.precio * formData.cantidadPersonas;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const reservaData = {
        idUsuario: usuario._id,
        idDestino: destino._id,
        cantidadPersonas: Number(formData.cantidadPersonas),
        contacto: {
          nombre: formData.nombreContacto,
          telefono: formData.telefono,
          email: formData.email,
        },
      };

      await crearReserva(reservaData);

      if (onSuccess) {
        onSuccess();
      } else {
        alert("✅ ¡Reserva creada exitosamente!\n\nPuedes ver tus reservas en 'Mis Viajes'");
        onClose();
      }
    } catch (err) {
      console.error("Error creando reserva:", err);
      setError(err.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">🎫 Reservar Viaje</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Información del destino */}
            <div className="card mb-4 border-0 bg-light">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div
                      style={{
                        height: "150px",
                        backgroundImage: `url("${destino.imagen || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                  <div className="col-md-8">
                    <h4 className="fw-bold text-primary mb-2">
                      {destino.nombre}, {destino.pais}
                    </h4>
                    <p className="mb-1">
                      <span className="badge bg-info me-2">{destino.tipo}</span>
                      {destino.duracion && <span className="text-secondary small">{destino.duracion} días</span>}
                    </p>
                    {destino.descripcion && <p className="text-secondary small mb-2">{destino.descripcion}</p>}
                    <p className="mb-0">
                      <strong className="text-success fs-5">${destino.precio}</strong>
                      <span className="text-muted small"> por persona</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Cantidad de personas */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Cantidad de personas <span className="text-danger">*</span>
                  </label>
                  <input type="number" className="form-control" name="cantidadPersonas" value={formData.cantidadPersonas} onChange={handleChange} min="1" max="20" required />
                </div>

                {/* Nombre de contacto */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Nombre completo <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" name="nombreContacto" value={formData.nombreContacto} onChange={handleChange} placeholder="Juan Pérez" required />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                </div>

                {/* Teléfono */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>

                {/* Total */}
                <div className="col-12">
                  <div className="card border-primary">
                    <div className="card-body bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 text-secondary small">Total a pagar</p>
                          <p className="mb-0">
                            <span className="text-muted small">
                              ${destino.precio} × {formData.cantidadPersonas} persona{formData.cantidadPersonas > 1 ? "s" : ""}
                            </span>
                          </p>
                        </div>
                        <h3 className="mb-0 text-success fw-bold">${calcularTotal()}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="d-flex gap-2 mt-4">
                <button type="button" className="btn btn-secondary flex-fill" onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success flex-fill" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>✅ Confirmar Reserva</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

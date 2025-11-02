"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUsuario } from "../../services/apiUsuarios";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await registerUsuario(formData);
      setSuccess("Cuenta creada con éxito. Redirigiendo...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (data) {
      console.error(data.message);
      setError(data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "450px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Crear Cuenta</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input type="text" className="form-control" name="nombre" placeholder="Juan Pérez" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" name="email" placeholder="usuario@ejemplo.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" placeholder="********" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-decoration-none text-primary">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

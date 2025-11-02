"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUsuario } from "../../services/apiUsuarios";
import { saveUser } from "../../utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUsuario({ email, password });
      saveUser(data);
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (data) {
      console.error(data);
      setError(data.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Iniciar Sesión</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" placeholder="tuemail@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-decoration-none text-primary">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}

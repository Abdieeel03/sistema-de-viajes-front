"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout, isAdmin, onAuthChange } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Función para actualizar el usuario
    const updateUser = () => {
      setUsuario(getUser());
    };

    // Cargar usuario inicial en el cliente
    updateUser();

    // Suscribirse a cambios en la autenticación
    const unsubscribe = onAuthChange(updateUser);

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    setUsuario(null);
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand text-primary fw-bold">
          TravelGo
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/destinos" className="nav-link">
                Destinos
              </Link>
            </li>

            {usuario && (
              <li className="nav-item">
                <Link href="/mis-viajes" className="nav-link">
                  Mis Viajes
                </Link>
              </li>
            )}

            {isAdmin() && (
              <li className="nav-item">
                <Link href="/admin" className="nav-link text-danger fw-semibold">
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {!usuario ? (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/registro" className="nav-link">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center me-2">
                  <span className="text-secondary small">
                    Hola, <strong>{usuario.nombre}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

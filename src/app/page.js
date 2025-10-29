"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import { obtenerDestinos } from "@/services/apiDestinos";
import { useEffect, useState } from "react";

export default function Home() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDestinos = async () => {
      try {
        setLoading(true);
        const data = await obtenerDestinos();
        // Limitar a los primeros 4 destinos para la página de inicio
        setDestinos(data.slice(0, 4));
      } catch (err) {
        console.error("Error cargando destinos:", err);
        setError("No se pudieron cargar los destinos");
      } finally {
        setLoading(false);
      }
    };

    cargarDestinos();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid px-0">
        <div className="position-relative">
          <div
            className="hero-banner d-flex flex-column align-items-center justify-content-center text-center text-white p-5"
            style={{
              minHeight: "520px",
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "1rem",
            }}
          >
            {/* Hero Title */}
            <div className="mb-4">
              <h1 className="display-3 fw-bold mb-3">Explora. Sueña. Descubre.</h1>
              <p className="lead fs-4">Encuentra tu próximo destino con TravelGo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="container my-5">
        <h2 className="display-6 fw-bold text-dark mb-4">Destinos que te encantarán</h2>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && destinos.length === 0 && (
          <div className="alert alert-info" role="alert">
            No hay destinos disponibles en este momento.
          </div>
        )}

        <div className="row g-4">
          {destinos.map((destino) => (
            <div key={destino._id} className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url("${destino.imagen || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">
                    {destino.nombre}, {destino.pais}
                  </h5>
                  <p className="card-text text-secondary small mb-1">
                    <strong>Tipo:</strong> {destino.tipo}
                  </p>
                  {destino.duracion && (
                    <p className="card-text text-secondary small mb-1">
                      <strong>Duración:</strong> {destino.duracion}
                    </p>
                  )}
                  <p className="card-text text-secondary small mb-3">
                    Desde <span className="fw-bold text-primary fs-5">${destino.precio}</span>
                  </p>
                  <Link href="/destinos" className="btn btn-outline-primary btn-sm mt-auto">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
        .hero-banner {
          animation: fadeIn 0.8s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

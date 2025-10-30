"use client";
import Link from "next/link";

export default function DestinoCard({ destino }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
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
  );
}

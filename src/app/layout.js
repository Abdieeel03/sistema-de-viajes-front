"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../app/globals.css";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="es">
      <head>
        <title>TravelGo - Gestión de Viajes y Reservas</title>
        <meta name="description" content="Sistema de gestión de viajes y reservas turísticas con React y Next.js" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="bg-light text-dark">
        <Navbar />
        <main className="container py-4">{children}</main>
      </body>
    </html>
  );
}

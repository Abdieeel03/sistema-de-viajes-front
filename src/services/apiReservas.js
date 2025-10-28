import { API_URL } from "@/utils/config";

/**
 * Crear una reserva.
 * @param {{ idUsuario, idDestino, cantidadPersonas, contacto: { nombre, telefono, email } }} data
 * @returns {Object} reserva creada (poblada)
 */
export async function crearReserva(data) {
  const res = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Error creando reserva");
  return body;
}

/**
 * Obtener reservas. Si pasas userId, devuelve solo las reservas de ese usuario.
 * @param {string|null} userId
 * @returns {Array}
 */
export async function obtenerReservas(userId = null) {
  let url = `${API_URL}/reservas`;
  if (userId) url += `?userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error obteniendo reservas");
  return res.json();
}

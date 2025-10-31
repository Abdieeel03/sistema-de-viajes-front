import { API_URL } from "@/utils/config";

/**
 * Obtener todos los destinos.
 * @returns {Array}
 */
export async function obtenerDestinos() {
  const res = await fetch(`${API_URL}/destinos`);
  if (!res.ok) throw new Error("Error obteniendo destinos");
  return res.json();
}

/**
 * Crear un nuevo destino.
 * Nota: el backend verifica el rol admin usando userId en el body.
 * @param {{ userId, nombre, pais, descripcion, precio, imagen, tipo, fecha, duracion }} data
 * @returns {Object} destino creado
 */
export async function crearDestino(data) {
  const res = await fetch(`${API_URL}/destinos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Error creando destino");
  return body;
}

/**
 * Eliminar un destino (solo admin).
 * @param {string} destinoId - ID del destino a eliminar
 * @param {string} userId - ID del usuario admin
 * @returns {Object} respuesta del servidor
 */
export async function eliminarDestino(destinoId, userId) {
  const res = await fetch(`${API_URL}/destinos/${destinoId}?userId=${userId}`, {
    method: "DELETE",
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Error eliminando destino");
  return body;
}

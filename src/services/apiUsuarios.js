import { API_URL } from "@/utils/config";

/**
 * Registra un usuario.
 * @param {{ nombre, email, contraseña, rol? }} data
 * @returns {Object} usuario creado (sin contraseña) o lanza Error
 */
export async function registerUsuario(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Error registrando usuario");
  return body;
}

/**
 * Login de usuario.
 * @param {{ email, contraseña }} credentials
 * @returns {Object} usuario (sin contraseña) o lanza Error
 */
export async function loginUsuario(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Error en login");
  return body;
}

/**
 * (Opcional) Obtener todos los usuarios
 */
export async function obtenerUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error obteniendo usuarios");
  return res.json();
}

const STORAGE_KEY = "travelgo_usuario";

/**
 * Evento personalizado para notificar cambios en la autenticación
 */
const AUTH_CHANGE_EVENT = "travelgo_auth_change";

/**
 * Dispara un evento personalizado cuando cambia el estado de autenticación
 */
function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Suscribirse a cambios en la autenticación
 * @param {Function} callback - función a ejecutar cuando cambie la autenticación
 * @returns {Function} función para cancelar la suscripción
 */
export function onAuthChange(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}

/**
 * Guarda el objeto usuario en localStorage.
 * @param {Object} user - objeto usuario devuelto por el backend (id, nombre, email, rol)
 */
export function saveUser(user) {
  if (typeof window === "undefined" || !user) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange();
}

/**
 * Obtiene el usuario guardado en localStorage o null si no hay.
 * @returns {Object|null}
 */
export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error parseando user en localStorage", e);
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  notifyAuthChange();
}

export function isLogged() {
  if (typeof window === "undefined") return false;
  return !!getUser();
}

export function isAdmin() {
  if (typeof window === "undefined") return false;
  const u = getUser();
  return u && u.rol === "admin";
}

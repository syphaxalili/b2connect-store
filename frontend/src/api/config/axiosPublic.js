import axios from "axios";

/**
 * Instance Axios pour les requêtes publiques (sans intercepteur)
 * 
 * Utilisée pour:
 * - Authentification (login, register)
 * - Réinitialisation de mot de passe
 * - Hydratation (getCurrentUser)
 * 
 * Caractéristiques:
 * - Pas d'intercepteur de refresh
 * - Les erreurs 401 sont propagées normalement
 * - Envoie les cookies (withCredentials: true)
 */
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default axiosPublic;

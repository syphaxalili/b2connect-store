import axios from "axios";
import store from "../../store";
import { startLoading, stopLoading } from "../../store/slices/loadingSlice";

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
 * - Gère le loading global via Redux
 */
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Intercepteur de requête - Démarrer le loading
axiosPublic.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Arrêter le loading
axiosPublic.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

export default axiosPublic;

import axios from "axios";
import store from "../../store";
import { clearCredentials } from "../../store/slices/authSlice";
import { resetCart } from "../../store/slices/cartSlice";
import { startLoading, stopLoading } from "../../store/slices/loadingSlice";
import axiosPublic from "./axiosPublic";

/**
 * Instance Axios pour les requêtes authentifiées
 *
 * Caractéristiques:
 * - Envoie automatiquement les cookies HttpOnly
 * - Intercepte les erreurs 401 pour rafraîchir automatiquement l'access token
 * - Gère la concurrence (race conditions) si plusieurs requêtes échouent en même temps
 * - Rejoue les requêtes originales après un refresh réussi
 * - Déconnecte l'utilisateur si le refresh échoue
 */
const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

/**
 * ============================================================================
 * GESTION DE LA CONCURRENCE (RACE CONDITION)
 * ============================================================================
 *
 * Si plusieurs requêtes API échouent (401) en même temps, nous ne voulons
 * lancer l'appel /refresh qu'UNE SEULE fois.
 */

// 'isRefreshing' agit comme un "verrou" (lock)
let isRefreshing = false;
// 'failedQueue' stocke les requêtes qui ont échoué pendant le refresh
let failedQueue = [];

/**
 * Traite la file d'attente des requêtes en attente
 * @param {Error|null} error - Erreur si le refresh a échoué
 * @param {boolean|null} token - Token si le refresh a réussi (on passe 'true')
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Rejeter la promesse de la requête en attente
    } else {
      prom.resolve(token); // Résoudre la promesse (ce qui va la rejouer)
    }
  });
  failedQueue = []; // Vider la file d'attente
};

/**
 * ============================================================================
 * INTERCEPTEUR DE REQUÊTE - Démarrer le Loading
 * ============================================================================
 */
axiosPrivate.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

/**
 * ============================================================================
 * INTERCEPTEUR DE RÉPONSE - Refresh Automatique + Arrêter le Loading
 * ============================================================================
 * Gère les erreurs 401 en rafraîchissant automatiquement le token
 */

axiosPrivate.interceptors.response.use(
  (response) => {
    // Cas normal : la requête a réussi
    store.dispatch(stopLoading());
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ❌ Pas une erreur 401? Propager l'erreur.
    // (Ex: 500, 404, 403... ce n'est pas notre problème)
    if (error.response?.status !== 401) {
      store.dispatch(stopLoading());
      return Promise.reject(error);
    }

    // Protection: Si on a déjà essayé de refresh, ne pas boucler
    if (originalRequest._retry) {
      // Déconnexion complète
      store.dispatch(stopLoading());
      store.dispatch(clearCredentials());
      store.dispatch(resetCart());
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('cart');
      
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Un refresh est déjà en cours
    // → Mettre la requête en file d'attente
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosPrivate(originalRequest)) // Rejouer après succès
        .catch((err) => Promise.reject(err)); // Propager l'erreur après échec
    }

    // C'est la première requête 401 : on lance le refresh.
    originalRequest._retry = true; // Marquer qu'on a déjà essayé
    isRefreshing = true; // Poser le "verrou"

    try {
      await axiosPublic.post("/auth/refresh");

      // ✅ Refresh réussi !
      processQueue(null, true); // Traiter la file d'attente (succès)
      isRefreshing = false; // Libérer le "verrou"

      // Rejouer la requête originale qui avait échoué
      return axiosPrivate(originalRequest);
    } catch (refreshError) {
      // ⛔ LE REFRESH A ÉCHOUÉ (le refresh_token est mort)
      processQueue(refreshError, null); // Traiter la file d'attente (échec)
      isRefreshing = false; // Libérer le "verrou"

      // 1. Déconnecter l'utilisateur (Redux)
      store.dispatch(clearCredentials());
      
      // 2. Nettoyer le panier (Redux)
      store.dispatch(resetCart());
      
      // 3. Nettoyer le localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('cart'); // Panier invité

      // 4. Forcer la redirection vers le login
      // C'est une mesure "forte" mais efficace pour nettoyer l'état
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);

export default axiosPrivate;

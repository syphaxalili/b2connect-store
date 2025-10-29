import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsLoading
} from "../store/slices/authSlice";

/**
 * Hook personnalisé pour accéder facilement à l'état d'authentification
 *
 * @returns {Object} État d'authentification
 * @returns {Object|null} user - Utilisateur courant { id, name, email, role }
 * @returns {boolean} isAuthenticated - True si l'utilisateur est connecté
 * @returns {boolean} isLoading - True pendant l'hydratation initiale
 * @returns {boolean} isAdmin - True si l'utilisateur est admin
 */
export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isAdmin = useSelector(selectIsAdmin);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin
  };
};

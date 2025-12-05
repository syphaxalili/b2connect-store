import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../api";
import { clearCredentials } from "../store/slices/authSlice";
import { resetCart } from "../store/slices/cartSlice";
import { useSnackbar } from "./useSnackbar";

/**
 * Hook personnalisé pour gérer la déconnexion
 * Centralise la logique de logout pour éviter la duplication
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const logout = async (redirectTo = "/") => {
    try {
      // Appeler l'API de déconnexion
      await logoutAPI();
      
      // Nettoyer le state Redux
      dispatch(clearCredentials());
      dispatch(resetCart());
      
      // Rediriger
      navigate(redirectTo);
    } catch {
      // Même en cas d'erreur, nettoyer le state local
      dispatch(clearCredentials());
      dispatch(resetCart());
      
      // Afficher le message d'erreur
      showError("Erreur lors de la déconnexion");
      
      // Rediriger quand même
      navigate(redirectTo);
    }
  };

  return { logout };
};

export default useLogout;

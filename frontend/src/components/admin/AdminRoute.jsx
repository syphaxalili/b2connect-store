import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/storage";

const AdminRoute = ({ children }) => {
  // Vérifier si l'utilisateur est authentifié
  // TODO: Ajouter la vérification du rôle admin quand le backend sera prêt
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;

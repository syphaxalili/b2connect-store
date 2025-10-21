import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../../utils/storage";

const mapStateToProps = (state) => ({ user: state.auth });

const AdminRoute = ({ children, user }) => {
  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur est admin
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default connect(mapStateToProps)(AdminRoute);

import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/storage";

const PrivateRoute = ({ children }) => {
  const token = isAuthenticated();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

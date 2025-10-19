import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check both localStorage and sessionStorage for token
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

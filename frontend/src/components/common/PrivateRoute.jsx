import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Assumes JWT is stored in localStorage
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
import { Navigate, Route } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import { useAuth } from "../hooks/useAuth";
import { Login, Register, ResetPassword } from "../pages/auth";

const AuthRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Route path="*" element={<LoadingScreen />} />;
  }

  return (
    <>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />}
      />
    </>
  );
};

export default AuthRouter;

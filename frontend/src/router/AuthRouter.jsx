import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const AuthRouter = () => {
  const { isAuthenticated} = useAuth();

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

import { Navigate, Route } from "react-router-dom";

import { Login, Register, ResetPassword } from "../pages/auth";
import { isAuthenticated } from "../utils/storage";

const AuthRouter = () => {
  return (
    <>
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated() ? <Navigate to="/" /> : <ResetPassword />}
      />
    </>
  );
};

export default AuthRouter;

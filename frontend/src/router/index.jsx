import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/Home";
import { isAuthenticated } from "../utils/storage";
import AdminRouter from "./AdminRouter";
import AdminRoute from "./route-gards/AdminRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
      <Route
        path={"/admin/*"}
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {AdminRouter()}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

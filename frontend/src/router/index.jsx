import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import WhoAreWe from "../pages/WhoAreWe";
import Contact from "../pages/Contact";
import { isAuthenticated } from "../utils/storage";
import AdminRouter from "./AdminRouter";
import AdminRoute from "./route-gards/AdminRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/who-are-we" element={<WhoAreWe />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
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

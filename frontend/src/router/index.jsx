import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin";
import AuthFormLayout from "../layouts/auth";
import ClientLayout from "../layouts/client";
import AdminRouter from "./AdminRouter";
import AuthRouter from "./AuthRouter";
import ClientRouter from "./ClientRouter";
import AdminPrivateRoute from "./route-gards/AdminPrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>{ClientRouter()}</Route>

      <Route element={<AuthFormLayout />}>{AuthRouter()}</Route>

      <Route
        path={"/admin/*"}
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        {AdminRouter()}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import { AdminLayout, AuthFormLayout, ClientLayout } from "../layouts";
import AdminRouter from "./AdminRouter";
import AuthRouter from "./AuthRouter";
import ClientRouter from "./ClientRouter";
import AdminPrivateRoute from "./route-gards/AdminPrivateRoute";

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
    </Suspense>
  );
};

export default AppRouter;

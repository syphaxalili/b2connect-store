import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import { AdminLayout, ClientLayout } from "../layouts";
import AdminRouter from "./AdminRouter";
import ClientRouter from "./ClientRouter";
import AdminPrivateRoute from "./route-gards/AdminPrivateRoute";

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<ClientLayout />}>{ClientRouter()}</Route>

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

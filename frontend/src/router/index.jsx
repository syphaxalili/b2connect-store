import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout";
import HomePageLayout from "../layouts/public/HomePageLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import WhoAreWe from "../pages/WhoAreWe";
import { isAuthenticated } from "../utils/storage";
import AdminRouter from "./AdminRouter";
import AdminRoute from "./route-gards/AdminRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes with HomePageLayout */}
      <Route element={<HomePageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/who-are-we" element={<WhoAreWe />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth routes without layout */}
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

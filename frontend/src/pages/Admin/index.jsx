import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";
import ProductsPage from "./ProductsPage";
import UsersPage from "./UsersPage";

function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/categories" replace />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default Admin;

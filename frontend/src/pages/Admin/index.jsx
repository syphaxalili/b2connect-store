import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";
import ProductsPage from "./ProductsPage";
import UsersPage from "./UsersPage";

// Mock user data - à remplacer par les vraies données de l'utilisateur connecté
const mockAdminUser = {
  name: "Admin User",
  email: "admin@b2connect.com",
  photo: null
};

function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout user={mockAdminUser} />}>
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

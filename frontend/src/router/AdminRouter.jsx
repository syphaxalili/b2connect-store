import { Navigate, Route } from "react-router-dom";

// Layouts
// Admin Pages
import CategoriesPage from "../pages/Admin/CategoriesPage";
import CategoryDetails from "../pages/Admin/CategoryDetails";
import CategoryForm from "../pages/Admin/CategoryForm";
import OrdersPage from "../pages/Admin/OrdersPage";
import ProductsPage from "../pages/Admin/ProductsPage";
import UsersPage from "../pages/Admin/UsersPage";

const AdminRouter = () => {
  return (
    <>
      <Route index element={<Navigate to="/admin/categories" replace />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="categories/new" element={<CategoryForm />} />
      <Route path="categories/:id" element={<CategoryDetails />} />
      <Route path="categories/:id/edit" element={<CategoryForm />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="users" element={<UsersPage />} />
    </>
  );
};

export default AdminRouter;

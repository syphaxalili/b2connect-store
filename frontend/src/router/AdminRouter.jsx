import { Navigate, Route } from "react-router-dom";

import CategoriesPage from "../pages/admin/Categories";
import CategoryDetails from "../pages/admin/Categories/CategoryDetails";
import CategoryForm from "../pages/admin/Categories/CategoryForm";
import OrdersPage from "../pages/admin/Orders";
import ProductsPage from "../pages/admin/Products";
import UsersPage from "../pages/admin/Users";

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

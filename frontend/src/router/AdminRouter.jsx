import { Navigate, Route } from "react-router-dom";

import CategoriesPage from "../pages/admin/Categories";
import CategoryDetails from "../pages/admin/Categories/CategoryDetails";
import CategoryForm from "../pages/admin/Categories/CategoryForm";
import OrdersPage from "../pages/admin/Orders";
import OrderDetails from "../pages/admin/Orders/OrderDetails";
import ProductsPage from "../pages/admin/Products";
import ProductDetails from "../pages/admin/Products/ProductDetails";
import ProductForm from "../pages/admin/Products/ProductForm";
import UsersPage from "../pages/admin/Users";
import UserDetails from "../pages/admin/Users/UserDetails";
import UserForm from "../pages/admin/Users/UserForm";

const AdminRouter = () => {
  return (
    <>
      <Route index element={<Navigate to="/admin/categories" replace />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="categories/new" element={<CategoryForm />} />
      <Route path="categories/:id" element={<CategoryDetails />} />
      <Route path="categories/:id/edit" element={<CategoryForm />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="orders/:id" element={<OrderDetails />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="users/new" element={<UserForm />} />
      <Route path="users/:id" element={<UserDetails />} />
      <Route path="users/:id/edit" element={<UserForm />} />
    </>
  );
};

export default AdminRouter;

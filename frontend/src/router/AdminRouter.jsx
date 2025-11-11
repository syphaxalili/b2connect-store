import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

const CategoriesTable = lazy(() => import("../pages/admin/Categories/CategoriesTable"));
const CategoriesDetails = lazy(() => import("../pages/admin/Categories/CategoriesDetails"));
const CategoriesForm = lazy(() => import("../pages/admin/Categories/CategoriesForm"));

const OrdersTable = lazy(() => import("../pages/admin/Orders/OrdersTable"));
const OrdersDetails = lazy(() => import("../pages/admin/Orders/OrdersDetails"));

const ProductsTable = lazy(() => import("../pages/admin/Products/ProductsTable"));
const ProductsDetails = lazy(() => import("../pages/admin/Products/ProductsDetails"));
const ProductsForm = lazy(() => import("../pages/admin/Products/ProductsForm"));

const UsersTable = lazy(() => import("../pages/admin/Users/UsersTable"));
const UsersDetails = lazy(() => import("../pages/admin/Users/UsersDetails"));
const UsersForm = lazy(() => import("../pages/admin/Users/UsersForm"));

const AdminRouter = () => {
  return (
    <>
      <Route index element={<Navigate to="/admin/categories" replace />} />

      <Route path="categories" element={<CategoriesTable />} />
      <Route path="categories/:id" element={<CategoriesDetails />} />
      <Route path="categories/new" element={<CategoriesForm />} />
      <Route path="categories/:id/edit" element={<CategoriesForm />} />

      <Route path="orders" element={<OrdersTable />} />
      <Route path="orders/:id" element={<OrdersDetails />} />

      <Route path="products" element={<ProductsTable />} />
      <Route path="products/:id" element={<ProductsDetails />} />
      <Route path="products/new" element={<ProductsForm />} />
      <Route path="products/:id/edit" element={<ProductsForm />} />

      <Route path="users" element={<UsersTable />} />
      <Route path="users/:id" element={<UsersDetails />} />
      <Route path="users/new" element={<UsersForm />} />
      <Route path="users/:id/edit" element={<UsersForm />} />
    </>
  );
};

export default AdminRouter;

import { Navigate, Route } from "react-router-dom";

import {
  CategoriesDetails,
  CategoriesForm,
  CategoriesTable,
  OrdersDetails,
  OrdersTable,
  ProductsDetails,
  ProductsForm,
  ProductsTable,
  UsersDetails,
  UsersForm,
  UsersTable
} from "../pages/admin";

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

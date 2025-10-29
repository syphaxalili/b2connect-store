import { Route } from "react-router-dom";

import {
  Cart,
  Checkout,
  Contact,
  Home,
  Orders,
  ProductDetails,
  Profile,
  WhoAreWe
} from "../pages/client";

const ClientRouter = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/who-are-we" element={<WhoAreWe />} />
      <Route path="/contact" element={<Contact />} />
    </>
  );
};

export default ClientRouter;

import { lazy } from "react";
import { Route } from "react-router-dom";
import AuthRouter from "./AuthRouter";
const Home = lazy(() => import("../pages/client/Home"));
const Cart = lazy(() => import("../pages/client/Cart"));
const Checkout = lazy(() => import("../pages/client/Checkout"));
const Contact = lazy(() => import("../pages/client/Contact"));
const Orders = lazy(() => import("../pages/client/Orders"));
const PaymentSuccess = lazy(() => import("../pages/client/PaymentSuccess"));
const ProductDetails = lazy(() => import("../pages/client/ProductDetails"));
const Profile = lazy(() => import("../pages/client/Profile"));
const WhoAreWe = lazy(() => import("../pages/client/WhoAreWe"));

const ClientRouter = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/who-are-we" element={<WhoAreWe />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Router intégré dans le ClientLayout */}
      {AuthRouter()}
    </>
  );
};

export default ClientRouter;

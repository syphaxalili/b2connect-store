const { Router } = require("express");
const router = Router();

const userRoutes = require("./users");
const categoryRoutes = require("./categories");
const productRoutes = require("./products");
const orderRoutes = require("./orders");
const paymentRoutes = require("./payments");
const authRoutes = require("./auth");
const cartRoutes = require("./cart");
const stripeRoutes = require("./stripe");

router.get("/health", (req, res) => {
  res.status(200).json({ message: "Backend is healthy" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/cart", cartRoutes);
router.use("/stripe", stripeRoutes);

module.exports = router;

import express from "express";
import { readDB, writeDB } from "../utils/fileHandler.js";

const router = express.Router();


router.post("/", (req, res) => {
  const { productId, quantity } = req.body;
  const db = readDB();

  const product = db.products.find(p => p.id === productId);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  if (product.stock < quantity)
    return res.status(400).json({ message: "Insufficient stock" });

  const order = {
    id: db.orders.length + 1,
    productId,
    quantity,
    totalAmount: product.price * quantity,
    status: "placed",
    createdAt: new Date().toISOString().split("T")[0]
  };

  product.stock -= quantity;
  db.orders.push(order);
  writeDB(db);

  res.status(201).json(order);
});

router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

router.delete("/:id", (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id == req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  if (order.status === "cancelled")
    return res.status(400).json({ message: "Already cancelled" });

  const today = new Date().toISOString().split("T")[0];
  if (order.createdAt !== today)
    return res.status(400).json({ message: "Cannot cancel" });

  order.status = "cancelled";

  const product = db.products.find(p => p.id === order.productId);
  product.stock += order.quantity;

  writeDB(db);
  res.json(order);
});

router.patch("/change-status/:id", (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const order = db.orders.find(o => o.id == req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  if (order.status === "cancelled" || order.status === "delivered")
    return res.status(400).json({ message: "Status change not allowed" });

  const flow = {
    placed: "shipped",
    shipped: "delivered"
  };

  if (flow[order.status] !== status)
    return res.status(400).json({ message: "Invalid status change" });

  order.status = status;
  writeDB(db);

  res.json(order);
});

export default router;

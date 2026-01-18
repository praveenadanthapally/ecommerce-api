import express from "express";
import { readDB, writeDB } from "../utils/fileHandler.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { name, price, stock } = req.body;
  const db = readDB();

  const product = {
    id: db.products.length + 1,
    name,
    price,
    stock
  };

  db.products.push(product);
  writeDB(db);

  res.status(201).json(product);
});

router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

export default router;

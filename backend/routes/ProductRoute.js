import express from "express";
import { getProduct, getProductById, saveProduct, updateProduct, deleteProduct } from "../controllers/ProductController.js";

const router = express.Router();

router.get("/product", getProduct);
router.get("/product/:id", getProductById);

router.post("/product", saveProduct);
router.patch("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;

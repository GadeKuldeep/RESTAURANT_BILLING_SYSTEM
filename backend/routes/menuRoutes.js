import express from "express";
import {
  getMenu,
  addItem,
  updateItem,
  deleteItem
} from "../controllers/menuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getMenu);
router.post("/", addItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;

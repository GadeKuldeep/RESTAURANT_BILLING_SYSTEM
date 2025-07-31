import express from "express";
import { generateBill } from "../controllers/billController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", generateBill);

export default router;

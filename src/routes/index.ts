
import { Router } from "express";
import blogRoutes from "./blogRoutes";
import imageRoutes from "./imageRoutes";
import userRoutes from "./userRoutes";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

router.use("/blogs", authMiddleware, blogRoutes);
router.use("/images", authMiddleware, imageRoutes);
router.use("/users", userRoutes);

export default router;

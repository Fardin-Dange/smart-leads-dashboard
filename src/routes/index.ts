import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.routes";
import leadRoutes from "./lead.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);

export default router;

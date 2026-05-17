import { Router } from "express";
import { adminOnlyExample, getMe, login, register } from "../controllers/auth.controller";
import { authorize, protect } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", protect, getMe);
router.get("/admin", protect, authorize("admin"), adminOnlyExample);

export default router;

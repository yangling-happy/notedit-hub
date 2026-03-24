import "dotenv/config";
import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router: Router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", auth, me);

export default router;

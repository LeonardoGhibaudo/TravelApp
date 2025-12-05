import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.controller.js"
import { logout } from "../controllers/auth.controller.js"


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh)
router.post("/logout", logout)
export default router;

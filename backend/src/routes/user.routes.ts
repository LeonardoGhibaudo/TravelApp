import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware , (req,res) => {
    return res.json({
        message: "accesso autorizzato",
        user: req.user
    });
} );

export default router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getNotifications, readNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:notificationId/read", authMiddleware, readNotification);

export default router;

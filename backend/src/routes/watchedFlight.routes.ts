import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addWatchedFlight, getWatchedFlights, removeWatchedFlight } from "../controllers/watchedFlight.controller.js";

const router = Router();

router.post("/", authMiddleware, addWatchedFlight);
router.get("/", authMiddleware, getWatchedFlights);
router.delete("/:id", authMiddleware, removeWatchedFlight);

export default router;

import { Router } from "express";
import { searchFlights, snapshotFlight, getFlightsByTrip } from "../controllers/amadeus.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/search", searchFlights)
router.post("/snapshot", snapshotFlight)
router.get("/:tripId", authMiddleware, getFlightsByTrip)

export default router;

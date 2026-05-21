import { Router } from "express";
import { searchFlights, snapshotFlight, getFlightsByTrip, searchLocations } from "../controllers/amadeus.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/search", searchFlights)
router.get("/locations", searchLocations)
router.post("/snapshot", authMiddleware, snapshotFlight)
router.get("/:tripId", authMiddleware, getFlightsByTrip)

export default router;

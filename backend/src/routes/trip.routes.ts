import Router from "express";
import { createTrip, getMyTrips, getTripsById } from "../controllers/trip.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"



const router = Router();

router.post("/", authMiddleware , createTrip)
router.get("/", authMiddleware, getMyTrips)
router.get("/:tripId", authMiddleware, getTripsById)

export default router;

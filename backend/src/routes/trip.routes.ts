import Router from "express";
import { createTrip, getMyTrips, getTripsById, createTripStops, updateTripStops } from "../controllers/trip.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"



const router = Router();

router.post("/", authMiddleware , createTrip)
router.get("/", authMiddleware, getMyTrips)
router.get("/:tripId", authMiddleware, getTripsById)
router.get("/:tripId/stops", authMiddleware, createTripStops)
router.patch("/:tripId/stops/:stopsId", authMiddleware, updateTripStops)


export default router;
